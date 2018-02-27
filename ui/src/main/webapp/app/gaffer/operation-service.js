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

angular.module('app').factory('operationService', ['$http', '$q', 'settings', 'config', 'query', 'types', 'common', function($http, $q, settings, config, query, types, common) {

    var operationService = {};

    var availableOperations;
    var namedOpClass = "uk.gov.gchq.gaffer.named.operation.NamedOperation";
    var deferredAvailableOperations;
    var deferredNamedOperationsQueue = [];


    operationService.getAvailableOperations = function() {
        if (availableOperations) {
            return $q.when(availableOperations);
        } else if (!deferredAvailableOperations) {

            deferredAvailableOperations = $q.defer();
            config.get().then(function(conf) {
                if (conf.operations && conf.operations.defaultAvailable) {
                    availableOperations = conf.operations.defaultAvailable;
                    deferredAvailableOperations.resolve(availableOperations);
                } else {
                    deferredAvailableOperations.resolve([]);
                }
            });
        }

        return deferredAvailableOperations.promise;
    }

    var opAllowed = function(opName, configuredOperations) {
        if (!configuredOperations) {
            return true; // allow all by default
        }


        var allowed = true;

        var whiteList = configuredOperations.whiteList;
        var blackList = configuredOperations.blackList;

        if(whiteList) {
            allowed = whiteList.indexOf(opName) > -1;
        }
        if(allowed && blackList) {
            allowed = blackList.indexOf(opName) == -1;
        }
        return allowed;
    }

    var updateNamedOperations = function(results) {
        availableOperations = [];
        config.get().then(function(conf) {
            var defaults = conf.operations && conf.operations.defaultAvailable ? conf.operations.defaultAvailable : [];
            for(var i in defaults) {
                if(opAllowed(defaults[i].name, conf.operations)) {
                    availableOperations.push(defaults[i]);
                }
            }

            if(results) {
                for (var i in results) {
                    if(opAllowed(results[i].operationName, conf.operations)) {
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
                        availableOperations.push({
                            class: namedOpClass,
                            name: results[i].operationName,
                            parameters: results[i].parameters,
                            description: results[i].description,
                            operations: results[i].operations,
                            view: false,
                            input: true,
                            namedOp: true,
                            inOutFlag: false
                        });
                    }
                }

            }
            for (var i in deferredNamedOperationsQueue) {
                deferredNamedOperationsQueue[i].resolve(availableOperations);
            }

            deferredNamedOperationsQueue = [];
        });
    }

    operationService.reloadNamedOperations = function(loud) {
        var deferred = $q.defer();

        deferredNamedOperationsQueue.push(deferred);

        var getAllClass = "uk.gov.gchq.gaffer.named.operation.GetAllNamedOperations";
        operationService.ifOperationSupported(getAllClass, function() {
            query.execute(JSON.stringify(
                {
                    class: getAllClass,
                    options: settings.getDefaultOpOptions()
                }
            ),
            updateNamedOperations,
            function(err) {
                updateNamedOperations([]);
                if (loud) {
                    console.log(err);
                    alert('Failed to reload named operations: ' + err.simpleMessage);
                }
            });

        },
        function() {
            updateNamedOperations([]);
        });

        return deferred.promise;
    }

    operationService.ifOperationSupported = function(operationClass, onSupported, onUnsupported) {
        config.get().then(function(conf) {
            var queryUrl = common.parseUrl(conf.restEndpoint + "/graph/operations");

            $http.get(queryUrl)
                .success(function(ops) {
                    if (ops.indexOf(operationClass) !== -1) {
                        onSupported();
                        return;
                    }
                    onUnsupported();
                })
                .error(function(err) {
                    if (err && err !== "") {
                        console.log(err);
                        alert("Error running /graph/operations: " + err.simpleMessage);
                    } else {
                        alert("Error running /graph/operations - received no response");
                    }
                    onUnsupported();
            });
        })
    }

    operationService.createGetSchemaOperation = function() {
        var options = settings.getDefaultOpOptions();
        if (!options) {
            options = {};
        }

        return {
            class: "uk.gov.gchq.gaffer.store.operation.GetSchema",
            compact: false,
            options: options
        };
    }

    operationService.createLimitOperation = function(opOptions) {
        if(!opOptions){
            opOptions = {};
        }
        return {
            class: "uk.gov.gchq.gaffer.operation.impl.Limit",
            resultLimit: settings.getResultLimit(),
            options: opOptions
        };
    }

    operationService.createDeduplicateOperation = function(opOptions) {
        if(!opOptions){
            opOptions = {};
        }
        return {
            class: "uk.gov.gchq.gaffer.operation.impl.output.ToSet",
            options: opOptions
        };
    }

    operationService.createCountOperation = function(opOptions) {
        if(!opOptions){
            opOptions = {};
        }
        return {
            class: "uk.gov.gchq.gaffer.operation.impl.Count",
            options: opOptions
        };
    }

    return operationService;

}]);
