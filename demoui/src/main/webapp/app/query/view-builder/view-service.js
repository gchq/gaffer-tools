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

angular.module('app').factory('view', ['operationService', 'config', 'operationOptions', 'query', '$q', 'types', 'events', function(operationService, config, operationOptions, query, $q, types, events) {
    var service = {};
    var availableNamedViews;
    var firstLoad = true;
    var defer = $q.defer();

    service.getAvailableNamedViews = function() {
        return availableNamedViews;
    }

    var viewAllowed = function(viewName, configuredViews) {
        var allowed = true;
        var whiteList = undefined;//configuredViews.whiteList;
        var blackList = undefined;//configuredViews.blackList;

        if(whiteList) {
            allowed = whiteList.indexOf(viewName) > -1;
        }
        if(allowed && blackList) {
            allowed = blackList.indexOf(viewName) == -1;
        }
        return allowed;
    }

    var updateNamedViews = function(results) {
        availableNamedViews = [];
        config.get().then(function(conf) {
            if(results) {
                for (var i in results) {
                    if(viewAllowed(results[i].name, conf.views)) {
                        if(results[i].parameters) {
                            for(var j in results[i].parameters) {
                                results[i].parameters[j].value = results[i].parameters[j].defaultValue;
                                if(results[i].parameters[j].defaultValue) {
                                    var valueClass = results[i].parameters[j].valueClass;
                                    results[i].parameters[j].parts = types.createParts(valueClass, results[i].parameters[j].defaultValue);
                                } else {
                                    results[i].parameters[j].parts = {};
                                }
                            }
                        }
                        availableNamedViews.push(angular.copy(results[i]));
                    }
                }

            }
            defer.resolve(availableNamedViews);
        });
    }

    service.shouldLoadNamedViewsOnStartup = function() {
        var defer = $q.defer();
        if (firstLoad) {
            config.get().then(function(conf) {
                if (conf.operations.loadNamedViewsOnStartup === false) {
                    defer.resolve(false);
                } else {
                    defer.resolve(true);
                }
            })
            firstLoad = false;
        } else {
            defer.resolve(false);
        }

        return defer.promise;
    }

    service.reloadNamedViews = function(loud) {
        defer = $q.defer();
        var getAllClass = "uk.gov.gchq.gaffer.named.view.GetAllNamedViews";
        operationService.ifOperationSupported(getAllClass, function() {
            query.execute(
                {
                    class: getAllClass,
                    options: operationOptions.getDefaultOperationOptions()
                },
                updateNamedViews,
                function(err) {
                    updateNamedViews([]);
                    if (loud) {
                        console.log(err);
                        alert('Failed to reload named views: ' + err.simpleMessage);
                    }
                }
            );
        },
        function() {
            updateNamedViews([]);
        });

        return defer.promise;
    }

    return service;
}]);
