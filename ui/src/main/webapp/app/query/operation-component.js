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

angular.module('app').component('operation', operation());

function operation() {
    return {
        templateUrl: 'app/query/operation.html',
        controller: OperationController,
        controllerAs: 'ctrl',
        bindings: {
            model: '=',                 // an operation model
            timeConfig: '<',            // a time config common to each operation
            index: '<',                 // postion in the chain
            onExecute: '&',             // a function to execute when running the query
            onDelete: '&',              // a function to remove to operation from the chain
            onReset: '&',               // a function to call which resets the operation
            chainLength: '<'            // the length of the wider operation chain
        }
    }
}

function OperationController(loading) {
    var vm = this;
    var coreFields = ["view", "views", "input", "inputB", "options"];

    vm.$onInit = function() {

        if (!vm.model) {
            throw 'An operation has been created without a model to bind to'
        }
    }

    vm.getConfigFields = function() {
        var configFields = {};
        if(vm.model.selectedOperation) {
            var fields = vm.model.selectedOperation.fields
            for(var name in fields) {
                if(coreFields.indexOf(name) === -1) {
                    configFields[name] = fields[name];
                }
            }
        }
        return configFields;
    }

    vm.hasOtherConfig = function() {
        return Object.keys(vm.getConfigFields()).length > 0;
    }

    vm.getField = function(fieldName) {
        var field = vm.model.fields[fieldName];
        if(field === undefined) {
            field = {};
            vm.model.fields[fieldName] = field;
        }
        return field;
    }

    /**
     * Checks all subforms are valid and another operation is not in progress
     */
    vm.canExecute = function() {
        return vm.operationForm.$valid && vm.model.fields.input !== null && !loading.isLoading();
    }

    vm.isFirst = function() {
        return vm.index === 0;
    }

    vm.isStandalone = function() {
        return vm.chainLength === 1;
    }

    vm.isLast = function() {
        return vm.index === vm.chainLength - 1;
    }

    vm.toggleExpanded = function() {
        vm.model.expanded = !vm.model.expanded;
    }

    vm.execute = function() {
        vm.onExecute({op: vm.model});
    }

    vm.reset = function() {
        vm.onReset({index: vm.index});
    }

    vm.delete = function() {
        vm.onDelete({index: vm.index});
    }
}
