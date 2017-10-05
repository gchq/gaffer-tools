

'use strict'

angular.module('app').factory('query', ['$http', '$q', function($http, $q) {

    var query = {}
    var defer = $q.defer()

    query.operations = []

    query.observeOperations = function() {
        return defer.promise
    }

    query.execute = function(url, operationChain, onSuccess) {
        var queryUrl = url + "/graph/operations/execute"

        if(!queryUrl.startsWith("http")) {
            queryUrl = "http://" + queryUrl
        }

        $http.post(queryUrl, operationChain)
             .success(function(results){
                onSuccess(results)
             })
             .error(function(err) {
                console.error("Error: " + err);
             });
    }

    query.addOperation = function(operation) {
        query.operations.push(operation)
        defer.notify()
    }

    query.setOperations = function(ops) {
        query.operations = ops
        defer.notify()
    }



    return query
}])