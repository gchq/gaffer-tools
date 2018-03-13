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

angular.module('app').component('schemaGroups', schemaGroups());

function schemaGroups() {
    return {
        templateUrl: 'app/graph/schema-groups/schema-groups.html',
        controller: SchemaGroupsController,
        controllerAs: 'ctrl'
    }
}

function SchemaGroupsController($scope, $timeout, events, types, schema, schemaView) {
    var vm = this;
    vm.schema = {edges:{}, entities:{}, types:{}};
    vm.selectedEntities = [];
    vm.selectedEdges = [];
    var selectedSchemaGroupsUpdate =  function(selectedGroups) {
         vm.selectedEntities = [];
         vm.selectedEdges = [];
         for(var i in selectedGroups.vertices) {
            var vertexType = selectedGroups.vertices[i];
            for(var group in vm.schema.entities) {
                var entity = vm.schema.entities[group];
                if(vertexType === entity.vertex) {
                    var properties = [];
                    if(entity.properties) {
                        for(var name in entity.properties) {
                            properties.push({
                                name: name,
                                description: getTypeDescription(vm.schema.types[entity.properties[name]])
                            });
                        }
                    }
                    vm.selectedEntities.push({
                        group: group,
                        description: entity.description,
                        vertex: {
                            name: vertexType,
                            description: getTypeDescription(vm.schema.types[vertexType])
                        },
                        groupBy: entity.groupBy.join(", "),
                        properties: properties
                    });
                }
            }
         }

         for(var i in selectedGroups.edges) {
             var edge = vm.schema.edges[selectedGroups.edges[i]];
             var properties = [];
             if(edge.properties) {
                 for(var name in edge.properties) {
                     properties.push({
                         name: name,
                         description: getTypeDescription(vm.schema.types[edge.properties[name]])
                     });
                 }
             }
             vm.selectedEdges.push({
                 group: selectedGroups.edges[i],
                 description: edge.description,
                 source: {
                     name: edge.source,
                     description: getTypeDescription(vm.schema.types[edge.source])
                 },
                 destination: {
                     name: edge.destination,
                     description: getTypeDescription(vm.schema.types[edge.destination])
                 },
                 directed: {
                     name: edge.directed,
                     description: getTypeDescription(vm.schema.types[edge.directed])
                 },
                 groupBy: edge.groupBy.join(", "),
                 properties: properties
             });
         }
         if(!promise) {
             promise = $timeout(function() {
                 $scope.$apply();
                 promise = null;
             })
         }
    };

    var getTypeDescription = function(type) {
        if(type.description) {
            return type.description;
        }

        return type.class.split('.').pop();
    }

    var promise;

    vm.$onInit = function() {
        schema.get().then(function(schema) {
            vm.schema = schema;
        });
        events.subscribe('selectedSchemaGroupsUpdate', selectedSchemaGroupsUpdate);
    }

    vm.$onDestroy = function() {
        events.unsubscribe('selectedSchemaGroupsUpdate', selectedSchemaGroupsUpdate);
    }
}