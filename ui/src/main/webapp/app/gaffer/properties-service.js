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

angular.module('app').factory('properties', ['config', '$q', 'common', '$http', 'error', function(config, $q, common, $http, error) {
    var service = {};

    var properties;
    var deferredRequests;

    var load = function() {
        config.get().then(function(conf) {
            var url = common.parseUrl(conf.restEndpoint);

            $http.get(url + '/properties')
                .then(function(response) {
                    properties = response.data;
                    deferredRequests.resolve(properties);
                },
                function(err) {
                    deferredRequests.reject(err.data);
                    error.handle("Unable to load graph properties", err.data);
                })
                .finally(function() {
                    deferredRequests = undefined;
                });
        })
    }

    service.get = function() {
        if (properties) {
            return $q.when(properties);
        } else if (!deferredRequests) {
            deferredRequests = $q.defer();
            load();
        }

        return deferredRequests.promise;
    }

    return service;
}]);
