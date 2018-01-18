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
            throw 'Config Error: You must specify the start and end date';
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
                throw 'Config Error: Unknown start time unit - ' + vm.conf.start.unit + '. Must be one of seconds, milliseconds or microseconds';
            }
        }
        if (vm.conf.end.unit) {
            var unit = angular.lowercase(vm.conf.end.unit);
            if (unit !== 'milliseconds' && unit !== 'microseconds' && unit !== 'seconds') {
                throw 'Config Error: Unknown start time unit - ' + vm.conf.end.unit + '. Must be one of seconds, milliseconds or microseconds';
            }
        }

        var start = time.getStartDate();
        if (start) {
            vm.start = new Date(start)
        }
        var end = time.getEndDate();
        if(end) {
            vm.end = new Date(end);
        }
    }


    vm.onStartDateUpdate = function() {
        if (vm.start === undefined || vm.start === null) {
            time.setStartDate(undefined);
            return;
        }
        var startTime = new Date(common.clone(vm.start));
        startTime = startTime.getTime();

        if (vm.conf.start.unit && angular.lowercase(vm.conf.start.unit) === 'microseconds') {
            startTime = startTime * 1000;
        } else if (vm.conf.start.unit && angular.lowercase(vm.conf.start.unit) === 'seconds') {
            startTime = startTime / 1000;
        }

        time.setStartDate(startTime);
    }

    vm.onEndDateUpdate = function() {
        if (vm.end === undefined || vm.end === null) {
            time.setEndDate(undefined);
            return;
        }
        var endTime = new Date(common.clone(vm.end));
        endTime.setHours(23);
        endTime.setMinutes(59);
        endTime.setSeconds(59);
        if (vm.conf.end.unit && angular.lowercase(vm.conf.end.unit) === 'seconds') {
            endTime.setMilliseconds(0);
            endTime = endTime.getTime();
            endTime = endTime / 1000;
        } else {
            endTime.setMilliseconds(999);
        }
        endTime = endTime.getTime();
        if (vm.conf.end.unit && angular.lowercase(vm.conf.end.unit) === 'microseconds') {
            endTime = (endTime * 1000) + 999;
        }

        time.setEndDate(endTime);
    }


}