

'use strict'

angular.module('app').factory('operationService', ['$http', 'settings', 'config', 'query', 'types', 'common', function($http, settings, config, query, types, common) {

    var operationService = {}

    var opWhiteList = undefined; // TODO should probably be populated by GET graph/config/operations
    var opBlackList = [];        // TODO should probably be populated by the config service
    var availableOperations = []
    var namedOpClass = "uk.gov.gchq.gaffer.named.operation.NamedOperation"

    operationService.getAvailableOperations = function() {
        return availableOperations
    }

    var opAllowed = function(opName) {
//            var allowed = true;
//            if(settings.whiteList) {
//                allowed = settings.whiteList.indexOf(opName) > -1;
//            }
//            if(allowed && settings.blackList) {
//                allowed = settings.backList.indexOf(opName) == -1;
//            }
//            return allowed;
        return true
    }

    var updateNamedOperations = function(results) {
        availableOperations = [];
        var defaults = config.get().operations.defaultAvailable
        for(var i in defaults) {
            if(opAllowed(defaults[i].name)) {
                availableOperations.push(defaults[i])
            }
        }

        if(results) {
            for (var i in results) {
                if(opAllowed(results[i].operationName)) {
                    if(results[i].parameters) {
                        for(j in results[i].parameters) {
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
        var getAllClass = "uk.gov.gchq.gaffer.named.operation.GetAllNamedOperations"
        ifOperationSupported(getAllClass, function() {
            query.execute(JSON.stringify(
                {
                    class: getAllClass
                }
            ), updateNamedOperations);
        },
        function() {
            updateNamedOperations([]);
        })

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
            console.log("Error: " + err.statusCode + " - "  + err.status);
            onUnsupported();
        })
    }



    operationService.createLimitOperation = function() {
        return {
            class: "uk.gov.gchq.gaffer.operation.impl.Limit",
            resultLimit: settings.getResultLimit()
        }
    }

    operationService.createDeduplicateOperation = function() {
        return {
            class: "uk.gov.gchq.gaffer.operation.impl.output.ToSet",
        };
    }

    operationService.createCountOperation = function() {
        return {
            class: "uk.gov.gchq.gaffer.operation.impl.Count"
        }
    }

    return operationService

}])
