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

angular.module('app').factory('events', function() {

    var service = {};

    var events = {};

    service.subscribe = function(eventName, callback) {
        if (!events[eventName]) {
            events[eventName] = [];
        }

        events[eventName].push(callback);
    }

    service.broadcast(eventName, args) {
        var listeners = events[eventName];
        var fn;
        for(var i in listeners) {
            fn = listeners[i];
            fn.apply(fn, args);
        }
    }

    service.unsubscribe(eventName, callback) {
        var events[eventName] = events[eventName].filter(function(fn) {
            if (fn !== callback) {
                return fn;
            }
        })
    }

    return service;
});
