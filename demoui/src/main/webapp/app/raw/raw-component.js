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

angular.module('app').component('raw', raw())

function raw() {

    return {
        templateUrl: 'app/raw/raw.html',
        controller: RawController,
        controllerAs: 'ctrl'
    }
}

function RawController(results, query, error, events, schema) {
    var vm = this

    vm.operationsForEdit = [];
    vm.editingOperations = false;
    vm.operations = query.getOperations();
    vm.results = results.get();

    vm.schema = {edges:{}, entities:{}, types: {}};
    vm.$onInit = function() {
        schema.get().then(function(gafferSchema) {
            vm.schema = gafferSchema;
        },
        function(err) {
            vm.schema = {edges: {}, entities: {}, types: {}};
        });
    }

    var currentTab

    events.subscribe('operationsUpdated', function(operations) {
        vm.operations = operations
    })

    events.subscribe('resultsUpdated', function(results) {
        vm.results = results
    })

    vm.setCurrentTab = function(tab) {
        currentTab = tab;
    }

    vm.isEditingOperations = function() {
        return vm.editingOperations && currentTab === 'query'
    }

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
                error.handle('Invalid json for operation ' + (+i + 1), e);
                return;
            }
        }
        vm.editingOperations = false;
    }

    vm.clearAllOperations = function() {
        vm.operationsForEdit = [];
        query.setOperations([]);
    }
}
