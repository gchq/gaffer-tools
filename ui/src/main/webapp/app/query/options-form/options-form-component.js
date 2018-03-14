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
        controllerAs: 'ctrl'
    }
}

function OptionsFormController(queryPage, settings) {
    var vm = this;

    var updateOpOptionsArray = function() {
        vm.opOptions = queryPage.getOpOptions();
        vm.opOptionsArray = [];
        for (var k in vm.opOptions) {
            var kv = {"key":k, "value":vm.opOptions[k]};
            vm.opOptionsArray.push(kv);
        }
    }

    var updateOpOptions = function() {
        var newOpOptions = {};
        for (var i in vm.opOptionsArray) {
            if(vm.opOptionsArray[i].key) {
                newOpOptions[vm.opOptionsArray[i].key] = vm.opOptionsArray[i].value;
            }
        }
        vm.opOptions = newOpOptions
        queryPage.setOpOptions(vm.opOptions);
    }

    vm.opOptionKeys = {};
    vm.opOptions = {};
    vm.opOptionsArray = [];

    vm.updateOpOptions = function() {
        updateOpOptions();
    }

    vm.addOperationOption = function() {
        vm.opOptionsArray.push({'key': '', 'value': ''});
    }

    vm.deleteOption = function(opOption) {
        delete vm.opOptions[opOption.key];
        var i = vm.opOptionsArray.indexOf(opOption);
        if(i > -1) {
            vm.opOptionsArray.splice(i, 1);
        }
    }

    vm.getOpOptionKeys = function(opOption) {
        var keys = {};
        for(var k in vm.opOptionKeys) {
            if(vm.opOptionKeys[k] === opOption.key || !(vm.opOptionKeys[k] in vm.opOptions)) {
                keys[k] = vm.opOptionKeys[k];
            }
        }
        return keys;
    }

    vm.hasMoreOpOptions = function() {
        return vm.opOptionsArray.length < Object.keys(vm.opOptionKeys).length;
    }

    vm.$onInit = function() {
        settings.getOpOptionKeys().then(function(keys) {
            vm.opOptionKeys = keys;
        });

        if(!queryPage.getOpOptions() || Object.keys(queryPage.getOpOptions()).length === 0) {
            queryPage.setOpOptions(settings.getDefaultOpOptions());
        }

        updateOpOptionsArray();
    }
}
