/*
 * Copyright 2017 Crown Copyright
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

angular.module('app').factory('graph', ['schema', 'types', '$q', 'results', 'common', 'events', function(schemaService, types, $q, results, common, events) {

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

    var graphData = {entities: {}, edges: {}, entitySeeds: []};

    events.subscribe('resultsUpdated', function(results) {
        graph.update(results);
        graph.redraw();
    });

    graph.getSelectedEntities = function() {
        return selectedEntities;
    }

    graph.getSelectedEdges = function() {
        return selectedEdges;
    }

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

    function select(element) {
        if(selectEntityId(element.id())) {
            return;
        }

        if(selectEdgeId(element.id())) {
            return;
        }

        selectVertex(element.id());
    }

    function selectEntity(id, entity) {
        selectedEntities[id] = entity;
        events.broadcast('selectedElementsUpdate', [{"entities": selectedEntities, "edges": selectedEdges}]);
    }

    function selectEntityId(entityId) {
        for (var id in graphData.entities) {
            if(entityId == id) {
                selectEntity(id, graphData.entities[id]);
                return true;
            }
        }
        return false;
    }

    function selectEdge(id, edge) {
        selectedEdges[id] = edge;
        events.broadcast('selectedElementsUpdate', [{"entities": selectedEntities, "edges": selectedEdges}]);
    }

    function selectEdgeId(edgeId) {
        for (var id in graphData.edges) {
            if(edgeId == id) {
                selectEdge(id, graphData.edges[id]);
                return true;
            }
        }
        return false;
    }

    function selectVertex(vertexId) {
        selectEntity(vertexId, [{vertex: vertexId}]);
    }

    function unSelect(element) {
        if(element.id() in selectedEntities) {
            delete selectedEntities[element.id()];
        } else if(element.id() in selectedEdges) {
            delete selectedEdges[element.id()];
        }

        events.broadcast('selectedElementsUpdate', [{"entities": selectedEntities, "edges": selectedEdges}]);
    }

    graph.reload = function() {
        updateGraph(graphData);
        graph.redraw();
    }

    graph.reset = function() {
        selectedEdges = {};
        selectedEntities = {};
        graphCy.elements().unselect();
        events.broadcast('selectedElementsUpdate'[{"entities": selectedEntities, "edges": selectedEdges}]);
    }

    graph.addSeed = function(seed) {
        var entitySeed = JSON.stringify(seed);
        if(!common.arrayContainsValue(graphData.entitySeeds, entitySeed)) {
            graphData.entitySeeds.push(entitySeed);
        }
        selectVertex(entitySeed);
        updateGraph(graphData);
    }

    graph.update = function(results) {
        graphData = { entities: {}, edges: {}, entitySeeds: [] };
        for (var i in results.entities) {
            var entity = angular.copy(results.entities[i]);
            entity.vertex = common.parseVertex(entity.vertex);
            var id = entity.vertex;
            if(id in graphData.entities) {
                if(!common.arrayContainsObject(graphData.entities[id], entity)) {
                    graphData.entities[id].push(entity);
                }
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
                if(!common.arrayContainsObject(graphData.edges[id], edge)) {
                    graphData.edges[id].push(edge);
                }
            } else {
                graphData.edges[id] = [edge];
            }
        }

        for (var i in results.entitySeeds) {
            var id = common.parseVertex(results.entitySeeds[i]);
            if(!common.arrayContainsValue(graphData.entitySeeds, id)) {
                graphData.entitySeeds.push(id);
            }
        }

        updateGraph(graphData);
    }

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

        for (var i in results.entitySeeds) {
            addEntitySeed(results.entitySeeds[i]);
        }
    }

    graph.clear = function(){
        while(graphCy.elements().length > 0) {
            graphCy.remove(graphCy.elements()[0]);
        }
    }

    graph.redraw = function() {
        graphCy.layout(layoutConf);
    }

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

    graph.selectAllNodes = function() {
        graphCy.filter('node').select();
    }

    graph.deselectAll = function() {
        graphCy.elements().unselect();
    }

    return graph;

}]);