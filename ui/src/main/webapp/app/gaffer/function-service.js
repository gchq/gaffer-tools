'use strict'

angular.module('app').factory('functions', ['$http', 'schema', 'config', 'common', function($http, schemaService, config, common) {

    var functions = {}


    functions.getFunctions = function(group, property, onSuccess) {
        var type;
        var schema = schemaService.get();

        if(schema.entities[group]) {
            type = schema.entities[group].properties[property];
        } else if(schema.edges[group]) {
           type = schema.edges[group].properties[property];
        }

        var className = "";
        if(type) {
          className = schema.types[type].class;
        }

        var queryUrl = common.parseUrl(config.get().restEndpoint + "/graph/config/filterFunctions/" + className)

        $http.get(queryUrl)
            .then(function(response) {
                onSuccess(response.data)
            },
            function(err) {
                console.error('ERROR: error loading functions for group: ' + group + ', property: ' + property + '.\n' + err)
        })
    }

    functions.getFunctionParameters = function(functionClassName, onSuccess) {
        var queryUrl = common.parseUrl(config.get().restEndpoint + "/graph/config/serialisedFields/" + functionClassName);

        $http.get(queryUrl)
        .then(function(response) {
            onSuccess(response.data)
        },
        function(err) {
            console.error('ERROR: Failed to get serialised fields for ' + functionClassName + '.\n' + err)
        })
    }

    return functions;

}])