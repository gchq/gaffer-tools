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

function OptionsController(operationOptions, config) {
    var vm = this;

    vm.$onInit = function() {
        if (!vm.model) {    // If the model is not yet defined, it must get the default from somewhere.
            if (!vm.master) { // If the component is not the master, it should look to the service first to check whether there is a default
                var currentDefaults = operationOptions.getDefaultConfiguration();
                if (currentDefaults) {
                    vm.model = currentDefaults;
                    return;
                }
            }
            // If the component is the master, or the defaults are not yet set by the user, the component looks to the config to get the default operation options 
            config.get().then(function(conf) {
                vm.model = conf.defaultOperationOptions;
            });
        }
    }

    vm.$onDestroy = function() {
        if (vm.master) {        // If master is being destroyed, for example when the user navigates away, the service is updated
            operationOptions.updateDefaultConfiguration(vm.model);
        }
    }

    vm.clearValue = function(index) {
        vm.model.visible[index].value = undefined;
    }

    vm.hideOption = function(index, option) {
        if (!vm.model.hidden) {
            vm.model.hidden = [];
        }
        vm.model.hidden.push(option);
        vm.model.visible.splice(index, 1);
    }
}