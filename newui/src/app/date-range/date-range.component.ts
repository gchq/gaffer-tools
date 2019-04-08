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

import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-date-range",
  templateUrl: "./date-range.component.html",
  styleUrls: ["./date-range.component.css"]
})
export class DateRangeComponent implements OnInit {
  @Input('model') model;

  constructor() {}

  ngOnInit() {
    // if (!vm.conf) {
    //         throw 'Config Error: Date range must be configured';
    //     }
    //     if (!vm.conf.filter) {
    //         throw 'Config Error: You must specify the configuration for the date filter';
    //     }
    //     if (!vm.conf.filter.startProperty || !vm.conf.filter.endProperty) {
    //         throw 'Config Error: You must specify the start and end property';
    //     }
    //     if (!vm.conf.filter.class) {
    //         throw 'Config Error: You must specify the class for the start and end';
    //     }
    //     if (vm.conf.filter.unit) {
    //         var valid = time.isValidUnit(vm.conf.filter.unit);
    //         if (!valid) {
    //             throw 'Config Error: ' + time.getUnitErrorMsg(vm.conf.filter.unit);
    //         }
    //     }
    //     vm.presets = vm.conf.filter.presets;
    //     if (!vm.model) {
    //         throw 'Date range component must be initialised with a model'
    //     }
    //     updateView(vm.model);
    //     events.subscribe('onOperationUpdate', onOperationUpdate);
  }

  startDate = null;
  endDate = null;
  startTime = null;
  endTime = null;

  presets;

  localeProviderOverride = {
    parseDate: function(dateString) {
      var m = this.moment(
        dateString,
        ["YYYY-MM-DD", "YYYY/MM/DD", "YYYY.MM.DD"],
        true
      );
      return m.isValid() ? m.toDate() : new Date(NaN);
    },

    formatDate: function(date) {
      var m = this.moment(date);
      return m.isValid() ? m.format("YYYY-MM-DD") : "";
    }
  };

  updateView = function(dates) {
    var start = dates.startDate;
    if (start) {
      var utcDate = this.time.convertNumberToDate(start, this.conf.filter.unit);
      this.startDate = this.moment(utcDate)
        .add(utcDate.getTimezoneOffset(), "minutes")
        .toDate();
      this.startTime = new Date(0);
      this.startTime.setUTCHours(utcDate.getUTCHours());
      this.startTime.setUTCMinutes(utcDate.getUTCMinutes());
      this.startTime.setUTCSeconds(utcDate.getUTCSeconds());
    } else {
      this.startDate = null;
    }
    var end = dates.endDate;
    if (end) {
      var utcDate = this.time.convertNumberToDate(end, this.conf.filter.unit);
      this.endDate = this.moment(utcDate)
        .add(utcDate.getTimezoneOffset(), "minutes")
        .toDate();
      this.endTime = new Date(0);
      this.endTime.setUTCHours(utcDate.getUTCHours());
      this.endTime.setUTCMinutes(utcDate.getUTCMinutes());
      this.endTime.setUTCSeconds(utcDate.getUTCSeconds());
    } else {
      this.endDate = null;
    }
  };

  onOperationUpdate = function() {
    this.updateView(this.model);
  };

  onDestroy = function() {
    this.events.unsubscribe("onOperationUpdate", this.onOperationUpdate);
  };

  calculateDate = function(presetParameters, callback) {
    if (!presetParameters) {
      throw new Error("This date range preset has been misconfigured");
      return;
    }
    if (presetParameters.date) {
      var date = this.moment(presetParameters.date).toDate();
      callback(date);
    } else if (presetParameters.offset !== undefined && presetParameters.unit) {
      var date = this.moment()
        .add(presetParameters.offset, presetParameters.unit)
        .startOf("day")
        .toDate();
      callback(date);
    } else {
      throw new Error("This date range preset is misconfigured.");
      return;
    }
  };

  updateStartDate = function(presetParameters) {
    this.calculateDate(presetParameters, function(date) {
      this.startDate = date;
      this.onStartDateUpdate();
    });
  };

  updateEndDate = function(presetParameters) {
    this.calculateDate(presetParameters, function(date) {
      this.endDate = date;
      this.onEndDateUpdate();
    });
  };

  onStartDateUpdate = function() {
    if (this.startDate === undefined || this.startDate === null) {
      this.model.startDate = null;
      this.startTime = null;

      if (this.dateForm) {
        this.dateForm.startTime.$setViewValue(undefined);
        this.dateForm.startTime.$setPristine();
        this.dateForm.startTime.$setUntouched();
      }
      return;
    }
    var start = new Date(this.startDate.getTime());

    if (this.startTime === undefined || this.startTime === null) {
      // start of the day
      start.setMinutes(start.getTimezoneOffset() * -1);
    } else {
      start.setHours(this.startTime.getUTCHours());
      start.setMinutes(
        this.startTime.getUTCMinutes() - start.getTimezoneOffset()
      );
      start.setSeconds(this.startTime.getSeconds());
      start.setMilliseconds(0);
    }

    var convertedTime = this.time.convertDateToNumber(
      start,
      this.conf.filter.unit
    );
    this.model.startDate = convertedTime;
  };

  onEndDateUpdate = function() {
    if (this.endDate === undefined || this.endDate === null) {
      this.model.endDate = null;
      this.endTime = null;

      if (this.dateForm) {
        this.dateForm.endTime.$setViewValue(undefined);
        this.dateForm.endTime.$setPristine();
        this.dateForm.endTime.$setUntouched();
      }
      return;
    }
    var end = new Date(this.endDate.getTime());

    if (this.endTime === undefined || this.endTime === null) {
      // end of the day

      end.setHours(23);
      end.setMinutes(59 - end.getTimezoneOffset());
      end.setSeconds(59);
      end.setMilliseconds(999);
    } else {
      end.setHours(this.endTime.getUTCHours());
      end.setMinutes(this.endTime.getUTCMinutes() - end.getTimezoneOffset());
      end.setSeconds(this.endTime.getSeconds());
      end.setMilliseconds(999);
    }

    var convertedTime = this.time.convertDateToNumber(
      end,
      this.conf.filter.unit
    );

    this.model.endDate = convertedTime;
  };
}
