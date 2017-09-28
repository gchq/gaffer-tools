(function() {

    'use strict'

    angular.module('app').factory('functionService', functionService)

    function functionService($http, schemaService, settingsService) {

        return {
            getFunctions: getFunctions,
            getFunctionParameters: getFunctionParameters
        }

        function getFunctions(group, property, onSuccess) {
            var type;
            var schema = schemaService.getSchema()
            if(schema.entities[group]) {
                type = schema.entities[group].properties[property];
            } else if(schema.edges[group]) {
               type = schema.edges[group].properties[property];
            }

            var className = "";
            if(type) {
              className = schema.types[type].class;
            }

            var queryUrl = settingsService.getRestUrl + "/graph/config/filterFunctions/" + className;
            
            if(!queryUrl.startsWith("http")) {
                queryUrl = "http://" + queryUrl;
            }

            $http.get(queryUrl)
            .success(onSuccess)
            .error(function(err) {
                console.err('ERROR: error loading functions for group: ' + group + ', property: ' + property + '.\n' + err)
            })
        }

        function getFunctionParameters(functionClassName, onSuccess) {
            var queryUrl = settings.restUrl + "/graph/config/serialisedFields/" + functionClassName;

            if(!queryUrl.startsWith("http")) {
                queryUrl = "http://" + queryUrl;    // TODO create common util service
            }

            $http.get(queryUrl)
            .success(onSuccess)
            .error(function(err) {
                console.err('ERROR: Failed to get serialised fields for ' + functionClassName + '.\n' + err)
            })


        }

    }
})()