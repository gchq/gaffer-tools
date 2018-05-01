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

angular.module('app').component('inputManager', inputManager());

function inputManager() {
    return {
        templateUrl: 'app/query/input-manager/input-manager.html',
        controller: InputManagerController,
        controllerAs: 'ctrl',
        bindings: {
            secondaryInput: '<',
            primaryInput: '<',
            model: '=',
            first: '<'
        }
    }
}

/**
 * Controller for the Input Manager
 * @param {*} graph The Graph service for selecting all seeds
 * @param {*} input The input service for injecting getters and setters into child components
 */
function InputManagerController(graph, events) {
    var vm = this;
    vm.usePreviousOutput;

    var updatePreviousOutputFlag = function() {
        vm.usePreviousOutput = (vm.model.input === null);
    }
    
    vm.$onInit = function() {
        updatePreviousOutputFlag(); // respond to 'onOperationUpdate' event here
        events.subscribe('onOperationUpdate', updatePreviousOutputFlag);
    }

    vm.$onDestroy = function() {
        events.unsubscribe('onOperationUpdate', updatePreviousOutputFlag);
    }

    vm.onCheckboxChange = function() {
        if (vm.usePreviousOutput) {
            vm.model.input = null;
            vm.model.inputPairs = null;
        } else {
            vm.model.input = [];
            vm.model.inputPairs = [];
        }
    }

    /** 
     * Selects all seeds on the graph which in turn triggers an update event - causing the query input to be updated
    */
    vm.selectAllSeeds = function() {
        graph.selectAllNodes();
    }
}