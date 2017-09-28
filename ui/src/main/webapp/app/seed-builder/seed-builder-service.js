(function() {
    'use strict'

    angular.module('app').factory('seedBuilderService', seedBuilderService)

    function seedBuilderService(schemaService, typeService) {

        return {
            createSeed: createSeed
        }

        function  createSeed(type, parts) {
            var typeClass = schemaService.getSchema().types[type].class
            var vertex = typeService.getType(typeClass).createValueAsJsonWrapperObj(typeClass, parts)
            return {vertexType: type, vertex: vertex}
        }
    }
})()