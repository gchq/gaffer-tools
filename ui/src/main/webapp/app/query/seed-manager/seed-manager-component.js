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
        controllerAs: 'ctrl'
    }
}
/**
 * Controller for the SeedManager
 * @param {Object} graph - The Graph service
 * @param {Object} queryPage - The query page service
 * @param {Object} common - The common service
 * @param {Object} types - The types service
 * @param {Object} events - The events service
 * @param {Object} input - The input service
 */
function SeedManagerController(graph, queryPage, common, types, events, input) {
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
     * Returns the number of key value pairs in this object
     * @param {Object} obj an Object 
     */
    vm.keyValuePairs = function(obj) {
        return Object.keys(obj).length;
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
            return types.getShortValue(seed);
        }).join(', ');

        if (howManyMore > 0) {
            message += " and " + howManyMore + " more";
        }

        if (!message || message === "") {
            message = "No Seeds added. Type in your seeds and click add."
        } else {
            message = "Added " + message;
        }

        vm.seedsMessage = message;
    }
}
