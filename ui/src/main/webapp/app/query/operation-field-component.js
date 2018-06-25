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

function OperationFieldComponent(types, common) {
    var vm = this;

    vm.$onInit = function() {
        console.log(vm.details);
        console.log(vm.model);

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
        console.log(vm.title);


        vm.param = {};
        vm.param.parts={};
        vm.param.valueClass = vm.details.className;
        vm.param.required = vm.details.required;

        if(vm.model.fields[vm.name] === null || vm.model.fields[vm.name] === undefined) {
            vm.model.fields[vm.name] = vm.param;
        }

        if(vm.name === "directedType") {
            vm.details.options=["EITHER", "DIRECTED", "UNDIRECTED"];
        }
    }
}
