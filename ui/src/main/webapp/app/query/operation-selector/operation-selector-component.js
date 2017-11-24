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

angular.module('app').component('operationSelector', operationSelector());

function operationSelector() {
    return {
        templateUrl: 'app/query/operation-selector/operation-selector.html',
        controller: OperationSelectorController,
        controllerAs: 'ctrl'
    }
}

function OperationSelectorController(operationService, operationSelectorService, queryPage, $window) {
    var vm = this;

    vm.availableOperations;
    vm.selectedOp = [];
    vm.searchTerm = '';

    var populateTable = function(availableOperations) {
        vm.availableOperations = availableOperations
        var selected = queryPage.getSelectedOperation();
        if (selected)  {
            vm.selectedOp = [ selected ];
        }
    }

    operationSelectorService.shouldLoadNamedOperationsOnStartup().then(function(yes) {
        if (yes) {
            operationService.reloadNamedOperations().then(populateTable);
        } else {
            operationService.getAvailableOperations().then(populateTable);
        }
    });

    vm.onOperationSelect = function(op) {
        queryPage.setSelectedOperation(op);
    }

    vm.onOperationDeselect = function(unused) {
        if (vm.selectedOp.length === 0) {
            queryPage.setSelectedOperation({});
        }
    }
    vm.showOperations = function(operations) {
        var newWindow = $window.open('about:blank', '', '_blank');
        var prettyOps;
        try {
            prettyOps = JSON.stringify(JSON.parse(operations), null, 2);
        } catch(e) {
            prettyOps = operations;
        }
        newWindow.document.write("<pre>" + prettyOps + "</pre>");
    }

    vm.refreshNamedOperations = function() {
        operationService.reloadNamedOperations(true).then(function(availableOps) {
            vm.availableOperations = availableOps;
        });
    }




}