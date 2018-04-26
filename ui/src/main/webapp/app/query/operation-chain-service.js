/*
 * Copyright 2017-2018 Crown Copyright
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

angular.module('app').factory('operationChain', function() {
    var service = {};

    var createBlankOperation = function(inputFlag) {
        return {
            selectedOperation: null,
            view: {
                viewEdges: [],
                edgeFilters: {},
                viewEntities: [],
                entityFilters: {},
                namedViews: []
            },
            inputs: {
                input: inputFlag ? [] : null,
                inputPairs: inputFlag ? [] : null,
                inputB: []
            },
            edgeDirection: "EITHER",
            dates: {
                startDate: null,
                endDate: null
            },
            opOptions: {}
        }
    }

    // operations in chain
    var operations = [createBlankOperation(true)];

    /**
     * Returns the operations in the current chain
     */
    service.getOperationChain = function() {
        return operations;
    }

    service.setOperationChain = function(chain) {
        operations = chain;
    }

    /**
     * Adds a new operation to the current operation chain
     */
    service.add = function(inputFlag) {
        operations.push(createBlankOperation(inputFlag));
    }

    /**
     * Removes an operation at the specified index from the operation chain
     * @param {number} index 
     */
    service.remove = function(index) {
        operations.splice(index, 1);
    }

    service.reset = function() {
        operations = [createBlankOperation(true)];
    }

    return service;

});