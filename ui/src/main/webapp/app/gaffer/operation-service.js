/*
 * Copyright 2017-2018 Crown Copyright
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

angular.module('app').factory('operationService', ['$http', '$q', 'settings', 'config', 'query', 'types', 'common', 'error', function($http, $q, settings, config, query, types, common, error) {

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

    var hasInputB = function(first, availableOps) {
        for (var i in availableOps) {
            if (availableOps[i].class && common.endsWith(availableOps[i].class, first)) {
                return availableOps[i].inputB
            }
        }

        return false;
    }

    var getInputType = function(first, availableOps) {
        for (var i in availableOps) {
            if (availableOps[i].class && common.endsWith(availableOps[i].class, first)) {
                return availableOps[i].input;
            }
        }

        return true;
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

                        var opChain = JSON.parse(results[i].operations);
                        var first = opChain.operations[0].class;

                        var inputB = hasInputB(first, conf.operations.defaultAvailable);

                        if (inputB) {
                            if ((!results[i].parameters) || results[i].parameters['inputB'] === undefined) { // unsupported
                                console.log('Named operation ' + results[i].operationName + ' starts with a GetElementsBetweenSets operation but does not contain an "inputB" parameter. This is not supported by the UI');
                                continue;
                            } else {
                                delete results[i].parameters['inputB'] // to avoid it coming up in the parameters section
                                if (Object.keys(results[i].parameters).length === 0) {
                                    results[i].parameters = undefined;
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
                            input: getInputType(first, conf.operations.defaultAvailable),
                            inputB: inputB,
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
            query.execute(
                {
                    class: getAllClass,
                    options: settings.getDefaultOpOptions()
                },
                updateNamedOperations,
                function(err) {
                    updateNamedOperations([]);
                    if (loud) {
                        error.handle('Failed to load named operations', err);
                    }
                }
            );
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
                .then(function(response) {
                    var ops = response.data;
                    if (ops.indexOf(operationClass) !== -1) {
                        onSupported();
                        return;
                    }
                    onUnsupported();
                },
                function(err) {
                    error.handle('Error getting available graph operations', err.data);
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
