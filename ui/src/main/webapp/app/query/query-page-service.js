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

angular.module('app').factory('queryPage', ['settings', 'events', function(settings, events) {
    var service = {}
    var selectedOperation;
    var inOutFlag = 'EITHER';
    var opOptions;
    var chainOperations = []
    var currentIndex = 0;

    /**
     * Returns the operations in the current chain
     */
    service.getOperationChain = function() {
        return chainOperations;
    }

    /**
     * Adds an operation to the current operation chain
     */
    service.addToOperationChain = function(operation) {
        chainOperations.push(operation);
        currentIndex++;
    }

    /**
     * Gets the current index (ie the index of the current operation in an operation chain)
     */
    service.getCurrentIndex = function() {
        return currentIndex;
    }

    // /**
    //  * Updates an operation at the specified index
    //  * @param {object} operation 
    //  * @param {number} index 
    //  */
    // service.updateOperationInChain = function(operation, index) {
    //     chainOperations.splice(index, 1, operation)
    // }

    // /**
    //  * Removes an operation at the specified index from the operation chain
    //  * @param {number} index 
    //  */
    // service.removeFromChainOperations = function(index) {
    //     chainOperations.splice(index, 1);
    // }

    service.getSelectedOperation = function() {
        return selectedOperation;
    }

    service.setSelectedOperation = function(op) {
        selectedOperation = op;
    }

    service.getInOutFlag = function() {
        return inOutFlag;
    }

    service.setInOutFlag = function(flag) {
        inOutFlag = flag;
    }

    service.getOpOptions = function() {
        return opOptions;
    }

    service.setOpOptions = function(newOpOptions) {
        opOptions = newOpOptions;
    }

    service.reset = function() {
        selectedOperation = undefined;
        inOutFlag = 'EITHER';
        opOptions = angular.copy(settings.getDefaultOpOptions());
        chainOperations = [];
        currentIndex = 0;
    }

    return service;
}]);
