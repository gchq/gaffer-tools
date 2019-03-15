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

angular.module('app').component('operationField', operationField());

function operationField() {
    return {
        templateUrl: 'app/query/operation-field.html',
        controller: OperationFieldComponent,
        controllerAs: 'ctrl',
        bindings: {
            details: '<',
            model: '='
        }
    }
}

function OperationFieldComponent(common) {
    var vm = this;

    vm.$onInit = function() {
        if (vm.details === null || vm.details === undefined) {
            throw 'Expected details binding';
        }

        if (vm.model === null || vm.model === undefined) {
            throw 'Expected model binding for: ' + vm.details.name;
        }

        vm.name = vm.details.name;
        if(vm.name === null) {
            vm.name = '';
        }
        vm.title = common.toTitle(vm.name);

        if(vm.model.fields[vm.name] === null || vm.model.fields[vm.name] === undefined) {
            vm.param = {
                parts: {},
                valueClass: vm.details.className,
                required: vm.details.required,
                description: vm.details.summary
            };
            vm.model.fields[vm.name] = vm.param;
        } else {
            vm.param = vm.model.fields[vm.name];
        }
    }
}
