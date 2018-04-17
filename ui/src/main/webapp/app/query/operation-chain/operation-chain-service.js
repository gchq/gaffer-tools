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

    // operations in chain
    var operations = [];

    // tmp operation when creating new operations
    var tmpOperation = undefined;

    // index of operation being currently edited
    var currentIndex = 0;

    /**
     * Returns the operations in the current chain
     */
    service.getOperationChain = function() {
        return operations;
    }

    /**
     * Adds an operation to the current operation chain
     */
    service.add = function(operation) {
        operations.push(operation);
        currentIndex++;
    }

    /**
     * Stores an operation in a variable
     */
    service.cache = function(operation) {
        tmpOperation = operation;
    }

    /**
     * Gets an operation stored in a cache
     */
    service.getCached = function() {
        return tmpOperation
    }

    /**
     * Gets clone of an operation stored at a given vertex. Will not change current index.
     */
    service.getCloneOf = function(index) {
        return angular.copy(operations[index]);
    }

    /**
     * Gets the operation stored at the given index
     * @param {number} index 
     */
    service.getOperationAt = function(index) {
        currentIndex = index;
        return operations[index];
    } 

    /**
     * Gets the current index (ie the index of the current operation in an operation chain)
     */
    service.getCurrentIndex = function() {
        return currentIndex;
    }

    /**
     * Sets the current index to the one in front of the final operation 
     * (ie to where it should be when creating a new operation)
     */
    service.createNewOperation = function() {
        currentIndex = operations.length;
    }

    /**
     * Updates an operation at the specified index
     * @param {object} operation 
     * @param {number} index 
     */
    service.update = function(operation, index) {
        operations.splice(index, 1, operation)
    }

    /**
     * Removes an operation at the specified index from the operation chain
     * @param {number} index 
     */
    service.remove = function(index) {
        operations.splice(index, 1);
        if (currentIndex > index) {
            currentIndex--;
        }
    }

    service.reset = function() {
        operations = [];
        tmpOperation = undefined;
        currentIndex = 0;
    }


    return service;

});