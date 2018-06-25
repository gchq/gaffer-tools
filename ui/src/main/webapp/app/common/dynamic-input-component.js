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

angular.module('app').component('dynamicInput', dynamicInput());

function dynamicInput() {
    return {
        templateUrl: 'app/common/dynamic-input.html',
        controller: DynamicInputController,
        controllerAs: 'ctrl',
        bindings: {
            param: '=',
            name: '<',
            options: '<'
        }
    }
}

function DynamicInputController(types) {
    var vm = this;

    vm.$onInit = function() {
        if (vm.param === null || vm.param === undefined) {
            throw 'Expected defined, non-null value for the type. Got ' + vm.type;
        }

        if(!vm.param['parts']) {
            vm.param['parts']={};
        }

        if (!vm.name) {
            vm.name = '';
        }
    }

    vm.getFlexValue = function() {
        var length = types.getFields(vm.param.valueClass).length;

        if (length >= 3) {
            return 33;
        } else if (length === 2) {
            return 50;
        } else {
            return 100
        }
    }

    vm.isRequired = function(field) {
        return vm.param.required === true && field.required === true;
    }

    vm.getFields = function() {
        return types.getFields(vm.param.valueClass);
    }
}
