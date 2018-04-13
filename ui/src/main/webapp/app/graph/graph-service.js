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
angular.module('app').factory('graph', ['types', '$q', 'results', 'common', 'events', 'input', 'schema', function(types, $q, results, common, events, input, schemaService) {

    var graphCy;
    var graph = {};

    var selectedEntities = {};
    var selectedEdges = {};

    var layoutConf = {
        name: 'cytoscape-ngraph.forcelayout',
        async: {
            maxIterations: 1000,
            stepsPerCycle: 50,
            waitForStep: true
        },
        physics: {
            springLength: 30,
            springCoeff: 0.000001,
            gravity: -10,
            dragCoeff: 0,
            stableThreshold: 0.000001,
            fit: true
        },
        iterations: 10000,
        fit: true,
        animate: false
    };

    var graphData = {entities: {}, edges: {}};

    events.subscribe('resultsUpdated', function(results) {
        graph.update(results);
        graph.redraw();
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
                        'content': 'data(label)',
                        'text-valign': 'center',
                        'background-color': 'data(color)',
                        'font-size': 14,
                        'color': '#fff',
                        'text-outline-width':1,
                        'width': 'data(radius)',
                        'height': 'data(radius)'
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'curve-style': 'bezier',
                        'label': 'data(group)',
                        'line-color': '#79B623',
                        'target-arrow-color': '#79B623',
                        'target-arrow-shape': 'triangle',
                        'font-size': 14,
                        'color': '#fff',
                        'text-outline-width':1,
                        'width': 5
                    }
                },
                {
                    selector: ':selected',
                    css: {
                        'background-color': 'data(selectedColor)',
                        'line-color': '#35500F',
                        'target-arrow-color': '#35500F'
                    }
                }
            ],
            layout: layoutConf,
            elements: [],
            ready: function(){
                deferred.resolve( this );
            }
        });

        graphCy.on('select', function(evt){
            select(evt.cyTarget);
        });

        graphCy.on('unselect', function(evt){
            unSelect(evt.cyTarget);
        })

        return deferred.promise;
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
            input.removeInput(JSON.parse(id));
            delete selectedEntities[id];
        } else if(id in selectedEdges) {
            delete selectedEdges[id];
        }

        events.broadcast('selectedElementsUpdate', [{"entities": selectedEntities, "edges": selectedEdges}]);
    }

    /**
     * Updates the cytoscape graph and redraws it
     */
    graph.reload = function() {
        updateGraph(graphData);
        graph.redraw();
    }

    /**
     * Resets the selected elements
     */
    graph.reset = function() {
        selectedEdges = {};
        selectedEntities = {};
        graphCy.elements().unselect();
        events.broadcast('selectedElementsUpdate'[{"entities": selectedEntities, "edges": selectedEdges}]);
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
        graphData = { entities: {}, edges: {} };
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
            if(existingNodes.length > 0) {
                if(existingNodes.data().radius < 60) {
                    existingNodes.data('radius', 60);
                    existingNodes.data('color', '#337ab7');
                    existingNodes.data('selectedColor', '#204d74');
                }
                if(isSelected) {
                   existingNodes.select();
                } else {
                   existingNodes.unselect();
                }
            } else {
                graphCy.add({
                    group: 'nodes',
                    data: {
                        id: id,
                        label: createLabel(id),
                        radius: 60,
                        color: '#337ab7',
                        selectedColor: '#204d74'
                    },
                    position: {
                        x: 100,
                        y: 100
                    },
                    selected: isSelected
                });
            }
        }

        for (var id in results.edges) {
            var edge = results.edges[id][0];
            var existingNodes = graphCy.getElementById(edge.source);
            var isSelected = common.objectContainsValue(selectedEntities, edge.source);
            if(existingNodes.length > 0) {
                if(isSelected) {
                   existingNodes.select();
                } else {
                   existingNodes.unselect();
                }
            } else {
                graphCy.add({
                    group: 'nodes',
                    data: {
                        id: edge.source,
                        label: createLabel(edge.source),
                        radius: 20,
                        color: '#888',
                        selectedColor: '#444'
                    },
                    position: {
                        x: 100,
                        y: 100
                    },
                    selected:isSelected
                });
            }

            existingNodes = graphCy.getElementById(edge.destination);
            isSelected = common.objectContainsValue(selectedEntities, edge.destination);
            if(existingNodes.length > 0) {
                if(isSelected) {
                   existingNodes.select();
                } else {
                   existingNodes.unselect();
                }
            } else {
                graphCy.add({
                    group: 'nodes',
                    data: {
                        id: edge.destination,
                        label: createLabel(edge.destination),
                        radius: 20,
                        color: '#888',
                        selectedColor: '#444'
                    },
                    position: {
                        x: 100,
                        y: 100
                    },
                    selected: isSelected
                });
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
                graphCy.add({
                    group: 'edges',
                    data: {
                        id: id,
                        source: edge.source,
                        target: edge.destination,
                        group: edge.group,
                        selectedColor: '#35500F',
                    },
                    selected: isSelected
                });
            }
        }
    }

    /**
     * Removes all elements from the cytoscape graph - does not remove them from the model
     * This is not actually used anywhere
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
        graphCy.layout(layoutConf);
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
     * Adds a seed to the graph
     * @param {String} vertex 
     */
    var addEntitySeed = function(vertex){
        var existingNodes = graphCy.getElementById(vertex);
        var isSelected = common.objectContainsValue(selectedEntities, vertex);
        if(existingNodes.length > 0) {
            if(isSelected) {
               existingNodes.select();
            } else {
               existingNodes.unselect();
            }
        } else {
            graphCy.add({
                group: 'nodes',
                data: {
                    id: vertex,
                    label: createLabel(vertex),
                    vertex: vertex,
                    color: '#888',
                    selectedColor: '#444',
                    radius: 20
                },
                position: {
                    x: 100,
                    y: 100
                },
                selected: isSelected
            });
        }
    }

    /**
     * Selects all nodes (entities)
     */
    graph.selectAllNodes = function() {
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
