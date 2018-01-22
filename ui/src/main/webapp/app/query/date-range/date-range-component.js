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

function DateRangeController(time, common) {
    var vm = this;

    vm.start = null;
    vm.end = null;

    vm.$onInit = function() {
        if (!vm.conf) {
            throw 'Config Error: Date range must be configured';
        }
        if (!vm.conf.start || !vm.conf.end) {
            throw 'Config Error: You must specify the configuration for the start and end date';
        }
        if (!vm.conf.start.property || !vm.conf.end.property) {
            throw 'Config Error: You must specify the start and end property';
        }
        if (!vm.conf.start.class || !vm.conf.end.class) {
            throw 'Config Error: You must specify the class for the start and end';
        }
        if (vm.conf.start.unit) {
            var unit = angular.lowercase(vm.conf.start.unit);
            if (unit !== 'milliseconds' && unit !== 'microseconds' && unit !== 'seconds') {
                throw 'Config Error: Unknown start time unit - ' + vm.conf.start.unit + '. Must be one of seconds, milliseconds or microseconds (defaults to milliseconds)';
            }
        }
        if (vm.conf.end.unit) {
            var unit = angular.lowercase(vm.conf.end.unit);
            if (unit !== 'milliseconds' && unit !== 'microseconds' && unit !== 'seconds') {
                throw 'Config Error: Unknown end time unit - ' + vm.conf.end.unit + '. Must be one of seconds, milliseconds or microseconds (defaults to milliseconds)';
            }
        }

        var start = time.getStartDate();
        if (start) {
            vm.start = convertNumberToDate(start, vm.conf.start.unit);
        }
        var end = time.getEndDate();
        if(end) {
            vm.end = convertNumberToDate(end, vm.conf.end.unit);
        }
    }

    var convertNumberToDate = function(value, unit) {

        if (!unit || angular.lowercase(unit) === 'milliseconds') {
            return new Date(value);
        }

        var finalValue = common.clone(value);

        if (angular.lowercase(unit) === 'seconds') {
            finalValue = finalValue * 1000;
        } else if (angular.lowercase(unit) === 'microseconds') {
            finalValue = Math.round(finalValue / 1000);
        }

        return new Date(finalValue);
    }


    vm.onStartDateUpdate = function() {
        if (vm.start === undefined || vm.start === null) {
            time.setStartDate(undefined);
            return;
        }
        var startTime = new Date(vm.start.getTime());

        // start of the day

        startTime.setHours(0);
        startTime.setMinutes(0);
        startTime.setSeconds(0);
        startTime.setMilliseconds(0);

        startTime = startTime.getTime();

        if (!vm.conf.start.unit || angular.lowercase(vm.conf.start.unit) === 'milliseconds') {
            time.setStartDate(startTime);
            return;
        }

        if (angular.lowercase(vm.conf.start.unit) === 'microseconds') {
            startTime = startTime * 1000;
        } else if (angular.lowercase(vm.conf.start.unit) === 'seconds') {
            startTime = Math.round(startTime / 1000);
        }

        time.setStartDate(startTime);
    }

    vm.onEndDateUpdate = function() {
        if (vm.end === undefined || vm.end === null) {
            time.setEndDate(undefined);
            return;
        }
        var endTime = new Date(vm.end.getTime());

        // end of the day

        endTime.setHours(23);
        endTime.setMinutes(59);
        endTime.setSeconds(59);

        if (vm.conf.end.unit && angular.lowercase(vm.conf.end.unit) === 'seconds') {
            endTime.setMilliseconds(0); // for easy rounding to last second of the day
            endTime = endTime.getTime();
            endTime = endTime / 1000;
        } else {
            endTime.setMilliseconds(999);
            endTime = endTime.getTime();
            if (vm.conf.end.unit && angular.lowercase(vm.conf.end.unit) === 'microseconds') {
                endTime = (endTime * 1000) + 999;
            }
        }

        time.setEndDate(endTime);
    }


}