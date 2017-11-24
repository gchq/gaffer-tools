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

angular.module('app').factory('config', ['$http', '$q', 'defaultRestEndpoint', function($http, $q, defaultRestEndpoint) {

    var configService = {};

    var config;

    configService.get = function() {
        var defer = $q.defer();

        if (config) {
            defer.resolve(config);
        } else {
            load(defer)
        }
        return defer.promise;
    }

    configService.set = function(conf) {
        config = conf;
    }

    var load = function(defer) {
        $http.get('config/config.json')
            .success(function(response) {
                if (!response.restEndpoint) {
                    response.restEndpoint = defaultRestEndpoint.get();
                }
                config = response;
                defer.resolve(config);
            })
            .error(function(err) {
                defer.reject(err);
                console.log(err);
                alert("Failed to load config");
        });
    }

    return configService;

}])