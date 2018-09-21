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

angular.module('app').factory('settings', ['$q', 'config', 'events', function($q, config, events) {
    var settings = {};

    var resultLimit = 1000;
    var defaultOpOptions = {};
    var opOptionKeys;
    var defaultOpOptionsUpdateListeners = [];

    settings.getResultLimit = function() {
        return resultLimit;
    }

    settings.setResultLimit = function(limit) {
        resultLimit = limit;
    }

    settings.getDefaultOpOptions = function() {
        return defaultOpOptions;
    }

    settings.setDefaultOpOptions = function(opOptions) {
        defaultOpOptions = opOptions;
    }

    settings.getOpOptionKeys = function() {
        var defer = $q.defer();
        if (opOptionKeys) {
            defer.resolve(opOptionKeys);
        } else {
            config.get().then(function(conf) {
                if (conf.operationOptionKeys) {
                    opOptionKeys = conf.operationOptionKeys;
                } else {
                    opOptionKeys = {};
                }
                defer.resolve(opOptionKeys);
            });

        }
        return defer.promise;
    }

    return settings;
}]);
