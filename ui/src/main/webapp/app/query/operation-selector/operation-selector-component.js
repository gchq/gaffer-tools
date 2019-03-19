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

function OperationSelectorController(operationService, $routeParams, $filter) {
    var vm = this;

    vm.showCustomOp = false;

    vm.selectedText = function() {
        if(vm.model) {
            return vm.model.name;
        }
        return "Search for an operation...";
    }
}
