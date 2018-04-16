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
        controllerAs: 'ctrl'
    }
}

function DirectionalityPickerController(edgeDirection, events) {
    var vm = this;
    vm.inOutFlag = edgeDirection.getDirection();
    var eventName = "onEdgeDirectionUpdate";

    var updateView = function(direction) {
        vm.inOutFlag = direction;
    }

    vm.$onInit = function() {
        events.subscribe(eventName, updateView);
    }

    vm.$onDestroy = function() {
        events.subscribe(eventName, updateView);
    }

    vm.onInOutFlagChange = function() {
        edgeDirection.setDirection(vm.inOutFlag);
    }
}
