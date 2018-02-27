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

angular.module('app').component('settingsView', settingsView())

function settingsView() {

    return {
        templateUrl: 'app/settings/settings.html',
        controller: SettingsController,
        controllerAs: 'ctrl'
    }
}

function SettingsController(settings, schema, operationService, results) {
    var vm = this;

    vm.resultLimit = settings.getResultLimit()
    vm.opOptionKeys = {};
    vm.defaultOpOptions = {};
    vm.defaultOpOptionsArray = [];


    var updateDefaultOpOptionsArray = function() {
        vm.defaultOpOptions = settings.getDefaultOpOptions();
        vm.defaultOpOptionsArray = [];
        for (var k in vm.defaultOpOptions) {
            var kv = {"key":k, "value":vm.defaultOpOptions[k]};
            vm.defaultOpOptionsArray.push(kv);
        }
    }

    var updateDefaultOpOptions = function() {
        var newDefaultOpOptions = {};
        for (var i in vm.defaultOpOptionsArray) {
            if(vm.defaultOpOptionsArray[i].key) {
                newDefaultOpOptions[vm.defaultOpOptionsArray[i].key] = vm.defaultOpOptionsArray[i].value;
            }
        }
        vm.defaultOpOptions = newDefaultOpOptions
        settings.setDefaultOpOptions(vm.defaultOpOptions);
    }

    vm.updateResultLimit = function() {
        settings.setResultLimit(vm.resultLimit);
    }

    vm.updateDefaultOpOptions = function() {
        settings.setDefaultOpOptions(vm.defaultOpOptions);
    }

    vm.updateDefaultOpOptions = function() {
        updateDefaultOpOptions();
    }

    vm.addDefaultOperationOption = function() {
        vm.defaultOpOptionsArray.push({'key': '', 'value': ''});
    }

    vm.deleteOption = function(opOption) {
        delete vm.defaultOpOptions[opOption.key];
        var i = vm.defaultOpOptionsArray.indexOf(opOption);
        if(i > -1) {
            vm.defaultOpOptionsArray.splice(i, 1);
        }
    }

    vm.getOpOptionKeys = function(opOption) {
        var keys = {};
        for(var k in vm.opOptionKeys) {
            if(vm.opOptionKeys[k] === opOption.key || !(vm.opOptionKeys[k] in vm.defaultOpOptions)) {
                keys[k] = vm.opOptionKeys[k];
            }
        }
        return keys;
    }

    vm.hasOpOptions = function() {
        return vm.opOptionKeys && Object.keys(vm.opOptionKeys).length > 0;
    }

    vm.hasMoreOpOptions = function() {
        return vm.defaultOpOptionsArray.length < Object.keys(vm.opOptionKeys).length;
    }

    vm.updateSchema = function() {
        schema.update();
        operationService.reloadNamedOperations(false);
    }

    vm.$onInit = function() {
        settings.getOpOptionKeys().then(function(keys) {
            vm.opOptionKeys = keys;
        });

        updateDefaultOpOptionsArray();
    }
}
