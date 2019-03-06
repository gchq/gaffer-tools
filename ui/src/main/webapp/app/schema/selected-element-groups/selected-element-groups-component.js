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

angular.module('app').component('selectedElementGroups', selectedElementGroups());

function selectedElementGroups() {
    return {
        templateUrl: 'app/schema/selected-element-groups/selected-element-groups.html',
        controller: SelectedElementGroupsController,
        controllerAs: 'ctrl'
    }
}

function SelectedElementGroupsController($scope, $timeout, events, schema) {
    var gafferSchema = {edges:{}, entities:{}, types:{}};
    var promise;

    var vm = this;
    vm.selectedEntities = [];
    vm.selectedEdges = [];

    vm.$onInit = function() {
        schema.get().then(function(newSchema) {
            gafferSchema = newSchema;
        },
        function() {
            gafferSchema = {edges:{}, entities:{}, types:{}};
        });
        events.subscribe('selectedSchemaElementGroupsUpdate', selectedSchemaElementGroupsUpdate);
    }

    vm.$onDestroy = function() {
        events.unsubscribe('selectedSchemaElementGroupsUpdate', selectedSchemaElementGroupsUpdate);
    }

    var selectedSchemaElementGroupsUpdate =  function(selectedGroups) {
         vm.selectedEntities = [];
         vm.selectedEdges = [];
         for(var i in selectedGroups.vertices) {
            var vertexType = selectedGroups.vertices[i];
            for(var group in gafferSchema.entities) {
                var entity = gafferSchema.entities[group];
                if(vertexType === entity.vertex) {
                    var properties = [];
                    if(entity.properties) {
                        for(var name in entity.properties) {
                            properties.push({
                                name: name,
                                description: getTypeDescription(gafferSchema.types[entity.properties[name]])
                            });
                        }
                    }
                    vm.selectedEntities.push({
                        group: group,
                        description: entity.description ? entity.description : "",
                        vertex: {
                            name: vertexType,
                            description: getTypeDescription(gafferSchema.types[vertexType])
                        },
                        groupBy: entity.groupBy ? entity.groupBy.join(", ") : "",
                        properties: properties
                    });
                }
            }
         }

         for(var i in selectedGroups.edges) {
             var edge = gafferSchema.edges[selectedGroups.edges[i]];
             if(edge) {
                 var properties = [];
                 if(edge.properties) {
                     for(var name in edge.properties) {
                         properties.push({
                             name: name,
                             description: getTypeDescription(gafferSchema.types[edge.properties[name]])
                         });
                     }
                 }
                 vm.selectedEdges.push({
                     group: selectedGroups.edges[i],
                     description: edge.description ? edge.description : "",
                     source: {
                         name: edge.source ? edge.source : "",
                         description: getTypeDescription(gafferSchema.types[edge.source])
                     },
                     destination: {
                         name: edge.destination ? edge.destination : "",
                         description: getTypeDescription(gafferSchema.types[edge.destination])
                     },
                     directed: {
                         name: edge.directed ? edge.directed : "",
                         description: getTypeDescription(gafferSchema.types[edge.directed])
                     },
                     groupBy: edge.groupBy ? edge.groupBy.join(", ") : "",
                     properties: properties
                 });
             }
         }
         if(!promise) {
             promise = $timeout(function() {
                 $scope.$apply();
                 promise = null;
             })
         }
    };

    var getTypeDescription = function(type) {
        if(!type) {
            return "";
        }

        if(type.description) {
            return type.description;
        }

        if(type.class) {
            return type.class.split('.').pop()
        }

        return "";
    }
}
