(function () {

    'use strict'

    function operationService($http, settingsService) {

        return {
            execute: execute
            getNamedOperations: getNamedOperations
            reloadNamedOperations: reloadNamedOperations
        }

        reloadNamedOperations()


        var namedOperations = []

        function getNamedOperations() {
            return namedOperations
        }

        function setNamedOperations(namedOps) {
            namedOperations = namedOps
        }

        function reloadNamedOperations() {
            execute(JSON.stringify(
                {
                    class: "uk.gov.gchq.gaffer.named.operation.GetAllNamedOperations"
                }), setNamedOperations)
        }


        function execute(operationChain, onSuccess) {
            var queryUrl = settingsService.getRestUrl() + "/graph/operations/execute"

            if(!queryUrl.startsWith("http")) {
                queryUrl = "http://" + queryUrl
            }

            $http.get(settingsService.getRestUrl() + "/graph/config/schema")
                 .success(function(results){
                    onSuccess(results)
                 })
                 .error(function(err) {
                    console.err("Error: " + err);
                 });
        }

    }

})()