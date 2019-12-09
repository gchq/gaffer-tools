/*
 * Copyright 2017-2019 Crown Copyright
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

angular.module('app').factory('settings', ['$cookies', function($cookies) {
    var settings = {};

    var settingsDefaultConfig = {
        "resultLimit": 1000,
        "clearChainAfterExecution": true,
        "customVertexLabels": [],
        "timeToLiveInDays": 30
    };

    settings.getResultLimit = function() {
        return getSetting("resultLimit", settingsDefaultConfig.resultLimit);
    }

    settings.setResultLimit = function(limit) {
        setSetting("resultLimit", limit);
    }

    settings.getClearChainAfterExecution = function() {
        return getSetting("clearChainAfterExecution", settingsDefaultConfig.clearChainAfterExecution);
    }

    settings.setClearChainAfterExecution = function(state) {
        setSetting("clearChainAfterExecution", state);
    }

    settings.getCustomVertexLabels = function() {
        var labels =  getSetting("customVertexLabels", settingsDefaultConfig.customVertexLabels);
        labels.sort(function(a, b) {
             return a.timestamp > b.timestamp ? -1 : (a.timestamp < b.timestamp ? 1 : 0);
        })
        return labels;
    }

    settings.setCustomVertexLabels = function(labels) {
        setSetting("customVertexLabels", labels);
    }

    settings.getTimeToLiveInDays = function() {
        if(settingsDefaultConfig.timeToLiveInDays && settingsDefaultConfig.timeToLiveInDays > 0) {
            return settingsDefaultConfig.timeToLiveInDays;
        }

        return 0;
    }

    settings.getCustomVertexLabelsMap = function() {
        var customVertexLabelsArray = settings.getCustomVertexLabels();
        var customVertexLabelsMap = {}
        for(var i in customVertexLabelsArray) {
            customVertexLabelsMap[customVertexLabelsArray[i].vertex] = customVertexLabelsArray[i].label;
        }
        return customVertexLabelsMap;
    }

    var getSetting = function(key, defaultValue) {
        var value = $cookies.getObject(key);
        if(value == undefined || value == null) {
            value = defaultValue;
        }
        return value;
    }

    var setSetting = function(key, value) {
        $cookies.putObject(key, value, getExpiry());
    }

    var getExpiry = function() {
      var result = new Date();
      result.setDate(result.getDate() + settings.getTimeToLiveInDays());
      return result.toUTCString();
    }

    return settings;
}]);
