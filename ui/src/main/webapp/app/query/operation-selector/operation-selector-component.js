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
        // Matches in the title are prioritised over matches in other areas like the description.
        // Full exact matches are prioritised over matches of individual words.
        var titleResults = [];
        var otherResults = [];
        var titleWordResults = [];
        var otherWordResults = [];

        angular.forEach(operations, function(operation) {
            if(operation.formattedName.indexOf(formattedSearch) > -1) {
                titleResults.push(operation);
            } else if(operation.formattedDescription.indexOf(formattedSearch) > -1) {
                otherResults.push(operation);
            } else {
                var hasAllWordsInTitle = true;
                var hasAllWords = true;
                angular.forEach(searchWords, function(word) {
                     if(operation.formattedName.indexOf(word) == -1) {
                        hasAllWordsInTitle = false;
                        if(operation.formattedDescription.indexOf(word) == -1) {
                            hasAllWords = false;
                            return;
                        }
                     }
                });
                if(hasAllWordsInTitle) {
                    titleWordResults.push(operation);
                } else if(hasAllWords) {
                   otherWordResults.push(operation);
                }
            }
        });

        var results = [];
        angular.forEach(titleResults, function(result) {
            results.push(result);
        });
        angular.forEach(titleWordResults, function(result) {
            results.push(result);
        });
        angular.forEach(otherResults, function(result) {
            results.push(result);
        });
        angular.forEach(otherWordResults, function(result) {
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

function OperationSelectorController(operationService, $routeParams, $filter) {
    var vm = this;

    vm.availableOperations;
    vm.searchTerm = '';
    vm.showCustomOp = false;
    vm.placeholder = "Search for an operation";

    var populateOperations = function(availableOperations) {
        vm.availableOperations = [];

        for(var i in availableOperations) {
            var operation = availableOperations[i];

            if(!vm.previous || !vm.previous.selectedOperation || !vm.previous.selectedOperation.next || vm.previous.selectedOperation.next.indexOf(operation.class) > -1) {
                operation.formattedName = operation.name !== undefined ? operation.name.toLowerCase().replace(/\s+/g, '') : '';
                operation.formattedDescription = operation.description !== undefined ? operation.description.toLowerCase().replace(/\s+/g, '') : '';

                if(operation.formattedName === "getelements") {
                    vm.placeholder = "Search for an operation (e.g Get Elements)";
                }
                vm.availableOperations.push(operation);
            }
        }

        vm.availableOperations.sort(function(a,b) {
            if(a.namedOp && !b.namedOp) {
                return -1;
            }
            if(!a.namedOp && b.namedOp) {
                return 1;
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

    vm.getOperations = function() {
        return operationService.getAvailableOperations(true).then(function(ops) {
            populateOperations(ops)
            return $filter('operationFilter')(vm.availableOperations, vm.searchTerm);
        });
    }

    vm.clearSearchTerm = function() {
        vm.searchTerm = '';
    };

    vm.reloadOperations = function() {
        operationService.reloadOperations(true).then(populateOperations);
    }

    vm.selectedText = function() {
        if(vm.model) {
            return vm.model.name;
        }
        return "Search for an operation...";
    }
}
