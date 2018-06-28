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

        vm.param = {};
        vm.param.parts={};
        vm.param.valueClass = vm.details.className;
        vm.param.required = vm.details.required;

        if(vm.model.fields[vm.name] === null || vm.model.fields[vm.name] === undefined) {
            vm.model.fields[vm.name] = vm.param;
        }

        // TODO: these should be removed when the REST API has been updated to return them.

        if(vm.name === "directedType") {
            vm.details.options=["EITHER", "DIRECTED", "UNDIRECTED"];
        }

        if(vm.name === "includeIncomingOutGoing") {
            vm.details.options=["EITHER", "INCOMING", "OUTGOING"];
        }

        if(vm.name === "useMatchedVertex") {
            vm.details.options=["OPPOSITE", "IGNORE", "EQUAL"];
        }

        if(vm.name === "edgeVertices") {
            vm.details.options=["NONE", "SOURCE", "DESTINATION", "BOTH"];
        }
    }
}
