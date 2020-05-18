/*
 * Copyright 2018-2019 Crown Copyright
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

/**
 * Service for storing the previous operation chains.
 */
angular.module('app').factory('previousQueries', function() {
    var service = {};
    
    var queries = [];

    var currentChain = {
        chain: 0,
        operationIndex: 0
    };

    /**
     * Adds an object to the start of the previous queries. 
     * This is to give the impression that they are sorted by newest first.
     * 
     * The objects should come with 3 fields: 
     * - name: This may be made editable in future
     * - lastRun: The (hh:mm formatted) time that the query was run at. This should be local (not UTC) time.
     * - operation The operation chain model which was used to generate the query. 
     *  
     * @param {Object} query 
     */
    service.addQuery = function(query) {
        var newQuery = angular.copy(query);
        queries.unshift(newQuery);
    }

    /**
     * Returns all the queries currently held by the service.
     */
    service.getQueries = function() {
        return angular.copy(queries);
    }

    /**
     * Sets the model to the operations provided.
     * @param {Array} operations the new model
     */
    service.setQueries = function(operations) {
        queries = angular.copy(operations);
    }

    /**
     * Updates the specified query currently held by the service.
     * @param {Integer} chain the operation chain being modified
     * @param {Integer} operation the operation being changed with the chain
     * @param {Object} updatedQuery the new name and description
     */
    service.updateQuery = function(chain, operationIndex, updatedQuery) {
        if (chain >= 0 && chain <= queries.length) {
            var query = queries[chain];
            if (operationIndex >= 0 && operationIndex <= query.operations.length) {
                var operationSelectedOperation = Object.assign({}, query.operations[operationIndex].selectedOperation);
                operationSelectedOperation.name = updatedQuery.name;
                operationSelectedOperation.description = updatedQuery.description;
                //query.operations[operationIndex] = {...query.operations[operationIndex], selectedOperation: operationSelectedOperation };
                query.operations[operationIndex] = Object.assign(query.operations[operationIndex], {selectedOperation: operationSelectedOperation});
            }
        }
    }

    /**
     * Saves the current edit position in My Queries.
     * @param {Integer} the operation chain being edited.
     * @param {Integer} the operation being edited.
     */
    service.setCurrentChain = function(chain, operationIndex) {
       currentChain.chain = chain;
       currentChain.operationIndex = operationIndex;
    }

    /**
     * Returns the current edit position in My Queries.
     */
    service.getCurrentChain = function() {
        return currentChain;
    }

    return service;
});
