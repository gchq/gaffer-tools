

'use strict'

angular.module('app').factory('query', ['$http', 'config', '$q', function($http, config, $q) {

    var query = {}
    var defer = $q.defer()

    var operations = []

    query.getOperations = function() {
        return operations
    }

    query.observeOperations = function() {
        return defer.promise
    }

    query.execute = function(operationChain, onSuccess) {
        var queryUrl = config.get().restEndpoint + "/graph/operations/execute"

        if(!queryUrl.startsWith("http")) {
            queryUrl = "http://" + queryUrl
        }

        $http.post(queryUrl, operationChain)
             .success(function(results){
                onSuccess(results)
             })
             .error(function(err) {
                console.error("Error: " + err.statusCode + " - " + err.status);
             });
    }

    query.addOperation = function(operation) {
        operations.push(operation)
        defer.notify(operations)
    }

    query.setOperations = function(ops) {
        operations = ops
        defer.notify(operations)
    }



    return query
}])