/*
 * Copyright 2018 Crown Copyright
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

angular.module('app').component('options', options());

function options() {
    return {
        templateUrl: 'app/options/options.html',
        controller: OptionsController,
        controllerAs: 'ctrl',
        bindings: {
            master: '<?',
            model: '=?'
        }
    }
}

function OptionsController(operationOptions, config, events) {
    var vm = this;

    vm.$onInit = function() {
        events.subscribe('onPreExecute', saveToService);
        if (!vm.model) {    // If the model is not yet defined, it must get the default from somewhere.
            var currentDefaults = operationOptions.getDefaultConfiguration();
            if (currentDefaults !== null) { // null implies not set.
                vm.model = currentDefaults;
                return;
            }
            // If the defaults are not yet set by the user, the component looks to the config to get the default operation options 
            config.get().then(function(conf) {
                vm.model = angular.copy(conf.defaultOperationOptions);
                if (vm.model) {
                    if (vm.model.visible === undefined) {
                        vm.model.visible = [];
                    } 
                    if (vm.model.hidden === undefined) {
                        vm.model.hidden = [];
                    }
                }
            });
        }
    }

    vm.$onDestroy = function() {
        events.unsubscribe('onPreExecute', saveToService);
        saveToService()
    }

    var saveToService = function() {
        if (vm.master) {        // If master is being destroyed, for example when the user navigates away, the service is updated
            operationOptions.setDefaultConfiguration(vm.model);
        }
    }

    vm.clearValue = function(index) {
        vm.model.visible[index].value = undefined;
    }

    vm.hideOption = function(index) {
        var optionCopy = angular.copy(vm.model.visible[index]);
        vm.model.hidden.push(optionCopy);
        vm.model.visible.splice(index, 1);
    }

    vm.addOption = function() {
        if (vm.selectedOption === undefined || vm.selectedOption === null) {
            return;
        }
        if (!vm.model.visible) {
            vm.model.visible = [];
        }

        vm.model.visible.push(angular.copy(vm.selectedOption));

        vm.model.hidden = vm.model.hidden.filter(function(hiddenOption) {
            if (hiddenOption.key !== vm.selectedOption.key) {
                return hiddenOption;
            }
        });

        vm.selectedOption = undefined;
        vm.search = "";
    }

}