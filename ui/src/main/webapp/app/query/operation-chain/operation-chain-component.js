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

angular.module('app').component('operationChain', operationChain());

function operationChain() {
    return {
        templateUrl: 'app/query/operation-chain/operation-chain.html',
        controller: OperationChainController,
        controllerAs: 'ctrl',
        bindings: {
            operations: '<',
            onDelete: '&',
            onClick: '&',
            onCreate: '&'
        }
    }
}

function OperationChainController(queryPage) {
    var vm = this;

    /**
     * checks whether the index is the current index being edited
     */
    vm.isActive = function(index) {
        return index == queryPage.getCurrentIndex();
    }

    vm.isEditing = function() {
        return queryPage.getCurrentIndex() !== vm.operations.length
    }

    vm.createNew = function() {
        vm.onCreate();
    }
    
    /**
     * Index to remove
     * @param {number} index 
     */
    vm.delete = function(index) {
        vm.onDelete({id: index});
    }

    /**
     * Sets up the services so that we can edit an existing operation
     * @param {number} index 
     */
    vm.edit = function(index) {
        vm.onClick({id: index});
    }
}