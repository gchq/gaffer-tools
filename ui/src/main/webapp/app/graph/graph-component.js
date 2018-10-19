/*
 * Copyright 2017-2018 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

angular.module('app').component('graph', graphView());

function graphView() {

    return {
        templateUrl: 'app/graph/graph.html',
        controller: GraphController,
        controllerAs: 'ctrl',
        bindings: {
            selectedElements: '='
        }
    };
}


function GraphController($q, graph, config, error, loading, query, settings, types, schema, results, common, operationChain, operationService, events, $scope) {
    var vm = this;
    vm.graphLoading = true;    // used for the loading spinner

    var tappedBefore;
    var tappedTimeout;
    var cytoscapeGraph;    // Internal graph model which gets reloaded every time graph page is loaded.

    var graphData = {entities: {}, edges: {}};  // Some in between model filling the gap between results and cytoscape models - could now be redundent

    var configuration = {
        name: 'cytoscape-ngraph.forcelayout',
        async: {
            maxIterations: 1000,
            stepsPerCycle: 50,
            waitForStep: true
        },
        physics: {
             "springLength": 30,
             "springCoeff": 0.000001,
             "gravity": -4,
             "dragCoeff": 0.005,
             "stableThreshold": 0.000001,
             "fit": true
        },
        iterations: 10000,
        fit: true,
        animate: false,
        defaultStyle: {
            edges: {
                'curve-style': 'bezier',
                'min-zoomed-font-size': 35,
                'text-outline-color': '#538212',
                'text-outline-width': 3,
                'line-color': '#538212',
                'target-arrow-color': '#538212',
                'target-arrow-shape': 'triangle',
                'font-size': 14,
                'color': '#FFFFFF',
                'width': 5
            },
            vertices: {
                'height': 30,
                'width': 30,
                'min-zoomed-font-size': 20,
                'font-size': 14,
                'text-valign': 'center',
                'color': '#333333',
                'text-outline-color': '#FFFFFF',
                'background-color': '#FFFFFF',
                'text-outline-width': 3
            },
            entityWrapper: {
                'height': 60,
                'width': 60,
                'border-width': 2,
                "border-color": "#55555"
            }
        }
    };

    vm.$onInit = function() {
        // First check selected elements is injected. Throw an error if not.
        if (!vm.selectedElements) {
            throw 'Graph view must have selected elements injected into it'
        }

        // Then get configuration
        var conf = graph.getGraphConfiguration()
        if (!conf) {
            config.get().then(function(appConfig) {
                var graphConfig = appConfig.graph;
                if (graphConfig) {

                    if(graphConfig.physics) {
                        angular.merge(configuration.physics, graphConfig.physics);
                    }
                    if (graphConfig.style) {
                        configuration.style = graphConfig.style;
                    }
                    if (graphConfig.defaultStyle) {
                        angular.merge(configuration.defaultStyle, graphConfig.defaultStyle);
                    }
                }
                // Cache for next time
                graph.setGraphConfiguration(configuration);
                // Load the graph
                load();
            });
        } else {
            configuration = conf;
            load();
        }

        events.subscribe('incomingResults', vm.update);
    
        events.subscribe('resultsCleared', vm.reset);
    }

    vm.$onDestroy = function() {
        events.unsubscribe('incomingResults', vm.update);
        events.unsubscribe('resultsCleared', vm.reset);

        if (cytoscapeGraph) {
            cytoscapeGraph.destroy();
        }
    }

    /**
     * Loads cytoscape graph onto an element containing the "graphCy" id. It also registers the
     * handlers for select and deselect events.
     */
    var createCytoscapeGraph = function() {
        var deferred = $q.defer();
        // Consider whether elements could be persisted in the service - thereby reducing overall load time (Take into account how to deal with reset calls)

        var cytoscapeGraph = cytoscape({
            container: $('#graphCy')[0],
            style: [
                {
                    selector: 'node',
                    style: {
                        'content': 'data(label)'
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'label': 'data(group)'
                    }
                },
                {
                    selector: ':selected',
                    style: {
                        'overlay-color': "#000000",
                        'overlay-opacity': 0.3,
                        'overlay-padding': 10
                    }
                },
                {
                    selector: '.filtered',
                    css: {
                       display: "none"
                    }
                }
            ],
            layout: configuration,
            elements: [],
            ready: function() {
                deferred.resolve( cytoscapeGraph );
            }
        });

        cytoscapeGraph.on('select', function(evt){
            select(evt.cyTarget);
        });

        cytoscapeGraph.on('unselect', function(evt){
            unSelect(evt.cyTarget);
        })

        cytoscapeGraph.on('tap', function(event) {
            var tappedNow = event.cyTarget;
            if (tappedTimeout && tappedBefore) {
                clearTimeout(tappedTimeout);
            }
            if(tappedBefore === tappedNow) {
                tappedNow.trigger('doubleTap');
                tappedBefore = null;
            } else {
                tappedTimeout = setTimeout(function(){ tappedBefore = null; }, 300);
                tappedBefore = tappedNow;
            }
        });

        cytoscapeGraph.on('remove', function(evt) {
            removeFromGraphData(evt.cyTarget);
            unSelect(evt.cyTarget);
        });

        cytoscapeGraph.on('doubleTap', 'node', vm.quickHop);

        return deferred.promise;
    }

    var load = function() {
        createCytoscapeGraph().then(function(cy) {
            cytoscapeGraph = cy;
            vm.graphLoading = false;
            vm.reset()
            var searchTerm = graph.getSearchTerm();
            
            if (searchTerm !== null && searchTerm !== undefined && searchTerm !== "") {
                vm.filter(searchTerm)
            }
        });
    }


    var removeFromGraphData = function(element) {
        var id = element.id();
        delete graphData.edges[id]
        delete graphData.entities[id];
    }

    /**
     * Defines the behaviour when an element in cytoscape is selected.
     * First attempts to select an entity, then edge, then vertex.
     * @param {Object} element
     */
    function select(element) {
        // Not in the scope of this issue but this could be made more efficient
        if(selectEntityId(element.id())) {
            return;
        }

        if(selectEdgeId(element.id())) {
            return;
        }

        selectVertex(element.id());
    }

    var getEdgeStyling = function(group) {
        if (!configuration.style || !configuration.style.edges || !configuration.style.edges[group]) {
            return configuration.defaultStyle.edges;
        }

        var copy = angular.copy(configuration.defaultStyle.edges);
        angular.merge(copy, configuration.style.edges[group]);

        return copy;
    }

    var getNodeStyling = function(vertexType, id) {
        var style = angular.copy(configuration.defaultStyle.vertices);

        if (!configuration.style) {
            if (common.objectContainsValue(graphData.entities, id)) {
                angular.merge(style, configuration.defaultStyle.entityWrapper);
            }
            return style;
        }

        var customVertexStyling = configuration.style.vertexTypes ? configuration.style.vertexTypes[Object.keys(vertexType)[0]] : null;
        if (customVertexStyling) {
            angular.merge(style, customVertexStyling.style);

            if (customVertexStyling.fieldOverrides) {
                var vertexClass = Object.values(vertexType)[0].class;
                var vertexParts = types.createParts(vertexClass, JSON.parse(id));
                for (var fieldName in customVertexStyling.fieldOverrides) {
                    if (vertexParts[fieldName]) {
                        if (common.objectContainsValue(customVertexStyling.fieldOverrides[fieldName], vertexParts[fieldName])) {
                            angular.merge(style, customVertexStyling.fieldOverrides[fieldName][vertexParts[fieldName]]);
                        }
                    }
                }
            }
        }

        if (common.objectContainsValue(graphData.entities, id)) {
            angular.merge(style, configuration.defaultStyle.entityWrapper);
        }

        return style;
    }


    /**
     * Appends the element to selected entities, creates an input object from the ID and adds it to the
     * operation chain's first operation.
     * @param {String} id The vertex
     * @param {Array} entities The elements with the id
     */
    function selectEntities(id, entities) {
        vm.selectedElements.entities[id] = entities;
        schema.get().then(function(gafferSchema) {
            var vertex = JSON.parse(id);
            var vertices = schema.getSchemaVertices();
            var vertexClass = gafferSchema.types[vertices[0]].class;
            operationChain.addInput({
                valueClass: vertexClass,
                parts: types.createParts(vertexClass, vertex)
            });
        });
    }

    /**
     * Selects all elements with the given vertex (entityId)
     * @param {String} entityId a stringified vertex
     * @returns true if entities were found in the array with the id
     * @returns false if no entities were found with the given id
     */
    function selectEntityId(entityId) {
        // this seems very inefficient
        for (var id in graphData.entities) {
            if(entityId == id) {
                selectEntities(id, graphData.entities[id]);
                return true;
            }
        }
        return false;
    }

    /**
     * Adds the id and edges to the selected elements object.
     * @param {String} id The ID
     * @param {Array} edges The array of edges assocated with the id
     */
    function selectEdges(id, edges) {
        vm.selectedElements.edges[id] = edges;
        $scope.$apply();
    }

    /**
     * Selects all edges in the graph with the given id
     * @param {String} edgeId The Edge ID
     * @returns true if an edge exists in the graph with the given id
     * @returns false if no edge was found in the graph with the given id
     */
    function selectEdgeId(edgeId) {
        // make this more efficient in later issue
        for (var id in graphData.edges) {
            if (edgeId == id) {
                selectEdges(id, graphData.edges[id]);
                return true;
            }
        }
        return false;
    }

    /**
     * Adds a seed to the selected entities
     * @param {String} vertexId
     */
    function selectVertex(vertexId) {
        selectEntities(vertexId, [{vertex: vertexId}]);
    }

    /**
     * Removes an element from the selected elements and input service and fires update events
     * @param {Object} element The cytoscape element
     */
    function unSelect(element) {
        var id = element.id();
        if (vm.selectedElements.entities[id]) {
            schema.get().then(function(gafferSchema) {
                var vertex = JSON.parse(id);
                var vertices = schema.getSchemaVertices();
                var vertexClass = gafferSchema.types[vertices[0]].class;
                operationChain.removeInput({
                    valueClass: vertexClass,
                    parts: types.createParts(vertexClass, vertex)
                });
            });
            delete vm.selectedElements.entities[id];
        } else if(vm.selectedElements.edges[id]) {
            delete vm.selectedElements.edges[id];
        }
    }

    /**
     * Adds Entities, Edges and seeds to the graph model.
     * 
     * IN NEED OF REFACTORING IN LATER ISSUE
     * @param {Array} results
     */
    vm.update = function(results) {
        for (var i in results.entities) {
            var entity = angular.copy(results.entities[i]);
            // Is parseVertex() necessary - it seeems expensive.
            entity.vertex = common.parseVertex(entity.vertex);
            var id = entity.vertex;
            if(id in graphData.entities) {
                common.pushObjectIfUnique(entity, graphData.entities[id]);
            } else {
                graphData.entities[id] = [entity];
            }
        }

        for (var i in results.edges) {
            var edge = angular.copy(results.edges[i]);
            edge.source = common.parseVertex(edge.source);
            edge.destination = common.parseVertex(edge.destination);
            var id = edge.source + "|" + edge.destination + "|" + edge.directed + "|" + edge.group;
            if(id in graphData.edges) {
                common.pushObjectIfUnique(edge, graphData.edges[id]);
            } else {
                graphData.edges[id] = [edge];
            }
        }

        updateGraph(graphData);
    }

    /**
     * Updates cytoscape with the graph data
     * @param {Array} results
     */
    var updateGraph = function(results) {
        // IN NEED OF REFACTORING IN LATER ISSUE
        for (var id in results.entities) {
            var existingNodes = cytoscapeGraph.getElementById(id);
            var isSelected = common.objectContainsValue(vm.selectedElements.entities, id);
            var style = getNodeStyling(schema.getVertexTypeFromEntityGroup(results.entities[id][0].group), id);
            if(existingNodes.length > 0) {

                if(isSelected) {
                   existingNodes.select();
                } else {
                   existingNodes.unselect();
                }
                if (style) {
                    existingNodes.css(style)
                }
            } else {
                var elements = cytoscapeGraph.add({
                    group: 'nodes',
                    data: {
                        id: id,
                        label: createLabel(id)
                    },
                    position: {
                        x: 100,
                        y: 100
                    },
                    selected: isSelected
                });
                if (style) {
                    elements.css(style);
                }
            }
        }

        for (var id in results.edges) {
            var edge = results.edges[id][0];
            var existingNodes = cytoscapeGraph.getElementById(edge.source);
            var isSelected = common.objectContainsValue(vm.selectedElements.entities, edge.source);
            var style = getNodeStyling(schema.getVertexTypesFromEdgeGroup(edge.group).source, edge.source);
            if(existingNodes.length > 0) {
                if(isSelected) {
                   existingNodes.select();
                } else {
                   existingNodes.unselect();
                }
                if (style) {
                    existingNodes.css(style);
                }
            } else {
                var elements = cytoscapeGraph.add({
                    group: 'nodes',
                    data: {
                        id: edge.source,
                        label: createLabel(edge.source),
                    },
                    position: {
                        x: 100,
                        y: 100
                    },
                    selected:isSelected
                });

                if (style) {
                    elements.css(style);
                }
            }

            existingNodes = cytoscapeGraph.getElementById(edge.destination);
            isSelected = common.objectContainsValue(vm.selectedElements.entities, edge.destination);
            style = getNodeStyling(schema.getVertexTypesFromEdgeGroup(edge.group).destination, edge.destination);
            if(existingNodes.length > 0) {
                if(isSelected) {
                   existingNodes.select();
                } else {
                   existingNodes.unselect();
                }
                if (style) {
                    existingNodes.css(style);
                }
            } else {
                var elements = cytoscapeGraph.add({
                    group: 'nodes',
                    data: {
                        id: edge.destination,
                        label: createLabel(edge.destination)
                    },
                    position: {
                        x: 100,
                        y: 100
                    },
                    selected: isSelected
                });

                if (style) {
                    elements.css(style);
                }
            }

            var existingEdges = cytoscapeGraph.getElementById(id);
            isSelected = common.objectContainsValue(vm.selectedElements.edges, id);
            if(existingEdges.length > 0) {
                if(isSelected) {
                   existingEdges.select();
                } else {
                   existingEdges.unselect();
                }
            } else {
                var style = getEdgeStyling(edge.group);
                var elements = cytoscapeGraph.add({
                    group: 'edges',
                    data: {
                        id: id,
                        source: edge.source,
                        target: edge.destination,
                        group: edge.group,
                    },
                    selected: isSelected
                });

                if (style) {
                    elements.css(style);
                }
            }
        }
        vm.redraw();
    }

    /**
     * Performs a quick hop - a GetElements operation with either the clicked
     * node or the selected nodes.
     * @param {Object} event an optional mouse click event.
     */
    vm.quickHop = function(event) {
        var input
        if(event) {
            input = [event.cyTarget.id()];
        } else {
            input = Object.keys(vm.selectedElements.entities);
        }
        if(input && input.length > 0) {
            loading.load();
            var operation = {
                 class: "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
                 input: createOpInput(input),
                 options: settings.getDefaultOpOptions(),
                 view: {
                    globalElements: [
                        {
                            groupBy: []
                        }
                    ]
                 }
            };
            query.addOperation(operation);
            query.executeQuery(
                {
                   class: "uk.gov.gchq.gaffer.operation.OperationChain",
                   operations: [
                       operation,
                       operationService.createLimitOperation(operation['options']),
                       operationService.createDeduplicateOperation(operation['options'])
                   ],
                   options: operation['options']
                },
                vm.deselectAll
            );
        } else {
            error.handle('Please select one or more vertices first');
        }
    }

    var createOpInput = function(seeds) {
        var opInput = [];
        for (var i in seeds) {
            opInput.push({
                "class": "uk.gov.gchq.gaffer.operation.data.EntitySeed",
                "vertex": JSON.parse(seeds[i])
            });
        }
        return opInput;
    }


    /**
     * Removes all elements from the cytoscape graph - does not remove them from the model.
     */
    vm.clear = function(){
        // Make this faster
        while(cytoscapeGraph.elements().length > 0) {
            cytoscapeGraph.remove(cytoscapeGraph.elements()[0]);
        }
    }

    /**
     * Redraws the cytoscape graph
     */
    vm.redraw = function() {
        if(cytoscapeGraph) {
            var nodes = cytoscapeGraph.nodes();
            for(var i in nodes) {
                if(nodes[i] && nodes[i].hasClass && nodes[i].hasClass("filtered")) {
                    nodes[i].remove();
                }
            }
            cytoscapeGraph.layout(configuration);
        }
    }

    /**
     * Resets the graph
     */
    vm.reset = function() {
        vm.clear();
        vm.update(results.get());
    }

    vm.filter = function(searchTerm) {
        searchTerm = searchTerm.toLowerCase();
        var nodes = cytoscapeGraph.nodes();
        for(var i in nodes) {
            if(nodes[i].data && nodes[i].data('id')) {
                if(nodes[i].data('id').toLowerCase().indexOf(searchTerm) === -1) {
                    nodes[i].addClass("filtered");
                } else {
                    nodes[i].removeClass("filtered");
                }
            }
        }
    }

    vm.removeSelected = function() {
        cytoscapeGraph.filter(":selected").remove();
        cytoscapeGraph.elements().unselect();
        vm.selectedElements.entities = {};
        vm.selectedElements.edges = {};
    }

    /**
     * Helper method to create a label from a vertex
     * @param {String} vertex
     */
    var createLabel = function(vertex) {

        // just use types.getShortValue() in next refactor
        var label;
        var json;
        try {
            json = JSON.parse(vertex);
        } catch (e) {
            json = vertex;
        }
        if(typeof json === 'string'
            || json instanceof String
            || typeof json === 'number') {
            label = vertex;
        } else if(Object.keys(json).length == 1) {
            label = types.getShortValue(json);
        } else {
            label = vertex;
        }

        return label;
    }
}
