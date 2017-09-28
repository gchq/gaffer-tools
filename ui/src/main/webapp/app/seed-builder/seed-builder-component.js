(function() {

    'use strict'

    angular.module('app').component('seedBuilder', seedBuilder())

    function seedBuilder() {

        return {
            templateUrl: 'app/seed-builder/seed-builder.html'
            controller: seedBuilderController,
            controllerAs: 'ctrl'
        }

        function seedBuilderController(seedBuilderService, schemaService, typeService, $mdDialog) {
            var vm = this
            vm.seedVertex = ''
            vm.seedVertexParts = {}
            vm.seedVertexType = ''
            vm.seedVertices = ''
            vm.multipleSeeds = false

            vm.getSchemaVertices = getSchemaVertices
            vm.getTypes = getTypes
            vm.getCsvHeader = getCsvHeader
            vm.submitSeeds = submitSeeds


            function getSchemaVertices() {
                return schemaService.getSchemaVertices()
            }

            function getTypes() {
                return typeService.getType(rawData.schema.types[vm.seedVertexType].class).types
            }

            function getCsvHeader() {
                return typeService.getType(schemaService.getSchema().types[vm.seedVertexType].class).csvHeader
            }

            function cancel() {
                $mdDialog.cancel();
            }

            function submitSeeds() {
                var seeds = [];
                if(vm.addMultipleSeeds) {
                    var vertices = vm.seedVertices.trim().split("\n");
                    for(var i in vertices) {
                        var vertex = vertices[i];
                        var vertexType = vm.addSeedVertexType;
                        var typeClass = schemaService.getSchema().types[vertexType].class;
                        var partValues = vertex.trim().split(",");
                        var types = typeService.getType(typeClass).types;
                        if(types.length != partValues.length) {
                            alert("Wrong number of parameters for seed: " + vertex + ". " + vertexType + " requires " + types.length + " parameters");
                            break;
                        }
                        var parts = {};
                        for(var j = 0; j< types.length; j++) {
                            parts[types[j].key] = partValues[j];
                        }
                        seeds.push(seedBuilderService.createSeed(vertexType, parts));
                    }
                } else {
                     seeds.push(seedBuilderService.createSeed(vm.addSeedVertexType, vm.addSeedVertexParts));
                }

                vm.seedVertexType = '';
                vm.seedVertex = '';
                vm.seedVertices = '';
                vm.seedVertexParts = {};
                $mdDialog.hide(seeds);
            }
        }
    }

})()