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

export class QueryService {

    query = {};
    operations = [];

    /**
     * Alerts the user if they hit the result limit
     * @param {Array} data The data returned by the Gaffer REST service
     */
    private showTooManyResultsPrompt = function(data, onSuccess) {
        this.$mdDialog.show({
            template: '<result-count-warning aria-label="Result Count Warning"></result-count-warning>',
            parent: angular.element(document.body),
            clickOutsideToClose: false
        })
        .then(function(command) {
            if(command === 'results') {
                this.results.update(data);
                if(onSuccess) {
                    onSuccess(data);
                }
            }
        });
    }

    getOperations = function() {
        return this.operations;
    }

    /**
     * Executes a query. If too many results are returned a dialog is shown
     * to ask the user if they would like to view the results or amend their
     * query. On success, the result service is called to update the results.
     * @param {Object} The operation chain to execute. It can either be an object or a json string.
     */
    executeQuery = function(operation, onSuccess, onFailure) {
        this.query.execute(
            operation,
            function(data) {
                this.loading.finish()
                if (data.length >= this.settings.getResultLimit()) {
                    this.showTooManyResultsPrompt(data.slice(0, settings.getResultLimit()), onSuccess);
                } else {
                   this.results.update(data);
                   if(onSuccess) {
                       onSuccess(data);
                   }
                }
            },
            function(err) {
                this.loading.finish();
                this.error.handle('Error executing operation', err);
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
    execute = function(operation, onSuccess, onFailure) {
        if(typeof operation !== 'string' && !(operation instanceof String)) {
            operation = JSON.stringify(operation);
        }
        this.config.get().then(function(conf) {
            var queryUrl = this.common.parseUrl(conf.restEndpoint + "/graph/operations/execute");
            this.$http.post(queryUrl, operation)
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
                            this.error.handle('Error running operation', err.data);
                        }
                    }
                );
        });
    }

    addOperation = function(operation) {
        this.operations.push(operation);
        this.events.broadcast('operationsUpdated', [operations])
    }

    setOperations = function(ops) {
        this.operations = ops;
        this.events.broadcast('operationsUpdated', [operations]);
    }
};
