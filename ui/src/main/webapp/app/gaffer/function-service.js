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


angular.module('app').factory('functions', ['$http', 'config', 'common', 'error', function($http, config, common, error) {

    var functions = {};

    functions.getFunctions = function(className, onSuccess) {
        config.get().then(function(conf) {
            var queryUrl = common.parseUrl(conf.restEndpoint + "/graph/config/filterFunctions/" + className);
            $http.get(queryUrl)
                .then(function(response) {
                    onSuccess(response.data)
                },
                function(err) {
                    error.handle('Could not retrieve filter functions for ' + className, err.data);
            });
        });
    }

    functions.getFunctionParameters = function(functionClassName, onSuccess) {
        config.get().then(function(conf) {
            var queryUrl = common.parseUrl(conf.restEndpoint + "/graph/config/serialisedFields/" + functionClassName + "/classes");

            $http.get(queryUrl)
                .then(function(response) {
                    onSuccess(response.data);
                },
                function(err) {
                    error.handle('Could not get serialised fields for ' + functionClassName, err.data);
            });
        });
    }

    return functions;

}]);
