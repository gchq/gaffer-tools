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

    vm.startDate = null;
    vm.endDate = null;
    vm.startTime=null
    vm.endTime=null

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
            vm.startDate= convertNumberToDate(start, vm.conf.start.unit);
        }
        var end = time.getEndDate();
        if(end) {
            vm.endDate = convertNumberToDate(end, vm.conf.end.unit);
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
        if (vm.startDate === undefined || vm.startDate === null) {
            time.setStartDate(undefined);
            vm.startTime = null
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


        start = start.getTime();

        if (!vm.conf.start.unit || angular.lowercase(vm.conf.start.unit) === 'milliseconds') {
            time.setStartDate(start);
            return;
        }

        if (angular.lowercase(vm.conf.start.unit) === 'microseconds') {
            start = start * 1000;
        } else if (angular.lowercase(vm.conf.start.unit) === 'seconds') {
            start = Math.floor(start / 1000);
        }

        time.setStartDate(start);
    }

    vm.onEndDateUpdate = function() {
        if (vm.endDate === undefined || vm.endDate === null) {
            time.setEndDate(undefined);
            vm.endTime = null;
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

        end = end.getTime();

        if (vm.conf.end.unit && angular.lowercase(vm.conf.end.unit) === 'seconds') {
            end = Math.floor(end / 1000);
        } else {
            if (vm.conf.end.unit && angular.lowercase(vm.conf.end.unit) === 'microseconds') {
                end = (end * 1000) + 999;
            }
        }

        time.setEndDate(end);
    }


}