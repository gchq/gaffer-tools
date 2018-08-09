/*
 * Copyright 2018 Crown Copyright
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
        templateUrl: 'app/common/dynamic-date-picker.html',
        controller: DynamicDatePickerController,
        controllerAs: 'ctrl',
        bindings: {
            param: '=',
            meta: '<',
            name: '<'
        }
    }
}

function DynamicDatePickerController(types, time, common) {
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

    vm.date;
    vm.time;

    vm.showTime = false;

    var outputType;

    vm.timeOptions = {
        'start of day': new Date(0),
        'end of day': new Date(86399999),
        'choose': undefined
    }

    vm.availableTimes = Object.keys(vm.timeOptions);
    vm.selectedTime;

    vm.$onInit = function() {
        // do some validation here
        
        // calculate output type
        // assumption is made here about the parameter passed in - Simple object (either text or number).
        var fields = types.getFields(vm.param.valueClass);
        outputType = fields[0].type;

        // update view

        vm.updateView();
    }

    var updateNumberModel = function() {
        var date = new Date(vm.date.getTime());
        
        date.setHours(vm.time.getUTCHours());
        date.setMinutes(vm.time.getUTCMinutes() - date.getTimezoneOffset())
        date.setSeconds(vm.time.getSeconds());
        date.setMilliseconds(vm.time.getMilliseconds());

        var converted = time.convertDateToNumber(date, vm.meta.unit);

        if (vm.selectedTime == 'end of day' && vm.meta.unit === 'microsecond') {
            converted += 999
        }

        vm.param.parts[Object.keys(vm.param.parts)[0]] = converted;
    }

    var updateTextModel = function() {
        vm.param.parts[Object.keys(vm.param.parts)[0]] = vm.date.getFullYear() + '-' + vm.date.getMonth() + 1 + '-' + vm.date.getDay() + ' ' + vm.time.getUTCHours() + ':' + vm.time.getUTCMinutes() + ':' + vm.time.getUTCSeconds();
    }

    vm.onUpdate = function() {  // whenever date/time is updated
        if (!vm.showTime) { // either date or md-select updated 
            if (vm.selectedTime === 'choose') {
                vm.showTime = true;
            }
            vm.time = vm.timeOptions[vm.selectedTime];  // create time
        } else if (!vm.time) {    
            vm.showTime = false;
            vm.selectedTime = undefined;
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
        vm.date = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDay());

        if (common.endsWith(newModel, '23:59:59')) {
            vm.selectedTime = 'end of day';
            vm.time = vm.timeOptions[vm.selectedTime];
            vm.showTime = false;
        } else if (common.endsWith(newModel, '00:00:00')) {
            vm.selectedTime = 'start of day';
            vm.time = vm.timeOptions[vm.selectedTime];
            vm.showTime = false;
        } else {
            vm.time = new Date(0);
            vm.time.setUTCHours(vm.date.getHours());
            vm.time.setUTCMinutes(vm.date.getMinutes());
            vm.time.setUTCSeconds(vm.date.getSeconds());
        }
        
    }

    var updateViewUsingNumberModel = function(newModel) {
        var utcDate = time.convertNumberToDate(newModel, vm.meta.unit);
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
        }
    }

    vm.updateView = function() {
        var newModel = vm.param.parts[Object.keys(vm.param.parts)[0]];
        if (newModel == undefined) { // reset
            vm.date = undefined;
            vm.time = undefined;
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