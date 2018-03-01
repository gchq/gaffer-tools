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

angular.module('app').component('dateRange', dateRange());

function dateRange() {
    return {
        templateUrl: 'app/query/date-range/date-range.html',
        controller: DateRangeController,
        controllerAs: 'ctrl',
        bindings: {
            conf: '<'
        }
    }
}

function DateRangeController(time) {
    var vm = this;

    vm.startDate = null;
    vm.endDate = null;
    vm.startTime=null
    vm.endTime=null

    var validUnits = [
        "day",
        "hour",
        "minute",
        "second",
        "millisecond",
        "microsecond"
    ];

    vm.$onInit = function() {
        if (!vm.conf) {
            throw 'Config Error: Date range must be configured';
        }
        if (!vm.conf.filter) {
            throw 'Config Error: You must specify the configuration for the date filter';
        }
        if (!vm.conf.filter.startProperty || !vm.conf.filter.endProperty) {
            throw 'Config Error: You must specify the start and end property';
        }
        if (!vm.conf.filter.class) {
            throw 'Config Error: You must specify the class for the start and end';
        }
        if (vm.conf.filter.unit) {
            var unit = angular.lowercase(vm.conf.filter.unit);

            var valid = false;

            for (var i in validUnits) {
                if (unit === validUnits[i]) {
                    valid = true;
                    break;
                }
            }
            if (!valid) {
                throw 'Config Error: Unknown time unit - ' + vm.conf.filter.unit + '. Must be one of: day, hour, minute, second, millisecond or microsecond (defaults to millisecond)';
            }
        }

        var start = time.getStartDate();
        if (start) {
            vm.startDate = convertNumberToDate(start, vm.conf.filter.unit);
        }
        var end = time.getEndDate();
        if(end) {
            vm.endDate = convertNumberToDate(end, vm.conf.filter.unit);
        }
    }

    var convertNumberToDate = function(value, unit) {

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

    var convertDateToNumber = function(date, unit) {

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


    vm.onStartDateUpdate = function() {
        if (vm.startDate === undefined || vm.startDate === null) {
            time.setStartDate(undefined);
            vm.startTime = null;

            if (vm.dateForm) {
                vm.dateForm.startTime.$setViewValue(undefined);
                vm.dateForm.startTime.$setPristine();
                vm.dateForm.startTime.$setUntouched();
            }
            return;
        }
        var start = new Date(vm.startDate.getTime());

        if (vm.startTime === undefined || vm.startTime === null) {

            // start of the day

            start.setHours(0);
            start.setMinutes(0);
            start.setSeconds(0);
            start.setMilliseconds(0);
        } else {
            start.setHours(vm.startTime.getHours());
            start.setMinutes(vm.startTime.getMinutes());
            start.setSeconds(vm.startTime.getSeconds());
            start.setMilliseconds(vm.startTime.getMilliseconds());
        }


        var convertedTime = convertDateToNumber(start, vm.conf.filter.unit);
        time.setStartDate(convertedTime);
    }

    vm.onEndDateUpdate = function() {
        if (vm.endDate === undefined || vm.endDate === null) {
            time.setEndDate(undefined);
            vm.endTime = null;

            if (vm.dateForm) {
                vm.dateForm.endTime.$setViewValue(undefined);
                vm.dateForm.endTime.$setPristine();
                vm.dateForm.endTime.$setUntouched();
            }
            return;
        }
        var end = new Date(vm.endDate.getTime());

        if (vm.endTime === undefined || vm.endTime === null) {

            // end of the day

            end.setHours(23);
            end.setMinutes(59);
            end.setSeconds(59);
            end.setMilliseconds(999);

        } else {
            end.setHours(vm.endTime.getHours());
            end.setMinutes(vm.endTime.getMinutes());
            end.setSeconds(vm.endTime.getSeconds());
            end.setMilliseconds(vm.endTime.getMilliseconds());
        }

        var convertedTime = convertDateToNumber(end, vm.conf.filter.unit);

        if (vm.conf.filter.unit && angular.lowercase(vm.conf.filter.unit) === 'microsecond') {
            convertedTime += 999;
        }

        time.setEndDate(convertedTime);
    }


}