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

var app = angular.module('app');

app.filter('operationFilter', function() {
    return function(operations, search) {
        if(!operations) {
            return operations;
        }
        if (!search) {
            return operations;
        }

        var formattedSearch = search ? search.toLowerCase().replace(/\s+/g, '') : '';
        var searchWords = search.toLowerCase().split(" ");

        // Return the matches that have the words in the same order as the search query first.
        var results = [];
        var otherResults = [];

        angular.forEach(operations, function(operation) {
            if((operation.formattedName.indexOf(formattedSearch) > -1)
             || (operation.formattedDescription.indexOf(formattedSearch) > -1)) {
                results.push(operation);
            } else {
                var hasAllWords = true;
                angular.forEach(searchWords, function(word) {
                     if((operation.formattedName.indexOf(word) == -1)
                        && (operation.formattedDescription.indexOf(word) == -1)) {
                         hasAllWords = false;
                         return;
                     }
                });
                if(hasAllWords) {
                   otherResults.push(operation);
                }
            }
        });

        angular.forEach(otherResults, function(result) {
            results.push(result);
        });

        return results;
    }
});

app.component('operationSelector', operationSelector());

function operationSelector() {
    return {
        templateUrl: 'app/query/operation-selector/operation-selector.html',
        controller: OperationSelectorController,
        controllerAs: 'ctrl',
        bindings: {
            model: '=',
            previous: '<'
        }
    }
}

function OperationSelectorController(operationService, operationSelectorService, $mdDialog, $routeParams, $window, $timeout) {
    var vm = this;

    var defaultOperation = "uk.gov.gchq.gaffer.operation.impl.get.GetElements";
    vm.availableNamedOperations;
    vm.availableOperations;
    vm.searchTerm = '';
    vm.showCustomOp = false;
    vm.placeholder = "Select an operation";

    angular.element(document).find('.search-box').on('keydown', function(ev) {
        ev.stopPropagation();
    });

    var updateView = function(op) {
        vm.model = op.selectedOperation;
    }

    var populateOperations = function(availableOperations) {
        vm.availableOperations = [];

        for(var i in availableOperations) {
            var operation = availableOperations[i];

            if(!vm.previous || !vm.previous.selectedOperation || !vm.previous.selectedOperation.next || vm.previous.selectedOperation.next.indexOf(operation.class) > -1) {
                operation.formattedName = operation.name !== undefined ? operation.name.toLowerCase().replace(/[\W_]+/g, '') : '';
                operation.formattedDescription = operation.description !== undefined ? operation.description.toLowerCase().replace(/\s+/g, '') : '';

                if(operation.formattedName === "getelements") {
                    vm.placeholder = "Select an operation (e.g Get Elements)";
                }
                vm.availableOperations.push(operation);
            }
        }

        vm.availableOperations.sort(function(a,b) {
            if(a.namedOp && !b.nameOp) {
                return 1;
            }
            if(!a.namedOp && b.nameOp) {
                return -1;
            }
            if(a.formattedName > b.formattedName) {
                return 1;
            }
            if(a.formattedName < b.formattedName) {
                return -1;
            }
            if(a.formattedDescription > b.formattedDescription) {
                return 1;
            }
            if(a.formattedDescription < b.formattedDescription) {
                return -1;
            }
            return 0
        });

        // allow 'op' to be used as a shorthand
        if($routeParams.op) {
            $routeParams.operation = $routeParams.op;
        }

        if($routeParams.operation) {
            var opParam = $routeParams.operation.replace(/[\W_]+/g, "").toLowerCase();
            for(var i in vm.availableOperations) {
                if(vm.availableOperations[i].name.replace(/[\W_]+/g, "").toLowerCase() === opParam) {
                    vm.model = vm.availableOperations[i];
                    break;
                }
            }
        }
    }

    vm.$onInit = function() {
        operationSelectorService.shouldLoadNamedOperationsOnStartup().then(function(yes) {
            if (yes) {
                vm.reloadOperations();
            } else {
                operationService.getAvailableOperations().then(populateOperations);
            }
        });
    }

    vm.clearSearchTerm = function() {
        vm.searchTerm = '';
    };

    vm.reloadOperations = function() {
        operationService.reloadOperations(true).then(populateOperations);
    }

    vm.namedOpsDisabled = function() {
        return true;
    }

    vm.selectedText = function() {
        if(vm.model) {
            return vm.model.name;
        }
        return "Select operation...";
    }
}
