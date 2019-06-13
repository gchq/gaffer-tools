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

angular.module('app').component('parameterForm', parameterForm());

function parameterForm() {
    return {
        templateUrl: 'app/query/parameter-form/parameter-form.html',
        controller: ParameterFormController,
        controllerAs: 'ctrl',
        bindings: {
            title: '@',
            titleClass: '@',
            parameters: '='
        }
    }
}

function ParameterFormController(time) {
    var vm = this;
    vm.$onInit = function() {
        if (vm.parameters === null || vm.parameters === undefined) {
            throw 'Expected defined, non-null value for parameters. Got ' + vm.parameters;
        }
        if(!vm.title) {
            vm.title = 'Parameters';
        }
    }

    vm.getTimeUnit = function(parameterName) {
        var metaData = time.getTimeMetaData(parameterName)
        return metaData ? metaData.unit : undefined;
    }
}
