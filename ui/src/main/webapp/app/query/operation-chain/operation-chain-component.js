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
        }
    }
}

function OperationChainController(queryPage, view, dateRange, events) {
    var vm = this;
    
    /**
     * Index to remove
     * @param {number} index 
     */
    vm.deleteOperation = function(index) {
        queryPage.removeFromOperationChain(index);
    }

    /**
     * Sets up the services so that we can edit an existing operation
     * @param {number} index 
     */
    vm.editOperation = function(index) {
        var operation = queryPage.getCloneOf(index);
        if (operation === undefined) {
            return;
        }
        queryPage.setSelectedOperation(operation.selectedOperation);
        view.setViewEdges(operation.view.viewEdges);
        view.setViewEntities(operation.view.viewEntities);
        view.setEdgeFilters(operation.view.edgeFilters);
        view.setEntityFilters(operation.view.entityFilters);
        view.setNamedViews(operation.view.namedViews);
        queryPage.setInOutFlag(operation.inOutFlag);
        queryPage.setOpOptions(operation.opOptions);
        dateRange.setStartDate(operation.startDate);
        dateRange.setEndDate(operation.endDate);

        events.broadcast("onOperationUpdate", [operation]);
    }
}