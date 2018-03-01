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

angular.module('app').factory('time', ['config', function(config) {
    var service = {};
    var validUnits = [
        "day",
        "hour",
        "minute",
        "second",
        "millisecond",
        "microsecond"
    ];

    var timeProperties = {};

    config.get().then(function(myConfig) {
        if(myConfig && myConfig.time && myConfig.time.properties) {
            timeProperties = myConfig.time.properties;
        }
    });

    service.isValidUnit = function(unit) {
        var valid = false;
        for (var i in validUnits) {
            if (unit === validUnits[i]) {
                valid = true;
                break;
            }
        }
        return valid;
    }

    service.isTimeProperty = function(propName) {
        return propName in timeProperties;
    }

    service.getDateString = function(propName, value) {
        var dateString;
        var timeProp = timeProperties[propName];
        if(timeProp) {
            var dateValue =  service.convertNumberToDate(value, timeProp.unit)
            dateString = dateValue.toLocaleDateString() + " " + dateValue.toLocaleTimeString();
        } else {
            // just return the original value
            dateString = value;
        }
        return dateString;
    }

    service.convertNumberToDate = function(value, unit) {

        if (!unit || angular.lowercase(unit) === 'millisecond') {
            return new Date(value);
        }

        var finalValue = angular.copy(value);

        switch(angular.lowercase(vm.conf.filter.unit)) {
            case "microsecond":
                finalValue = Math.floor(finalValue / 1000);
                break;
            case "second":
                finalValue = finalValue * 1000;
                break;
            case "minute":
                finalValue = finalValue * 60000;
                break;
            case "hour":
                finalValue = finalValue * 3600000;
                break;
            case "day":
                finalValue = finalValue * 86400000;
                break;
        }

        return new Date(finalValue);
    }

    service.convertDateToNumber = function(date, unit) {
        var time = date.getTime();

        if (!unit || angular.lowercase(unit) === 'millisecond') {
            return time;
        }

        switch(angular.lowercase(unit)) {
            case "microsecond":
                time = time * 1000;
                break;
            case "second":
                time = Math.floor(time / 1000);
                break;
            case "minute":
                time = Math.floor(time / 60000);
                break;
            case "hour":
                time = Math.floor(time / 3600000);
                break;
            case "day":
                time = Math.floor(time / 86400000);
                break;
        }

        return time;
    }

    return service;

}]);