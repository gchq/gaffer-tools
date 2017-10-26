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

'use strict'

angular.module('app').factory('functions', ['$http', 'schema', 'config', 'common', function($http, schemaService, config, common) {

    var functions = {};


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

        var queryUrl = common.parseUrl(config.get().restEndpoint + "/graph/config/filterFunctions/" + className);

        $http.get(queryUrl)
            .success(function(response) {
                onSuccess(response)
            })
            .error(function(err) {
                var errorString = 'Error loading functions for group: ' + group + ', property: ' + property + '.\n'
                if (err && err !== "") {
                    alert(errorString + err.simpleMessage);
                    console.log(err);
                } else {
                    alert(errorString);
                }
        });
    }

    functions.getFunctionParameters = function(functionClassName, onSuccess) {
        var queryUrl = common.parseUrl(config.get().restEndpoint + "/graph/config/serialisedFields/" + functionClassName);

        $http.get(queryUrl)
            .success(function(response) {
                onSuccess(response)
            })
            .error(function(err) {
                var errorString = 'Failed to get serialised fields for ' + functionClassName + '.\n'
                if (err && err !== "") {
                    alert(errorString + err.simpleMessage);
                    console.log(err);
                } else {
                    alert(errorString);
                }
        });
    }

    return functions;

}])