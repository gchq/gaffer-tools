(function () {

    'use strict'

    angular.module('app').factory('operationService', operationService)

    function operationService($http, settingsService, configService) {

        return {
            execute: execute,
            getNamedOperations: getNamedOperations,
            reloadNamedOperations: reloadNamedOperations,
            getAvailableOperations: getAvailableOperations
        }

        var opWhiteList = undefined; // TODO should probably be populated by GET graph/config/operations
        var opBlackList = [];        // TODO should probably be populated by the config service
        var availableOps = []

        reloadNamedOperations()

        var namedOperations = []

        function getAvailableOperations() {
            return availableOps;
        }

        function opAllowed(opName) {
            var allowed = true;
            if(settings.whiteList) {
                allowed = settings.whiteList.indexOf(opName) > -1;
            }
            if(allowed && settings.blackList) {
                allowed = settings.backList.indexOf(opName) == -1;
            }
            return allowed;
        }

        var updateNamedOperations = function(results) {
            availableOps = [];
            var config = configService.getConfig().operations.defaultAvailable
            for(var i in config[i]) {
                if(opAllowed(config[i].name)) {
                    availableOps.push(settings.defaultAvailableOps[i]);
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

        function getNamedOperations() {
            return namedOperations
        }

        function reloadNamedOperations() {
            execute(JSON.stringify(
                {
                    class: "uk.gov.gchq.gaffer.named.operation.GetAllNamedOperations"
                }), updateNamedOperations)
        }


        function execute(operationChain, onSuccess) {
            var queryUrl = settingsService.getRestUrl() + "/graph/operations/execute"

            if(!queryUrl.startsWith("http")) {
                queryUrl = "http://" + queryUrl
            }

            $http.post(queryUrl)
                 .success(function(results){
                    onSuccess(results)
                 })
                 .error(function(err) {
                    console.err("Error: " + err);
                 });
        }

    }

})()