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

angular.module('app').component('directedPicker', directedPicker());

function directedPicker() {
    return {
        templateUrl: 'app/query/directed-picker/directed-picker.html',
        controller: DirectedPickerController,
        controllerAs: 'ctrl',
        bindings: {
            model: '='
        }
    }
}

function DirectedPickerController() {
    var vm = this;

    var allowedValues = ["EITHER", "DIRECTED", "UNDIRECTED"];

    vm.$onInit = function() {
        if (vm.model === undefined) {
            throw 'Directed picker must be initialised with a model';
        }

        if (vm.model === null) {
            vm.model = "EITHER";
        }

        for (var i in allowedValues) {
            if (vm.model === allowedValues[i]) {
                return;
            }
        }

        throw 'Model must be one of: "EITHER", "DIRECTED", "UNDIRECTED" or null but was: ' + JSON.stringify(vm.model);
    }
}
