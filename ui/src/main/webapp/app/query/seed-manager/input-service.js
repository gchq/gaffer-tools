/*
 * Copyright 2017 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

/**
 * The Model for the query input.
 */
angular.module('app').factory('input', ['events', 'common', function(events, common) {
    var service = {};
    var updateEventName = 'queryInputUpdate';

    var input = [];

    /** 
     * Gets the current input
    */
    service.getInput = function() {
        return input;
    }

    /**
     * Sets the current input
     * @param {Array} newInput 
     */
    service.setInput = function(newInput) {
        input = newInput;
        events.broadcast(updateEventName, [input]);
    }

    /**
     * Adds a seed to the input array and broadcasts an update event
     * @param {*} seed The seed to be added
     */
    service.addInput = function(seed) {
        if (typeof seed === 'object') {
            if (!common.arrayContainsObject(input, seed)) {
                input.push(seed);
                events.broadcast(updateEventName, [input]);
            }
        } else if (!common.arrayContainsValue(input, seed)) {
            input.push(seed);
            events.broadcast(updateEventName, [input]);
        }
    }

    /** 
     * Resets the input back to it's original state and broadcasts an update event 
    */
    service.reset = function() {
        input = [];
        events.broadcast(updateEventName, [input]);
    }

    /**
     * Removes a seed from the input array
     * @param {*} seed 
     */
    service.removeInput = function(seed) {
        var newInput = input.filter(function(vertex) {
            return !angular.equals(seed, vertex);
        });
        if(newInput.length < input.length) {
            input = newInput;
            events.broadcast(updateEventName, [input]);
        }
    }

    return service;
}]);
