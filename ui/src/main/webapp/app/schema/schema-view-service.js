/*
 * Copyright 2017-2019 Crown Copyright
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
 * Schema view service which handles selected elements and a cytoscape schemaView
 */
angular.module('app').factory('schemaView', ['types', '$q', 'common', 'events', 'config', function(types, $q, common, events, config) {

    var schemaCy;
    var schemaView = {};

    var selectedVertices = [];
    var selectedEdges = [];

    var layoutConf = {
        name: 'cytoscape-ngraph.forcelayout',
        async: {
            maxIterations: 1000,
            stepsPerCycle: 50,
            waitForStep: true
        },
        physics: {
            springLength: 250,
            fit: true
        },
        iterations: 10000,
        fit: true,
        animate: false
    };

    var configLoaded = false;
    var styling;

    var defaultStyling = {
        edges: {
            'curve-style': 'bezier',
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

    /**
     * Loads cytoscape schemaView onto an element containing the "schemaCy" id. It also registers the 
     * handlers for select and deselect events.
     */
    schemaView.load = function() {
        var deferred = $q.defer();
        schemaCy = cytoscape({
            container: $('#schemaCy')[0],
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
                }
            ],
            layout: layoutConf,
            elements: [],
            ready: function(){
                if (!configLoaded) {
                    config.get().then(function(conf) {
                        configLoaded = true;
                        
                        if (!conf.graph) {
                            deferred.resolve( schemaCy );
                            return;
                        }
                        if(conf.graph.physics) {
                            angular.merge(layoutConf.physics, conf.graph.physics);
                        }
                        if (conf.graph.style) {
                            styling = conf.graph.style;
                        }
                        if (conf.graph.defaultStyle) {
                            angular.merge(defaultStyling, conf.graph.defaultStyle);
                        }
                        deferred.resolve( schemaCy );
                    });
                } else {
                    deferred.resolve( schemaCy );
                }
            }
        });

        schemaCy.on('select', function(evt){
            select(evt.cyTarget);
        });

        schemaCy.on('unselect', function(evt){
            deselect(evt.cyTarget);
        })

        return deferred.promise;
    }

    var select = function(element) {
        if("nodes" === element.group()) {
            if(selectedVertices.indexOf(element.id()) === -1) {
                selectedVertices.push(element.id());
            }
        } else {
            if(selectedEdges.indexOf(element.data().group) === -1) {
                selectedEdges.push(element.data().group);
            }
        }
        events.broadcast('selectedSchemaElementGroupsUpdate', [{vertices: selectedVertices, edges: selectedEdges}]);
    }

    var deselect = function(element) {
        if("nodes" === element.group()) {
            var index = selectedVertices.indexOf(element.id());
            if (index !== -1) {
                selectedVertices.splice(index, 1);
            }
        } else {
            var index = selectedEdges.indexOf(element.data().group);
            if (index !== -1) {
                selectedEdges.splice(index, 1);
            }
        }
        events.broadcast('selectedSchemaElementGroupsUpdate', [{vertices: selectedVertices, edges: selectedEdges}]);
    }

    var getEdgeStyling = function(group) {
        if (!styling || !styling.edges || !styling.edges[group]) {
            return defaultStyling.edges;
        } 

        var copy = angular.copy(defaultStyling.edges);
        angular.merge(copy, styling.edges[group]);
        
        return copy;
    }

    var getNodeStyling = function(vertexType, entities) {
        var style = angular.copy(defaultStyling.vertices);
        var isEntity = false;

        for (var schemaDefinition in entities) {
            if (entities[schemaDefinition].vertex === vertexType) {
                isEntity = true;
                break;
            }
        }

        if (!styling) {
            
            if (isEntity) {
                angular.merge(style, defaultStyling.entityWrapper);
            }

            return style;
        }

        var customVertexStyling = styling.vertexTypes ? styling.vertexTypes[vertexType] : null;
        
        if (customVertexStyling) {
            angular.merge(style, customVertexStyling.style);
        }

        if (isEntity) {
            angular.merge(style, defaultStyling.entityWrapper);
        }

        return style;
    }

    /**
     * Updates the cytoscape graph and redraws it
     */
    schemaView.reload = function(schema) {
        updateGraph(schema);
        redraw();
    }

    var redraw = function() {
        schemaCy.layout(layoutConf);
    }

    var updateGraph = function(schema) {
        var nodes = [];

        for(var group in schema.entities) {
            if(nodes.indexOf(schema.entities[group].vertex) === -1) {
                nodes.push(schema.entities[group].vertex);
            }
        }

        for(var i in nodes) {
            schemaCy.add({
                group: 'nodes',
                data: {
                    id: nodes[i],
                    label: nodes[i]
                }
            }).css(getNodeStyling(nodes[i], schema.entities));
        }

        for(var group in schema.edges) {
            var edge = schema.edges[group];
            if(nodes.indexOf(edge.source) === -1) {
                nodes.push(edge.source);
                schemaCy.add({
                    group: 'nodes',
                    data: {
                        id: edge.source,
                        label: edge.source
                    }
                }).css(getNodeStyling(edge.source, schema.entities));
            }
            if(nodes.indexOf(edge.destination) === -1) {
                nodes.push(edge.destination);
                schemaCy.add({
                    group: 'nodes',
                    data: {
                        id: edge.destination,
                        label: edge.destination,
                    }
                }).css(getNodeStyling(edge.destination, schema.entities));
            }

            schemaCy.add({
                group: 'edges',
                data: {
                    id: edge.source + "|" + edge.destination + "|" + edge.directed + "|" + group,
                    source: edge.source,
                    target: edge.destination,
                    group: group,
                }
            }).css(getEdgeStyling(group));
        }
    }

    return schemaView;
}]);
