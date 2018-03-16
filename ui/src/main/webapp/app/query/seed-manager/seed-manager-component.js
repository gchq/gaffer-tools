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

/**
 * Controller for the SeedManager
 * @param {Object} graph - The Graph service for selecting all seeds
 * @param {Object} types - The types service for creating short values
 * @param {Object} events - The events service for listening to updates
 * @param {Object} input - The input service for updating the seeds message
 */
function SeedManagerController(graph, types, events, input) {
    var vm = this;
    
    vm.input;

    vm.seedsMessage = "";

    /**
     * Function triggered by an update to the query input. It updates the model and forces a recalculation of the
     * seeds message.
     * @param {Array} newInput - The updated input array.
     */
    var onQueryInputUpdate = function(newInput) {
        vm.input = newInput;
        recalculateSeedsMessage();
    }

    /** 
     * Sets the initial value for the query seeds and subscribes to update events. 
    */
    vm.$onInit = function() {
        events.subscribe('queryInputUpdate', onQueryInputUpdate);
        vm.input = input.getInput();
        recalculateSeedsMessage();
    }

    /** 
     * Unsubscribes from all update events
    */
    vm.$onDestroy = function() {
        events.unsubscribe('queryInputUpdate', onQueryInputUpdate);
    }

    /** 
     * Selects all seeds on the graph which in turn triggers an update event - causing the query input to be updated
    */
    vm.selectAllSeeds = function() {
        graph.selectAllNodes();
    }

    /** 
     * Uses the seeds added to the input service to display a truncated message describing the seeds currently added to the query. 
     * It displays the last two seeds added to the input service.
    */
    var recalculateSeedsMessage = function() {
        
        var displaySeeds = vm.input.slice(-2);
        var howManyMore = vm.input.length - 2;

        var message = displaySeeds.map(function(seed) {
            var value = types.getShortValue(types.createValue(seed.valueClass, seed.parts));
            if (value === '') {
                value = '""'
            }
            return value;
        }).join(', ');

        if (howManyMore > 0) {
            message += " and " + howManyMore + " more";
        }

        if (displaySeeds.length === 0) {
            message = "No Seeds added. Type in your seeds"
        } else {
            message = "Added " + message;
        }

        vm.seedsMessage = message;
    }
}