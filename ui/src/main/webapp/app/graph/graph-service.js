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

/**
 * Graph service which handles selected elements and a cytoscape graph
 */
angular.module('app').factory('graph', ['types', '$q', 'results', 'common', 'config', 'events', 'input', 'schema', 'query', 'operationService', 'settings', 'loading', '$mdDialog', 'error', function(types, $q, results, common, config, events, input, schemaService, query, operationService, settings, loading, $mdDialog, error) {
    var graphCy;
    var graph = {};

    var selectedEntities = {};
    var selectedEdges = {};
    var tappedBefore;
    var tappedTimeout;

    var configLoaded;

    var layoutConf = {
        name: 'cytoscape-ngraph.forcelayout',
        async: {
            maxIterations: 1000,
            stepsPerCycle: 50,
            waitForStep: true
        },
        physics: {
            springLength: 250,
            gravity: -6,
            theta: 0.95,
            fit: true
        },
        iterations: 10000,
        fit: true,
        animate: false
    };

    var styling;

    var defaultStyling = {
        edges: {
            'curve-style': 'bezier',
            'min-zoomed-font-size': 30,
            'text-outline-color': '#538212',
            'text-outline-width': 3,
            'line-color': '#538212',
            'font-size': 14,
            'color': '#FFFFFF',
            'width': 5
        },
        nodes: {
            'height': 24,
            'width': 24,
            'min-zoomed-font-size': 20,
            'font-size': 14,
            'text-outline-color': '#FFFFFF',
            'background-color': '#888888',
            'text-outline-width': 3
        },
        entityWrapper: {
            'height': 60,
            'width': 60,
            'background-color': '#337ab7'
        }
    }

    var graphData = {entities: {}, edges: {}};

    config.get().then(function(conf) {
        if(conf.graph && conf.graph.physics) {
            angular.merge(layoutConf.physics, conf.graph.physics);
            graph.redraw();
        }
    });

    events.subscribe('incomingResults', function(results) {
        graph.update(results);
    });

    /** 
     * Returns the currently selected entities in the graph
    */
    graph.getSelectedEntities = function() {
        return selectedEntities;
    }

    /** 
     * Returns the currently selected edges in the graph
    */
    graph.getSelectedEdges = function() {
        return selectedEdges;
    }

    /**
     * Loads cytoscape graph onto an element containing the "graphCy" id. It also registers the 
     * handlers for select and deselect events.
     */
    graph.load = function() {
        var deferred = $q.defer();
        graphCy = cytoscape({
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
                        'overlay-opacity': 0.5,
                        'overlay-padding': 0
                    }
                },
                {
                    selector: '.filtered',
                    css: {
                       display: "none"
                    }
                }
            ],
            layout: layoutConf,
            elements: [],
            ready: function() {
                deferred.resolve( graphCy );
                if (!configLoaded) {
                    config.get().then(function(conf) {
                        configLoaded = true;
                        
                        if (!conf.graph) {
                            return;
                        }
                        if(conf.graph.physics) {
                            angular.merge(layoutConf.physics, conf.graph.physics);
                        }
                        if (conf.graph.style) {
                            styling = conf.graph.style;
                        }

                    });
                }
            }
        });

        graphCy.on('select', function(evt){
            select(evt.cyTarget);
        });

        graphCy.on('unselect', function(evt){
            unSelect(evt.cyTarget);
        })

        graphCy.on('tap', function(event) {
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

        graphCy.on('remove', function(evt) {
            removeFromGraphData(evt.cyTarget);
        });

        graphCy.on('doubleTap', 'node', graph.quickHop);

        return deferred.promise;
    }

    var removeFromGraphData = function(element) {
        var id = element.id();
        delete graphData.edges[id]
        delete graphData.entities[id];
    }

    /**
     * Performs a quick hop - a GetElements operation with either the clicked
     * node or the selected nodes.
     * @param {Object} event an optional mouse click event.
     */
    graph.quickHop = function(event) {
        var input
        if(event) {
            input = [event.cyTarget.id()];
        } else {
            input = Object.keys(graph.getSelectedEntities());
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
                graph.deselectAll
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
     * Defines the behaviour when an element in cytoscape is selected. 
     * First attempts to select an entity, then edge, then vertex.
     * @param {Object} element 
     */
    function select(element) {
        if(selectEntityId(element.id())) {
            return;
        }

        if(selectEdgeId(element.id())) {
            return;
        }

        selectVertex(element.id());
    }

    var getEdgeStyling = function(group) {
        if (!styling || !styling.edges || !styling.edges[group]) {
            return defaultStyling.edges;
        } 

        var copy = angular.copy(defaultStyling.edges);
        angular.merge(copy, styling.edges[group]);
        
        return copy;
    }

    var getNodeStyling = function(vertexType, id) {
        var style = angular.copy(defaultStyling.nodes);

        if (common.objectContainsValue(graphData.entities, id)) {
            angular.merge(style, defaultStyling.entityWrapper);
        }

        if (!styling) {
            return style;
        }

        var customVertexStyling = styling.vertexTypes ? styling.vertexTypes[Object.keys(vertexType)[0]] : null;
        if (customVertexStyling) {
            angular.merge(style, customVertexStyling);
        }

        if (styling.fieldOverrides) {
            var vetexClass = Object.values(vetexType)[0].class;
            var vertexParts = types.createParts(vertexClass, JSON.parse(id));
            for (var fieldName in styling.fieldOverrides) {
                if (vertexParts[fieldName]) {
                    if (common.objectContainsValue(styling.fieldOverrides[fieldName], vertexParts[fieldName])) {
                        angular.merge(style, styling.fieldOverrides[fieldName][vertexParts[fieldName]]); 
                    }
                }
            }
        }

        if (styling.entityWrapper && common.objectContainsValue(graphData.entities, id)) {
                angular.merge(style, styling.entityWrapper)
        }

        return style;
    }

    /**
     * Appends the element to selected entities, creates an input object from the ID and adds it to the input service, then fires events
     * @param {String} id The vertex 
     * @param {Array} entities The elements with the id
     */
    function selectEntities(id, entities) {
        selectedEntities[id] = entities;
        schemaService.get().then(function(gafferSchema) {
            var vertex = JSON.parse(id);
            var vertices = schemaService.getSchemaVertices();
            var vertexClass = gafferSchema.types[vertices[0]].class;
            input.addInput({
                valueClass: vertexClass,
                parts: types.createParts(vertexClass, vertex)
            });
        });
        
        events.broadcast('selectedElementsUpdate', [{"entities": selectedEntities, "edges": selectedEdges}]);
    }

    /**
     * Selects all elements with the given vertex (entityId)
     * @param {String} entityId a stringified vertex
     * @returns true if entities were found in the array with the id
     * @returns false if no entities were found with the given id
     */
    function selectEntityId(entityId) {
        for (var id in graphData.entities) {
            if(entityId == id) {
                selectEntities(id, graphData.entities[id]);
                return true;
            }
        }
        return false;
    }

    /**
     * Adds the id and edges to the selected elements object, then fires update event.
     * @param {String} id The ID
     * @param {Array} edges The array of edges assocated with the id
     */
    function selectEdges(id, edges) {
        selectedEdges[id] = edges;
        events.broadcast('selectedElementsUpdate', [{"entities": selectedEntities, "edges": selectedEdges}]);
    }

    /**
     * Selects all edges in the graph with the given id
     * @param {String} edgeId The Edge ID
     * @returns true if an edge exists in the graph with the given id
     * @returns false if no edge was found in the graph with the given id
     */
    function selectEdgeId(edgeId) {
        for (var id in graphData.edges) {
            if(edgeId == id) {
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
        if(id in selectedEntities) {
            schemaService.get().then(function(gafferSchema) {
                var vertex = JSON.parse(id);
                var vertices = schemaService.getSchemaVertices();
                var vertexClass = gafferSchema.types[vertices[0]].class;
                input.removeInput({
                    valueClass: vertexClass,
                    parts: types.createParts(vertexClass, vertex)
                });
            });
            delete selectedEntities[id];
        } else if(id in selectedEdges) {
            delete selectedEdges[id];
        }

        events.broadcast('selectedElementsUpdate', [{"entities": selectedEntities, "edges": selectedEdges}]);
    }

    /**
     * Resets the graph
     */
    graph.reset = function() {
        graph.clear();
        graph.update(results.get());
    }

    /**
     * Stringifies a seed, adds it if it does not exist, selects it and updates the graph
     * @param {*} seed 
     */
    graph.addSeed = function(seed) {
        var entitySeed = JSON.stringify(seed);
        common.pushValueIfUnique(entitySeed, graphData.entitySeeds);
        selectVertex(entitySeed);
        updateGraph(graphData);
    }

    /**
     * Adds Entities, Edges and seeds to the graph model.
     * @param {Array} results 
     */
    graph.update = function(results) {
        for (var i in results.entities) {
            var entity = angular.copy(results.entities[i]);
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
        for (var id in results.entities) {
            var existingNodes = graphCy.getElementById(id);
            var isSelected = common.objectContainsValue(selectedEntities, id);
            var style = getNodeStyling(schemaService.getVertexTypeFromEntityGroup(results.entities[id][0].group), id);
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
                var elements = graphCy.add({
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
            var existingNodes = graphCy.getElementById(edge.source);
            var isSelected = common.objectContainsValue(selectedEntities, edge.source);
            var style = getNodeStyling(schemaService.getVertexTypesFromEdgeGroup(edge.group).source, edge.source);
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
                var elements = graphCy.add({
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

            existingNodes = graphCy.getElementById(edge.destination);
            isSelected = common.objectContainsValue(selectedEntities, edge.destination);
            style = getNodeStyling(schemaService.getVertexTypesFromEdgeGroup(edge.group).destination, edge.destination);
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
                var elements = graphCy.add({
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

            var existingEdges = graphCy.getElementById(id);
            isSelected = common.objectContainsValue(selectedEdges, id);
            if(existingEdges.length > 0) {
                if(isSelected) {
                   existingEdges.select();
                } else {
                   existingEdges.unselect();
                }
            } else {
                var style = getEdgeStyling(edge.group);
                var elements = graphCy.add({
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
        graph.redraw();
    }

    /**
     * Removes all elements from the cytoscape graph - does not remove them from the model.
     */
    graph.clear = function(){
        while(graphCy.elements().length > 0) {
            graphCy.remove(graphCy.elements()[0]);
        }
    }

    /**
     * Redraws the cytoscape graph
     */
    graph.redraw = function() {
        if(graphCy) {
            var nodes = graphCy.nodes();
            for(var i in nodes) {
                if(nodes[i] && nodes[i].hasClass && nodes[i].hasClass("filtered")) {
                    nodes[i].remove();
                }
            }
            graphCy.layout(layoutConf);
        }
    }

    graph.filter = function(searchTerm) {
        searchTerm = searchTerm.toLowerCase();
        var nodes = graphCy.nodes();
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

    graph.removeSelected = function() {
        graphCy.filter(":selected").remove();
        graphCy.elements().unselect();
        selectedEdges = {};
        selectedEntities = {};
        events.broadcast('selectedElementsUpdate', [{"entities": selectedEntities, "edges": selectedEdges}]);
    }

    /**
     * Helper method to create a label from a vertex
     * @param {String} vertex 
     */
    var createLabel = function(vertex) {
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

    /**
     * Selects all nodes (entities)
     */
    graph.selectAllNodes = function() {
        graph.deselectAll();
        graphCy.filter('node').select();
    }

    /**
     * Deselects all elements
     */
    graph.deselectAll = function() {
        graphCy.elements().unselect();
    }

    return graph;

}]);
