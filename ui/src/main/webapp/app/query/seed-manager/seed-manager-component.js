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

angular.module('app').component('seedManager', seedManager());

function seedManager() {
    return {
        templateUrl: 'app/query/seed-manager/seed-manager.html',
        controller: SeedManagerController,
        controllerAs: 'ctrl'
    }
}

function SeedManagerController(graph, queryPage, common, types, events) {
    var vm = this;
    vm.selectedEntities;

    vm.seedsMessage = "";

    var onSelectedElementsUpdate = function(selectedElements) {
        vm.selectedEntities = selectedElements['entities'];
        recalculateSeedsMessage();
    };

    vm.$onInit = function() {
        events.subscribe('selectedElementsUpdate', onSelectedElementsUpdate)
        vm.selectedEntities = graph.getSelectedEntities();
        recalculateSeedsMessage();
    }

    vm.$onDestroy = function() {
        events.unsubscribe('selectedElementsUpdate', onSelectedElementsUpdate)
    }

    vm.keyValuePairs = common.keyValuePairs;

    vm.selectAllSeeds = function() {
        graph.selectAllNodes();
    }

    var recalculateSeedsMessage = function() {
        var selectedSeeds = Object.keys(vm.selectedEntities);
        var displaySeeds = selectedSeeds.slice(-2);
        var howManyMore = selectedSeeds.length - 2;

        var message = displaySeeds.map(function(seed) {
            return types.getShortValue(JSON.parse(seed));
        }).join(', ');

        if (howManyMore > 0) {
            message += " and " + howManyMore + " more";
        }

        if (!message || message === "") {
            message = "No Seeds added. Type in your seeds and click add."
        }

        vm.seedsMessage = message;
    }
}