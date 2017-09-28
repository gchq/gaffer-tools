/*
 * Copyright 2016 Crown Copyright
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

(function() {

    'use strict'
  
    function graph() {
        return {
            templateUrl: 'app/graph/graph.html',
            controller: graphController,
            controllerAs: ctrl
        }

        function graphController($scope, $q, graphService, schemaService, typeService, resultService) {
            var graphCy;
            load()

            $scope.$watch(graphService.getSeedToAdd, function (oldValue, newValue) {
                addSeed(newValue.vertexType, newValue.vertex)
            })

            $scope.$watch(graphService.doesNeedToRedraw, function (oldValue, newValue) {
                if (newValue === true) {
                    redraw()
                    graphService.redrawn()
                }
            })

            $scope.$watch(graphService.doesNeedToSelectAll, function (oldValue, newValue) {
                if (newValue === true) {
                    selectAllNodes()
                    graphService.selectedAll()
                }
            })

            $scope.$watch(resultsService.getResults, function (oldValue, newValue) {
                if (newValue !== oldValue) {
                    updateGraphData(newValue)
                }
            })


            function load() {
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
                    layout: {
                        name: 'concentric'
                    },
                    elements: [],
                    ready: function(){
                        deferred.resolve( this );
                    }
                });

                graphCy.on('select', function(evt){
                    handleElementSelect(evt.cyTarget);
                });

                graphCy.on('unselect', function(evt){
                  handleElementUnSelect(evt.cyTarget)
                })

                return deferred.promise;
            }


            function handleElementSelect(element) {

                graphService.select(element, function() {
                    if ($scope.$$phase) {
                        $scope.$apply()
                    }
                })

            }

            function handleElementUnSelect(element) {
                graphService.unSelect(element, function() {
                    $scope.$apply()
                })
            }


            function update(results) {
                for (var id in results.entities) {
                    var existingNodes = graphCy.getElementById(id);
                    if(existingNodes.length > 0) {
                        if(existingNodes.data().radius < 60) {
                            existingNodes.data('radius', 60);
                            existingNodes.data('color', '#337ab7');
                            existingNodes.data('selectedColor', '#204d74');
                        }
                    } else {
                        graphCy.add({
                            group: 'nodes',
                            data: {
                                id: id,
                                label: graph.createLabel(id),
                                radius: 60,
                                color: '#337ab7',
                                selectedColor: '#204d74'
                            },
                            position: {
                                x: 100,
                                y: 100
                            }
                        });
                    }
                }

                for (var id in results.edges) {
                    var edge = results.edges[id][0];
                    if(graphCy.getElementById(edge.source).length === 0) {
                        graphCy.add({
                            group: 'nodes',
                            data: {
                                id: edge.source,
                                label: graph.createLabel(edge.source),
                                radius: 20,
                                color: '#888',
                                selectedColor: '#444',
                                vertexType: edge.sourceType
                            },
                            position: {
                                x: 100,
                                y: 100
                            }
                        });
                    }

                    if(graphCy.getElementById(edge.destination).length === 0) {
                        graphCy.add({
                            group: 'nodes',
                            data: {
                                id: edge.destination,
                                label: graph.createLabel(edge.destination),
                                radius: 20,
                                color: '#888',
                                selectedColor: '#444',
                                vertexType: edge.destinationType
                            },
                            position: {
                                x: 100,
                                y: 100
                            }
                        });
                    }

                    if(graphCy.getElementById(id).length === 0) {
                        graphCy.add({
                            group: 'edges',
                            data: {
                                id: id,
                                source: edge.source,
                                target: edge.destination,
                                group: edge.group,
                                selectedColor: '#35500F',
                            }
                        });
                    }
                }

                for (var id in results.entitySeeds) {
                    graph.addSeed(results.entitySeeds[id].vertexType, id);
                }

                vm.redraw();
            }

            function clear() {
                while(graphCy.elements().length > 0) {
                    graphCy.remove(graphCy.elements()[0]);
                }
            }

            function redraw() {
                graphCy.layout({name: 'concentric'})
            }

            function createLabel(vertex) {
                var label;
                var json;
                try {
                    json = JSON.parse(vertex)
                } catch (e) {
                    json = vertex
                }
                if(typeof json === 'string'
                    || json instanceof String
                    || typeof json === 'number') {
                    label = vertex;
                } else if(Object.keys(json).length == 1) {
                    var typeClass = Object.keys(json)[0];
                    label = typeService.getType(typeClass).getShortValue(json);
                } else {
                    label = vertex;
                }

                return label;
            }

            function addSeed(vertexType, vertex){
                if(graphCy.getElementById(vertex).length === 0) {
                    graphCy.add({
                        group: 'nodes',
                        data: {
                            id: vertex,
                            label: graph.createLabel(vertex),
                            vertex: vertex,
                            color: '#888',
                            selectedColor: '#444',
                            radius: 20,
                            vertexType: vertexType
                        },
                        position: {
                        x: 100,
                        y: 100
                        }
                    });
                }
            };

            function selectAllNodes() {
                graphCy.filter('node').select();
            }

            function parseVertex(vertex) {
                if(typeof vertex === 'string' || vertex instanceof String) {
                    vertex = "\"" + vertex + "\"";
                }

                try {
                     JSON.parse(vertex);
                } catch(err) {
                     // Try using stringify
                     vertex = JSON.stringify(vertex);
                }

                return vertex;
            }

            function arrayContainsValue(arr, value) {
                var jsonValue = JSON.stringify(value);
                for(var i in arr) {
                    if(JSON.stringify(arr[i]) === jsonValue) {
                        return true;
                    }
                }
                return false;
            }

            function updateGraphData(results) {
                var graphData = {entities: {}, edges: {}, entitySeeds: {}};
                for (var i in results.entities) {
                    var entity = clone(results.entities[i]);
                    entity.vertex = parseVertex(entity.vertex);
                    var id = entity.vertex;
                    entity.vertexType = schemaService.getVertexTypeFromEntityGroup(entity.group);
                    if(id in $scope.graphData.entities) {
                        if(!arrayContainsValue(graphData.entities[id], entity)) {
                            graphData.entities[id].push(entity);
                        }
                    } else {
                        graphData.entities[id] = [entity];
                    }
                }

                for (var i in results.edges) {
                    var edge = clone(results.edges[i]);
                    edge.source = parseVertex(edge.source);
                    edge.destination = parseVertex(edge.destination);

                    var vertexTypes = getVertexTypesFromEdgeGroup(edge.group);
                    edge.sourceType = vertexTypes[0];
                    edge.destinationType = vertexTypes[1];
                    var id = edge.source + "|" + edge.destination + "|" + edge.directed + "|" + edge.group;
                    if(id in $scope.graphData.edges) {
                        if(!arrayContainsValue(graphData.edges[id], edge)) {
                            graphData.edges[id].push(edge);
                        }
                    } else {
                        graphData.edges[id] = [edge];
                    }
                }

                for (var i in results.entitySeeds) {
                    var entitySeed = {
                       vertex: parseVertex(results.entitySeeds[i]),
                       vertexType: "unknown"
                    }
                    var id = entitySeed.vertex;
                    if(id in graphData.entitySeeds) {
                        if(!arrayContainsValue(graphData.entitySeeds[id], entitySeed)) {
                            graphData.entitySeeds[id].push(entitySeed);
                        }
                    } else {
                        graphData.entitySeeds[id] = [entitySeed];
                    }
                }

                graphService.updateGraphData(graphData, graph.update)

            }

            function clone(obj) {
                return JSON.parse(JSON.stringify(obj));
            }
        }
    }

})()
