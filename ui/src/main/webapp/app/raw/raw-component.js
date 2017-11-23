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

'use strict'

angular.module('app').component('raw', raw())

function raw() {

    return {
        templateUrl: 'app/raw/raw.html',
        controller: RawController,
        controllerAs: 'ctrl'
    }
}

function RawController(operationService, results, query, $mdToast, events) {
    var vm = this

    // variables
    vm.operationsForEdit = []
    vm.editingOperations = false
    vm.operations = query.getOperations()
    vm.results = results.get()

    // watches

    events.subscribe('operationsUpdated', function(operations) {
        vm.operations = operations
    })

    events.subscribe('resultsUpdated', function(results) {
        vm.results = results
    })

    // functions

    vm.editOperations = function() {
        vm.operationsForEdit = []

        for(var i in vm.operations) {
            vm.operationsForEdit.push(JSON.stringify(vm.operations[i], null, 2));
        }
        vm.editingOperations = true;
    }

    vm.addOperation = function() {
        vm.operationsForEdit.push("")
    }

    vm.saveOperations = function() {
        query.setOperations([])
        for(var i in vm.operationsForEdit) {
            try {
                if (vm.operationsForEdit[i] !== "") {
                    query.addOperation(JSON.parse(vm.operationsForEdit[i]));
                }
            } catch(e) {
                $mdToast.show($mdToast.simple()
                    .textContent('Invalid json for operation ' + (+i + 1))
                    .position('bottom right'))
                console.log('Invalid json: ' + vm.operationsForEdit[i]);
                return;
            }
        }
        vm.editingOperations = false;
    }
}
