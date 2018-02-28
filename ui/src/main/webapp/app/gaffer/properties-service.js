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

angular.module('app').factory('properties', ['config', '$q', 'common', '$http', 'error', function(config, $q, common, $http, error) {
    var service = {};

    var properties;

    var load = function(defer) {
        config.get().then(function(conf) {
            var url = common.parseUrl(conf.restEndpoint);

            $http.get(url + '/properties')
                .success(function(props) {
                    properties = props;
                    defer.resolve(props);
                })
                .error(function(err) {
                    defer.reject(err);
                    error.handle("Unable to load graph properties", err);

                });
        })
    }

    service.get = function() {
        var defer = $q.defer()
        if (properties) {
            defer.resolve(properties);
        } else {
            load(defer);
        }

        return defer.promise;
    }

    return service;
}]);