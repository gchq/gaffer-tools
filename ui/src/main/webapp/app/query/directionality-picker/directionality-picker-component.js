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

angular.module('app').component('directionalityPicker', directionalityPicker());

function directionalityPicker() {
    return {
        templateUrl: 'app/query/directionality-picker/directionality-picker.html',
        controller: DirectionalityPickerController,
        controllerAs: 'ctrl',
        bindings: {
            model: '='
        }
    }
}

function DirectionalityPickerController() {
    var vm = this;

    var allowedValues = ["INCOMING", "OUTGOING", "EITHER"];
    
    vm.$onInit = function() {
        if (vm.model === undefined) {
            throw 'Directionality picker must be initialised with a model';
        }

        if (vm.model === null) {
            vm.model = "EITHER";
        }

        for (var i in allowedValues) {
            if (vm.model === allowedValues[i]) {
                return;
            }
        }

        throw 'Model must be one of: "EITHER", "OUTGOING", "INCOMING" or null but was: ' + JSON.stringify(vm.model);
    }
}
