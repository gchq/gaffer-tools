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

angular.module('app').component('singleParameter', singleParameter());

function singleParameter() {
    return {
        templateUrl: 'app/query/parameter-form/single-parameter.html',
        controller: SingleParameterController,
        controllerAs: 'ctrl',
        bindings: {
            param: '=',
            label: '='
        }
    }
}

function SingleParameterController(types) {
    var vm = this;

    vm.$onInit = function() {
        if (vm.param === null || vm.param === undefined) {
            console.error('Expected defined, non-null value for parameter. Got ' + vm.param);
        } else {
            if(!vm.param['parts']) {
                vm.param['parts']={};
            }
        }
        if(vm.label === null || vm.label === undefined) {
            vm.label = '';
        }
    }

    vm.isRequired = function(field) {
        return vm.param.required === true && field.required === true;
    }

    vm.getFields = function() {
        return types.getFields(vm.param.valueClass);
    }
}