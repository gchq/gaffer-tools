/*
 * Copyright 2018-2019 Crown Copyright
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

angular.module('app').component('dynamicDatePicker', dynamicDatePicker());

function dynamicDatePicker() {
     return {
        templateUrl: 'app/common/dynamic-input/dynamic-date-picker.html',
        controller: DynamicDatePickerController,
        controllerAs: 'ctrl',
        bindings: {
            param: '=',
            unit: '<',
            name: '<'
        }
    }
}

function DynamicDatePickerController(types, time) {
    var vm = this;

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

    vm.date = null;
    vm.time = null;

    vm.showTime = false;

    var outputType;

    vm.timeOptions = {
        'start of day': new Date(0),
        'end of day': new Date(86399999),
        'choose': new Date(0)
    }

    vm.availableTimes = Object.keys(vm.timeOptions);
    vm.selectedTime;

    vm.$onInit = function() {
        // do some validation here
        
        if (!vm.param) {
            throw 'Unable to create dynamic date picker as there is no model present';
        }
        // calculate output type
        // assumption is made here about the parameter passed in - Simple object (either text or number).
        var fields = types.getFields(vm.param.valueClass);

        if (fields.length !== 1) {
            throw 'Unsupported date class detected. Must be a number or string';
        }
        outputType = fields[0].type;

        if (outputType === 'number' && !vm.unit) {
            throw 'Unable to create dynamic date picker as no unit was supplied'
        }

        if (!(outputType === 'number' || outputType === 'text')) {
            throw 'Unable to create dynamic date picker. Expected model to be of type "text" or "number". However it was "' + outputType + '"'
        }

        // update view

        vm.updateView();
    }

    var mergeDates = function(localDate, localTime, toUTC) {
        var date = new Date(localDate.getTime());
        
        date.setHours(localTime.getUTCHours());
        date.setMinutes(localTime.getUTCMinutes() - ( toUTC ? date.getTimezoneOffset() : 0));
        date.setSeconds(localTime.getSeconds());
        date.setMilliseconds(localTime.getMilliseconds());

        return date;
    }

    var updateNumberModel = function() {
        var utcDate = mergeDates(vm.date, vm.time, true);

        var converted = time.convertDateToNumber(utcDate, vm.unit);

        if (vm.selectedTime == 'end of day' && vm.unit === 'microsecond') {
            converted += 999
        }

        vm.param.parts[Object.keys(vm.param.parts)[0]] = converted;
    }

    var updateTextModel = function() {
        var localDate = mergeDates(vm.date, vm.time, false);

        vm.param.parts[Object.keys(vm.param.parts)[0]] = moment(localDate).format('YYYY-MM-DD HH:mm:ss');
    }

    vm.onUpdate = function() {  // whenever date/time is updated
        if (!vm.showTime) { // either date or md-select updated 
            if (vm.selectedTime === 'choose') {
                vm.showTime = true;
            } 
            vm.time = vm.timeOptions[vm.selectedTime];  // create time
            
        } else if (!vm.time) {    
            vm.showTime = false;
            vm.selectedTime = 'start of day';
            vm.time = vm.timeOptions[vm.selectedTime];  // create time
        }
        // update model
        if (vm.date && vm.time) {
            if (outputType === 'text') {
                updateTextModel();
            } else {
                updateNumberModel();
            }
        }
    }

    var updateViewUsingTextModel = function(newModel) {
        var newDate = moment(newModel).toDate();
        vm.date = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());

        if (newDate.getHours() === 23 && newDate.getMinutes() === 59 && newDate.getSeconds() === 59) {
            vm.selectedTime = 'end of day';
            vm.time = vm.timeOptions[vm.selectedTime];
            vm.showTime = false;
        } else if (newDate.getHours() === 0 && newDate.getMinutes() === 0 && newDate.getSeconds() === 0) {
            vm.selectedTime = 'start of day';
            vm.time = vm.timeOptions[vm.selectedTime];
            vm.showTime = false;
        } else {
            vm.time = new Date(0);
            vm.time.setUTCHours(newDate.getHours());
            vm.time.setUTCMinutes(newDate.getMinutes());
            vm.time.setUTCSeconds(newDate.getSeconds());
        }
        
    }

    var updateViewUsingNumberModel = function(newModel) {
        var utcDate = time.convertNumberToDate(newModel, vm.unit);
        vm.date = moment(utcDate).add(utcDate.getTimezoneOffset(), 'minutes').toDate();
        vm.time = new Date(0);
        vm.time.setUTCHours(utcDate.getUTCHours())
        vm.time.setUTCMinutes(utcDate.getUTCMinutes());
        vm.time.setUTCSeconds(utcDate.getUTCSeconds());

        if (vm.time.getUTCHours() === 0 && vm.time.getUTCMinutes() === 0 && vm.time.getUTCSeconds() === 0) {
            vm.selectedTime = 'start of day';
            vm.time = vm.timeOptions[vm.selectedTime];
            vm.showTime = false;
        } else if (vm.time.getUTCHours() === 23 && vm.time.getUTCMinutes() === 59 && vm.time.getUTCSeconds() === 59) {
            vm.selectedTime = 'end of day';
            vm.time = vm.timeOptions[vm.selectedTime];
            vm.showTime = false;
        } else {
            vm.showTime = true;
        }
    }

    vm.updateView = function() {
        var newModel = vm.param.parts[Object.keys(vm.param.parts)[0]];
        if (newModel == undefined) { // reset
            vm.date = null;
            vm.time = null;
            vm.selectedTime = undefined;
            vm.showTime = false;
            return;
        }
        if (outputType === 'text') {
            updateViewUsingTextModel(newModel);
        } else {
            updateViewUsingNumberModel(newModel);
        }
    }

    
}
