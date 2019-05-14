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

angular.module('app').factory('query', ['$http', 'config', 'events', 'common', 'error', 'loading', 'settings', 'results', '$mdDialog', '$routeParams', '$location', function($http, config, events, common, error, loading, settings, results, $mdDialog, $routeParams, $location) {

    var query = {};
    var operations = [];

    query.executeOperationJson = function(operationJson) {
        if(operationJson) {
            var operationJsonArray;
            if(Array.isArray(operationJson)) {
                operationJsonArray = operationJson;
            } else {
                operationJsonArray = [operationJson];
            }
            for (var i in operationJsonArray) {
                try {
                    var operation = JSON.parse(operationJsonArray[i]);
                    query.addOperation(operation);
                    query.executeQuery(operation);
                } catch (err) {
                    error.handle('Error executing operation. Is it a valid json operation string?', operationJsonArray[i]);
                }
            }
        }
    }

    /**
     * Alerts the user if they hit the result limit
     * @param {Array} data The data returned by the Gaffer REST service
     */
    var showTooManyResultsPrompt = function(data, onSuccess) {
        $mdDialog.show({
            template: '<result-count-warning aria-label="Result Count Warning"></result-count-warning>',
            parent: angular.element(document.body),
            clickOutsideToClose: false
        })
        .then(function(command) {
            if(command === 'results') {
                results.update(data);
                if(onSuccess) {
                    onSuccess(data);
                }
            }
        });
    }

    query.getOperations = function() {
        return operations;
    }

    /**
     * Executes a query. If too many results are returned a dialog is shown
     * to ask the user if they would like to view the results or amend their
     * query. On success, the result service is called to update the results.
     * @param {Object} The operation chain to execute. It can either be an object or a json string.
     */
    query.executeQuery = function(operation, onSuccess, onFailure) {
        query.execute(
            operation,
            function(data) {
                loading.finish()
                if (data.length >= settings.getResultLimit()) {
                    showTooManyResultsPrompt(data.slice(0, settings.getResultLimit()), onSuccess);
                } else {
                   results.update(data);
                   if(onSuccess) {
                       onSuccess(data);
                   }
                }
            },
            function(err) {
                loading.finish();
                error.handle('Error executing operation', err);
                if (onFailure) {
                    onFailure(err);
                }
            }
        );
    }

    /**
     * Executes an operation and calls the onSuccess or onFailure functions provided.
     * @param {Object} The operation chain to execute. It can either be an object or a json string.
     */
    query.execute = function(operation, onSuccess, onFailure) {
        if(typeof operation !== 'string' && !(operation instanceof String)) {
            operation = JSON.stringify(operation);
        }
        config.get().then(function(conf) {
            var queryUrl = common.parseUrl(conf.restEndpoint + "/graph/operations/execute");
            $http.post(queryUrl, operation)
                .then(
                    function(response){
                        if(onSuccess) {
                            onSuccess(response.data)
                        }
                    },
                    function(err) {
                        if (onFailure) {
                            onFailure(err.data);
                        } else {
                            error.handle('Error running operation', err.data);
                        }
                    }
                );
        });
    }

    query.addOperation = function(operation) {
        operations.push(operation);
        events.broadcast('operationsUpdated', [operations])
    }

    query.setOperations = function(ops) {
        operations = ops;
        events.broadcast('operationsUpdated', [operations]);
    }


    if($routeParams.preQuery) {
        query.executeOperationJson($routeParams.preQuery);
        $location.search("preQuery", null);
    }

    return query;
}]);
