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
 * Schema view service which handles selected elements and a cytoscape schemaView
 */
angular.module('app').factory('schemaView', ['types', '$q', 'common', 'events', function(types, $q, common, events) {

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
            springLength: 150,
            fit: true
        },
        iterations: 10000,
        fit: true,
        animate: false
    };

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
                        'content': 'data(label)',
                        'text-valign': 'center',
                        'background-color': 'data(color)',
                        'font-size': 14,
                        'color': '#fff',
                        'text-outline-color':'data(color)',
                        'text-outline-width':3,
                        'width': 'data(radius)',
                        'height': 'data(radius)'
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'curve-style': 'bezier',
                        'label': 'data(group)',
                        'line-color': '#538212',
                        'target-arrow-color': '#538212',
                        'target-arrow-shape': 'triangle',
                        'font-size': 14,
                        'color': '#fff',
                        'text-outline-color':'#538212',
                        'text-outline-width':3,
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
                    label: nodes[i],
                    radius: 60,
                    color: '#337ab7',
                    selectedColor: '#204d74'
                }
            });
        }

        for(var group in schema.edges) {
            var edge = schema.edges[group];
            if(nodes.indexOf(edge.source) === -1) {
                nodes.push(edge.source);
                schemaCy.add({
                    group: 'nodes',
                    data: {
                        id: edge.source,
                        label: edge.source,
                        radius: 20,
                        color: '#888',
                        selectedColor: '#444'
                    }
                });
            }
            if(nodes.indexOf(edge.destination) === -1) {
                nodes.push(edge.destination);
                schemaCy.add({
                    group: 'nodes',
                    data: {
                        id: edge.destination,
                        label: edge.destination,
                        radius: 20,
                        color: '#888',
                        selectedColor: '#444'
                    }
                });
            }

            schemaCy.add({
                group: 'edges',
                data: {
                    id: edge.source + "|" + edge.destination + "|" + edge.directed + "|" + group,
                    source: edge.source,
                    target: edge.destination,
                    group: group,
                    selectedColor: '#35500F',
                }
            });
        }
    }

    return schemaView;
}]);
