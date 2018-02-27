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

angular.module('app').factory('properties', ['config', '$q', 'common', '$http', function(config, $q, common, $http) {
    var service = {};

    var properties;
    var deferredRequests;

    var load = function() {
        config.get().then(function(conf) {
            var url = common.parseUrl(conf.restEndpoint);

            $http.get(url + '/properties')
                .success(function(props) {
                    properties = props;
                    deferredRequests.resolve(props);
                })
                .error(function(err) {
                    deferredRequests.reject(err);
                    if (err && err !== "") {
                        alert("Unable to load properties: " + err.simpleMessage);
                        console.log(err);
                    } else {
                        alert("Unable to load properties. Received no response");
                    }

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