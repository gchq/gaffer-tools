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

angular.module('app').factory('operationChain', ['common', 'settings', 'events', function(common, settings, events) {

    var service = {};

    var EVENT_NAME = 'onOperationUpdate';

    service.createBlankOperation = function(inputFlag, previous) {
        return {
            selectedOperation: null,
            expanded: true,
            fields: {
                view: {
                    viewEdges: [],
                    edgeFilters: {},
                    viewEntities: [],
                    entityFilters: {},
                    namedViews: [],
                    summarise: true
                },
                input: inputFlag ? [] : null,
                inputPairs: inputFlag ? [] : null,
                inputB: [],
                options: null
            },
            dates: {
                startDate: null,
                endDate: null
            },
            previous: previous
        }
    }

    // operations in chain
    var operations = [service.createBlankOperation(true)];

    /**
     * Returns the operations in the current chain
     */
    service.getOperationChain = function() {
        return operations;
    }

    service.setOperationChain = function(chain) {
        operations = chain;
    }

    service.addInput = function(seed) {
        if (typeof seed === 'object') {
            if (!common.arrayContainsObject(operations[0].fields.input, seed)) {
                operations[0].fields.input.push(seed);
                events.broadcast(EVENT_NAME, []);
            }
        } else if (!common.arrayContainsValue(operations[0].fields.input, seed)) {
            operations[0].fields.input.push(seed);
            events.broadcast(EVENT_NAME, []);
        }
    }

    service.removeInput = function(seed) {
        var newInput = operations[0].fields.input.filter(function(vertex) {
            return !angular.equals(seed, vertex);
        });
        if(newInput.length < operations[0].fields.input.length) {
            operations[0].fields.input = newInput;
            events.broadcast(EVENT_NAME, []);
        }
    }

    /**
     * Adds a new operation to the current operation chain
     */
    service.add = function(inputFlag) {
        var lastOp = operations[operations.length -1];
        operations.push(service.createBlankOperation(inputFlag, lastOp));
    }

    /**
     * Removes an operation at the specified index from the operation chain
     * @param {number} index
     */
    service.remove = function(index) {
        operations.splice(index, 1);
    }

    service.reset = function() {
        operations = [service.createBlankOperation(true)];
    }

    return service;

}]);
