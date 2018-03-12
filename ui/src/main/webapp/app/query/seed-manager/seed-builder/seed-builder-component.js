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

angular.module('app').component('seedBuilder', seedBuilder());

function seedBuilder() {
    return {
        templateUrl: 'app/query/seed-manager/seed-builder/seed-builder.html',
        controller: SeedBuilderController,
        controllerAs: 'ctrl'
    }
}

function SeedBuilderController(schema, types, graph, error, $routeParams, $location) {
    var vm = this;
    vm.seedVertexParts = {};
    vm.seedVertices = '';
    vm.multipleSeeds = false;
    vm.vertexClass;

    vm.$onInit = function() {
        schema.get().then(function(gafferSchema) {
            var vertices = schema.getSchemaVertices();
            if(vertices && vertices.length > 0 && undefined !== vertices[0]) {
                vm.vertexClass = gafferSchema.types[vertices[0]].class;
            }
            if($routeParams.input) {
                if(Array.isArray($routeParams.input)) {
                    for(var i in $routeParams.input) {
                        addSeed($routeParams.input[i]);
                    }
                } else {
                    addSeed($routeParams.input);
                }
            }
        });
    }

    vm.inputExists = function() {
        if (vm.multipleSeeds) {
            return (vm.seedVertices !== '');
        }
        for(var part in vm.seedVertexParts) {
            if (vm.seedVertexParts[part] !== undefined && vm.seedVertexParts[part] !== "") {
                return true;
            }
        }
        return false;
    }

    vm.getFields = function() {
        return types.getFields(vm.vertexClass);
    }

    vm.getCsvHeader = function() {
        return types.getCsvHeader(vm.vertexClass);
    }

    var addSeed = function(vertex) {
        var partValues = vertex.trim().split(",");
        var fields = types.getFields(vm.vertexClass);
        if(fields.length != partValues.length) {
            error.handle("Wrong number of parameters for seed: " + vertex + ". " + vm.vertexClass + " requires " + fields.length + " parameters");
            return false;
        }
        var parts = {};
        for(var j = 0; j< fields.length; j++) {
            parts[fields[j].key] = partValues[j];
        }
        graph.addSeed(createSeed(parts));
        return true;
    }

    vm.addSeeds = function() {
        if(vm.multipleSeeds) {
            var vertices = vm.seedVertices.trim().split("\n");
            for(var i in vertices) {
                if(!addSeed(vertices[i])) {
                    break;
                }
            }
        } else {
             graph.addSeed(createSeed(vm.seedVertexParts));
        }

        reset();
    }

    var reset = function() {
        vm.seedVertex = '';
        vm.seedVertices = '';
        vm.seedVertexParts = {};
    }

    var createSeed = function(parts) {
        var vertex = types.createJsonValue(vm.vertexClass, parts);
        return vertex;
    }
}