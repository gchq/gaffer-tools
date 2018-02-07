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

'use strict';

angular.module('app').factory('query', ['$http', 'config', 'events', 'common', function($http, config, events, common) {

    var query = {};

    var operations = [];

    query.getOperations = function() {
        return operations;
    }

    query.execute = function(operationChain, onSuccess, onFailure) {

        config.get().then(function(conf) {
            var queryUrl = conf.restEndpoint + "/graph/operations/execute";

            queryUrl = common.parseUrl(queryUrl);

            $http.post(queryUrl, operationChain)
                .success(function(results){
                    onSuccess(results)
                })
                .error(function(err) {
                    if (onFailure) {
                        onFailure(err);
                    } else {
                        var errorString = 'Error executing operation';
                        if (err && err !== "") {
                            console.log(err);
                            var msg;
                            if(typeof err === 'string' || err instanceof String) {
                                msg = err;
                            } else {
                                msg = err.simpleMessage;
                                if(!msg) {
                                    msg = err.message;
                                }
                            }
                            alert(errorString + ": " + msg);
                        } else {
                            alert(errorString);
                        }
                    }
            });

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

    return query;
}]);