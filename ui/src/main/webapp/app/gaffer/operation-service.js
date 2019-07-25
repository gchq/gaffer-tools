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

angular.module('app').factory('operationService', ['$http', '$q', 'settings', 'config', 'query', 'types', 'common', 'error', 'operationOptions', function($http, $q, settings, config, query, types, common, error, operationOptions) {

    var operationService = {};

    var availableOperations;
    var namedOpClass = "uk.gov.gchq.gaffer.named.operation.NamedOperation";
    var deferredAvailableOperations;

    var handledFields = [
        "input",
        "inputB",
        "options",
        "view",
        "views"
    ];

    var handledFieldClasses = [
        "uk.gov.gchq.gaffer.data.elementdefinition.view.View"
    ];

    operationService.canHandleField = function(field) {
        return types.isKnown(field.className)
            || handledFieldClasses.indexOf(field.className) > -1
            || handledFields.indexOf(field.name) > -1;
    }

    operationService.canHandleOperation = function(operation) {
        for(var i in operation.fields) {
            if(!operationService.canHandleField(operation.fields[i])) {
                return false;
            }
        }
        return true;
    }

    operationService.getAvailableOperations = function() {
        if (availableOperations) {
            return $q.when(availableOperations);
        } else if (!deferredAvailableOperations) {
            deferredAvailableOperations = $q.defer();
            operationService.reloadOperations(false).then(function() {
                deferredAvailableOperations.resolve(availableOperations);
            });
        }

        return deferredAvailableOperations.promise;
    }

    var hasInputB = function(first, availableOps) {
        for (var i in availableOps) {
            if (availableOps[i].class && common.endsWith(availableOps[i].class, first)) {
                return availableOps[i].fields['inputB'];
            }
        }

        return false;
    }

    var getInputType = function(first, availableOps) {
        for (var i in availableOps) {
            if (availableOps[i].class && common.endsWith(availableOps[i].class, first)) {
                return availableOps[i].fields['input'];
            }
        }

        return undefined;
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

    var addOperations = function(operations, conf) {
        if(operations) {
            for (var i in operations) {
                var op = operations[i];

                if(opAllowed(op.name, conf.operations) && operationService.canHandleOperation(op)) {
                    var fields = {};
                    for(var j in op.fields) {
                        fields[op.fields[j].name] = op.fields[j];
                    }
                    var availableOp = {
                          class: op.name,
                          name: common.toTitle(op.name),
                          description: op.summary,
                          fields: fields,
                          next: op.next
                    };
                    availableOperations.push(availableOp);
                }
            }
        }
    }

    var addNamedOperations = function(operations) {
        config.get().then(function(conf) {
            if(operations) {
                for (var i in operations) {
                    var op = operations[i];
                    if(opAllowed(op.operationName, conf.operations)) {
                        if(op.parameters) {
                            for(var j in op.parameters) {
                                op.parameters[j].value = op.parameters[j].defaultValue;
                                if(op.parameters[j].defaultValue) {
                                    var valueClass = op.parameters[j].valueClass;
                                    op.parameters[j].parts = types.createParts(valueClass, op.parameters[j].defaultValue);
                                } else {
                                    op.parameters[j].parts = {};
                                }
                            }
                        }

                        var opChain = JSON.parse(op.operations);
                        var first = opChain.operations[0].class;

                        var inputB = hasInputB(first, availableOperations);

                        if (inputB) {
                            if (op.parameters && op.parameters['inputB'] ) {
                                delete op.parameters['inputB']
                                 // to avoid it coming up in the parameters section
                                if (Object.keys(op.parameters).length === 0) {
                                    op.parameters = undefined;
                                }
                            } else {
                                console.log('Named operation ' + op.operationName + ' starts with a GetElementsBetweenSets operation but does not contain an "inputB" parameter. This is not supported by the UI');
                                continue;
                            }
                        }

                        var availableOp = {
                              class: namedOpClass,
                              name: op.operationName,
                              parameters: op.parameters,
                              description: op.description,
                              operations: op.operations,
                              fields: {
                                  input: getInputType(first, availableOperations),
                                  inputB: inputB,
                              },
                              namedOp: true
                        };
                        availableOperations.push(availableOp);
                    }
                }
            }
        });
    }

    operationService.reloadOperations = function(loud) {
        var deferred = $q.defer();


        config.get().then(function(conf) {
            var queryUrl = common.parseUrl(conf.restEndpoint + "/graph/operations/details");
            $http.get(queryUrl)
                .then(function(response){
                    availableOperations = [];
                    addOperations(response.data, conf);
                    var getAllClass = "uk.gov.gchq.gaffer.named.operation.GetAllNamedOperations";
                    if(common.arrayContainsObjectWithValue(availableOperations, "class", getAllClass)) {
                        query.execute(
                            {
                                class: getAllClass,
                                options: operationOptions.getDefaultOperationOptions()
                            },
                            function(result) {
                                addNamedOperations(result, conf);
                                deferred.resolve(availableOperations);
                            },
                            function(err) {
                                if (loud) {
                                    error.handle('Failed to load named operations', err);
                                    deferred.reject(err);
                                }
                                deferred.resolve(availableOperations);
                            }
                        );
                    } else {
                        deferred.resolve(availableOperations);
                    }
                },
                function(err) {
                    error.handle('Unable to load operations', err.data);
                    deferred.resolve([]);
                });
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
        var options = operationOptions.getDefaultOperationOptions();
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
