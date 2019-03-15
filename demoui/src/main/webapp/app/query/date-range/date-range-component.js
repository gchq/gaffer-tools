/*
 * Copyright 2017-2019 Crown Copyright
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
            conf: '<',
            model: '='
        }
    }
}

function DateRangeController(time, events, error) {
    var vm = this;

    vm.startDate = null;
    vm.endDate = null;
    vm.startTime=null
    vm.endTime=null

    vm.presets;

    vm.localeProviderOverride = {
        parseDate:  function(dateString) {
            var m = moment(dateString, ['YYYY-MM-DD', 'YYYY/MM/DD', 'YYYY.MM.DD'], true);
            return m.isValid() ? m.toDate() : new Date(NaN);
        },

        formatDate: function(date) {
            var m = moment(date);
            return m.isValid() ? m.format('YYYY-MM-DD') : '';
        }
    }

    var updateView = function(dates) {
        var start = dates.startDate;
        if (start) {
            var utcDate = time.convertNumberToDate(start, vm.conf.filter.unit);
            vm.startDate = moment(utcDate).add(utcDate.getTimezoneOffset(), 'minutes').toDate()
            vm.startTime = new Date(0);
            vm.startTime.setUTCHours(utcDate.getUTCHours())
            vm.startTime.setUTCMinutes(utcDate.getUTCMinutes());
            vm.startTime.setUTCSeconds(utcDate.getUTCSeconds());
        } else {
            vm.startDate = null;
        }
        var end = dates.endDate;
        if(end) {
            var utcDate = time.convertNumberToDate(end, vm.conf.filter.unit);
            vm.endDate = moment(utcDate).add(utcDate.getTimezoneOffset(), 'minutes').toDate();
            vm.endTime = new Date(0);
            vm.endTime.setUTCHours(utcDate.getUTCHours())
            vm.endTime.setUTCMinutes(utcDate.getUTCMinutes());
            vm.endTime.setUTCSeconds(utcDate.getUTCSeconds());
        } else {
            vm.endDate = null;
        }
    }

    var onOperationUpdate = function() {
        updateView(vm.model);
    }

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
            var valid = time.isValidUnit(vm.conf.filter.unit);
            if (!valid) {
                throw 'Config Error: ' + time.getUnitErrorMsg(vm.conf.filter.unit);
            }
        }

        vm.presets = vm.conf.filter.presets;

        if (!vm.model) {
            throw 'Date range component must be initialised with a model'
        }

        updateView(vm.model);

        events.subscribe('onOperationUpdate', onOperationUpdate);
        
    }

    vm.$onDestroy = function() {
        events.unsubscribe('onOperationUpdate', onOperationUpdate);
    }

    var calculateDate = function(presetParameters, callback) {
        if (!presetParameters) {
            error.handle('This date range preset has been misconfigured');
            return;
        }
        if (presetParameters.date) {
            var date = moment(presetParameters.date).toDate();
            callback(date);
        } else if (presetParameters.offset !== undefined && presetParameters.unit) {
            var date = moment().add(presetParameters.offset, presetParameters.unit).startOf('day').toDate();
            callback(date);
        } else {
            error.handle('This date range preset is misconfigured.', 'Invalid configuration: \n' + JSON.stringify(presetParameters));
            return;
        }
    }

    vm.updateStartDate = function(presetParameters) {
        calculateDate(presetParameters, function(date) {
            vm.startDate = date;
            vm.onStartDateUpdate();
        });
    }

    vm.updateEndDate = function(presetParameters) {
        calculateDate(presetParameters, function(date) {
            vm.endDate = date;
            vm.onEndDateUpdate();
        });
    }

    vm.onStartDateUpdate = function() {
        if (vm.startDate === undefined || vm.startDate === null) {
            vm.model.startDate = null;
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
            start.setMinutes(start.getTimezoneOffset() * -1);

        } else {
            start.setHours(vm.startTime.getUTCHours());
            start.setMinutes(vm.startTime.getUTCMinutes() - start.getTimezoneOffset());
            start.setSeconds(vm.startTime.getSeconds());
            start.setMilliseconds(0);
        }


        var convertedTime = time.convertDateToNumber(start, vm.conf.filter.unit);
        vm.model.startDate = convertedTime
    }

    vm.onEndDateUpdate = function() {
        if (vm.endDate === undefined || vm.endDate === null) {
            vm.model.endDate = null;
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
            end.setMinutes(59 - end.getTimezoneOffset());
            end.setSeconds(59);
            end.setMilliseconds(999);

        } else {    
            end.setHours(vm.endTime.getUTCHours());
            end.setMinutes(vm.endTime.getUTCMinutes() - end.getTimezoneOffset());
            end.setSeconds(vm.endTime.getSeconds());
            end.setMilliseconds(999);
        }

        var convertedTime = time.convertDateToNumber(end, vm.conf.filter.unit);

        if (vm.conf.filter.unit && angular.lowercase(vm.conf.filter.unit) === 'microsecond') {
            convertedTime += 999;
        }
        vm.model.endDate = convertedTime;
    }
}
