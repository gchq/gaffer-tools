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

angular.module('app').component('seedManager', seedManager());

function seedManager() {
    return {
        templateUrl: 'app/query/seed-manager/seed-manager.html',
        controller: SeedManagerController,
        controllerAs: 'ctrl',
        bindings: {
            secondaryInput: '<'
        }
    }
}

/**
 * Controller for the SeedManager
 * @param {*} graph The Graph service for selecting all seeds
 * @param {*} input The input service for injecting getters and setters into child components
 */
function SeedManagerController(graph, input) {
    var vm = this;

    /** 
     * Selects all seeds on the graph which in turn triggers an update event - causing the query input to be updated
    */
    vm.selectAllSeeds = function() {
        graph.selectAllNodes();
    }

    vm.primaryEvent = 'queryInputUpdate';
    vm.secondaryEvent = 'secondaryInputUpdate';
    vm.getPrimary = input.getInput;
    vm.setPrimary = input.setInput;
    vm.getSecondary = input.getInputB;
    vm.setSecondary = input.setInputB;
}