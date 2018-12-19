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

angular.module('app').component('optionsForm', optionsForm())

function optionsForm() {
    return {
        templateUrl: 'app/query/options-form/options-form.html',
        controller: OptionsFormController,
        controllerAs: 'ctrl',
        bindings: {
            model: '='  // a model to bind to
        }
    }
}

function OptionsFormController(settings) {
    var vm = this;
    vm.opOptionKeys = {};
    vm.opOptionsArray = [];

    var updateOpOptionsArray = function() {
        vm.opOptionsArray = [];
        for (var k in vm.model) {
            var kv = {"key":k, "value":vm.model[k]};
            vm.opOptionsArray.push(kv);
        }
    }

    vm.updateOpOptions = function() {
        var newOpOptions = {};
        for (var i in vm.opOptionsArray) {
            if(vm.opOptionsArray[i].key) {
                newOpOptions[vm.opOptionsArray[i].key] = vm.opOptionsArray[i].value;
            }
        }
        vm.model = newOpOptions
    }

    vm.addOperationOption = function() {
        vm.opOptionsArray.push({'key': '', 'value': ''});
    }

    vm.deleteOption = function(opOption) {
        delete vm.model[opOption.key];
        var i = vm.opOptionsArray.indexOf(opOption);
        if(i > -1) {
            vm.opOptionsArray.splice(i, 1);
        }
    }

    vm.getOpOptionKeys = function(opOption) {
        var keys = {};
        for(var k in vm.opOptionKeys) {
            if(vm.opOptionKeys[k] === opOption.key || !(vm.opOptionKeys[k] in vm.model)) {
                keys[k] = vm.opOptionKeys[k];
            }
        }
        return keys;
    }

    vm.hasMoreOpOptions = function() {
        return vm.opOptionsArray.length < Object.keys(vm.opOptionKeys).length;
    }

    vm.hasOpOptions = function() {
        return Object.keys(vm.opOptionKeys).length > 0;
    }

    vm.$onInit = function() {
        settings.getOpOptionKeys().then(function(keys) {
            vm.opOptionKeys = keys;
        });

        if (vm.model === null) {
            var defaultOperationOptions = angular.copy(settings.getDefaultOpOptions())
            if (Object.keys(defaultOperationOptions).length !== 0) {
                vm.model = defaultOperationOptions;
            }
        }

        updateOpOptionsArray();
    }
}
