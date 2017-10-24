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

angular.module('app').factory('operationService', ['$http', 'settings', 'config', 'query', 'types', 'common', function($http, settings, config, query, types, common) {

    var operationService = {};

    var availableOperations = [];
    var namedOpClass = "uk.gov.gchq.gaffer.named.operation.NamedOperation";

    operationService.getAvailableOperations = function() {
        return availableOperations;
    }

    var opAllowed = function(opName) {
        var allowed = true;
        var whiteList = config.get().operations.whiteList;
        var blackList = config.get().operations.blackList;

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
        var defaults = config.get().operations.defaultAvailable;
        for(var i in defaults) {
            if(opAllowed(defaults[i].name)) {
                availableOperations.push(defaults[i]);
            }
        }

        if(results) {
            for (var i in results) {
                if(opAllowed(results[i].operationName)) {
                    if(results[i].parameters) {
                        for(var j in results[i].parameters) {
                            results[i].parameters[j].value = results[i].parameters[j].defaultValue;
                            if(results[i].parameters[j].defaultValue) {
                                var valueClass = results[i].parameters[j].valueClass;
                                results[i].parameters[j].parts = types.getType(valueClass).createParts(valueClass, results[i].parameters[j].defaultValue);
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
    }

    operationService.reloadNamedOperations = function() {
        var getAllClass = "uk.gov.gchq.gaffer.named.operation.GetAllNamedOperations";
        ifOperationSupported(getAllClass, function() {
            query.execute(JSON.stringify(
                {
                    class: getAllClass
                }
            ), updateNamedOperations);
        },
        function() {
            updateNamedOperations([]);
        });

    }

    var ifOperationSupported = function(operationClass, onSupported, onUnsupported) {
        var queryUrl = common.parseUrl(config.get().restEndpoint + "/graph/operations");

        $http.get(queryUrl)
            .success(function(ops) {
                if (ops.indexOf(operationClass) !== -1) {
                    onSupported();
                    return;
                }
                onUnsupported();
            })
            .error(function(err) {
                console.log(err);
                alert("Error running /graph/operations: " + err.statusCode + " - "  + err.status);
                onUnsupported();
        });
    }



    operationService.createLimitOperation = function() {
        return {
            class: "uk.gov.gchq.gaffer.operation.impl.Limit",
            resultLimit: settings.getResultLimit()
        };
    }

    operationService.createDeduplicateOperation = function() {
        return {
            class: "uk.gov.gchq.gaffer.operation.impl.output.ToSet",
        };
    }

    operationService.createCountOperation = function() {
        return {
            class: "uk.gov.gchq.gaffer.operation.impl.Count"
        };
    }

    return operationService;

}]);
