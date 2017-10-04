'use strict'

angular.module('app').component('seedBuilder', seedBuilder())

function seedBuilder() {

    return {
        templateUrl: 'app/seed-builder/seed-builder.html',
        controller: SeedBuilderController,
        controllerAs: 'ctrl'
    }
}

function SeedBuilderController(schema, types, $mdDialog) {
    var vm = this
    vm.seedVertex = ''
    vm.seedVertexParts = {}
    vm.seedVertexType = undefined
    vm.seedVertices = ''
    vm.multipleSeeds = false


    vm.getSchemaVertices = function() {
        return schema.getSchemaVertices()
    }

    vm.getFields = function() {
        var schemaType = schema.getSchema().types[vm.seedVertexType]
        if (!schemaType) {
            return types.getType(undefined).types
        }
        return types.getType(schemaType.class).types
    }

    vm.getCsvHeader = function() {
        var schemaType = schema.getSchema().types[vm.seedVertexType]
        if (!schemaType) {
            return types.getType(undefined).csvHeader
        }
        return types.getType(schemaType.class).csvHeader
    }

    vm.cancel = function() {
        $mdDialog.cancel();
    }

    vm.submitSeeds = function() {
        var seeds = [];
        if(vm.multipleSeeds) {
            var vertices = vm.seedVertices.trim().split("\n");
            for(var i in vertices) {
                var vertex = vertices[i];
                var vertexType = vm.seedVertexType;
                var typeClass = schema.getSchema().types[vertexType].class;
                var partValues = vertex.trim().split(",");
                var types = types.getType(typeClass).types;
                if(types.length != partValues.length) {
                    alert("Wrong number of parameters for seed: " + vertex + ". " + vertexType + " requires " + types.length + " parameters");
                    break;
                }
                var parts = {};
                for(var j = 0; j< types.length; j++) {
                    parts[types[j].key] = partValues[j];
                }
                seeds.push(createSeed(vertexType, parts));
            }
        } else {
             seeds.push(createSeed(vm.seedVertexType, vm.seedVertexParts));
        }

        reset()
        $mdDialog.hide(seeds);
    }

    var reset = function() {
        vm.seedVertexType = ''
        vm.seedVertex = ''
        vm.seedVertices = ''
        vm.seedVertexParts = {}
    }

    var createSeed = function(type, parts) {
        var typeClass = schema.getSchema().types[type].class
        var vertex = types.getType(typeClass).createValueAsJsonWrapperObj(typeClass, parts)
        return {vertexType: type, vertex: vertex}
    }
}

