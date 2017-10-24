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

angular.module('app').factory('query', ['$http', 'config', '$q', 'common', function($http, config, $q, common) {

    var query = {};
    var defer = $q.defer();

    var operations = [];

    query.getOperations = function() {
        return operations;
    }

    query.observeOperations = function() {
        return defer.promise;
    }

    query.execute = function(operationChain, onSuccess) {
        var queryUrl = config.get().restEndpoint + "/graph/operations/execute";

        queryUrl = common.parseUrl(queryUrl);

        $http.post(queryUrl, operationChain)
            .success(function(response){
                onSuccess(response)
            })
            .error(function(err) {
                alert("Error executing operation: " + err.statusCode + " - " + err.status);
                console.log(err)
        });
    }

    query.addOperation = function(operation) {
        operations.push(operation);
        defer.notify(operations);
    }

    query.setOperations = function(ops) {
        operations = ops;
        defer.notify(operations);
    }



    return query;
}]);