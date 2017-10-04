

'use strict'

angular.module('app').factory('operations', ['$http', 'settings', 'config', 'query', function($http, settings, config, query) {

    var operations = {}

    var opWhiteList = undefined; // TODO should probably be populated by GET graph/config/operations
    var opBlackList = [];        // TODO should probably be populated by the config service
    var availableOps = []
    var namedOperations = []

    operations.getAvailableOperations = function() {
        return this.availableOps
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
        availableOps = [];
        var config = config.getConfig().operations.defaultAvailable
        for(var i in config[i]) {
            if(opAllowed(config[i].name)) {
                availableOps.push(settings.getDefaultAvailableOps[i]);
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
                                results[i].parameters[j].parts = settings.getType(valueClass).createParts(valueClass, results[i].parameters[j].defaultValue);
                            } else {
                                results[i].parameters[j].parts = {};
                            }
                        }
                    }
                    availableOps.push({
                        class: raw.namedOpClass,
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

    operations.reloadNamedOperations = function(url) {
        query.execute(
            url,
            JSON.stringify(
            {
                class: "uk.gov.gchq.gaffer.named.operation.GetAllNamedOperations"
            }), updateNamedOperations)
    }


//    function createLimitOperation() {
//        return {
//            class: "uk.gov.gchq.gaffer.operation.impl.Limit",
//            resultLimit: settings.getResultLimit()
//        }
//    }
//
//    function createDeduplicateOperation() {
//        return {
//            class: "uk.gov.gchq.gaffer.operation.impl.output.ToSet",
//        };
//    }

    return operations

}])
