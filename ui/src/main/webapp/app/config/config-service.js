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

angular.module('app').factory('config', ['$http', '$q', 'defaultRestEndpoint', 'error', function($http, $q, defaultRestEndpoint, error) {

    var configService = {};

    var config;
    var defer;

    configService.get = function() {
        if (config) {
            return $q.when(config);
        } else if (!defer) {
            defer = $q.defer();
            load();
        }

        return defer.promise;
    }

    configService.set = function(conf) {
        config = conf;
    }


    var load = function() {
        $http.get('config/defaultConfig.json')
            .then(function(response) {
                var defaultConfig = response.data;
                if(defaultConfig === undefined) {
                    defaultConfig = {};
                }
                var mergedConfig = defaultConfig;
                $http.get('config/config.json')
                    .then(function(response) {
                        var customConfig = response.data;

                        if(customConfig === undefined) {
                            customConfig = {};
                        }
                        if (!mergedConfig.restEndpoint && !customConfig.restEndpoint) {
                            mergedConfig.restEndpoint = defaultRestEndpoint.get();
                        }
                        if('types' in mergedConfig && 'types' in customConfig) {
                            angular.merge(mergedConfig['types'], customConfig['types']);
                            delete customConfig['types'];
                        }
                        if('operations' in mergedConfig && 'operations' in customConfig) {
                            angular.merge(mergedConfig['operations'], customConfig['operations']);
                            delete customConfig['operations'];
                        }
                        angular.merge(mergedConfig, customConfig);
                        config = mergedConfig;
                        document.title = config.title;
                        defer.resolve(config);
                    },
                    function(err) {
                        defer.reject(err);
                        error.handle("Failed to load custom config", err);
                });
            },
            function(err) {
                defer.reject(err);
                error.handle("Failed to load config", err);
        });
    }

    return configService;

}])
