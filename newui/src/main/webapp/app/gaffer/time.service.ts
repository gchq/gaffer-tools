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
import { ConfigService } from '../config/config.service';
import { Injectable } from '@angular/core';
import { lowerCase, cloneDeep } from "lodash";
import * as moment from 'moment';

@Injectable()
export class TimeService {

    validUnits = [
        "day",
        "hour",
        "minute",
        "second",
        "millisecond",
        "microsecond"
    ];

    timeProperties = {};

    constructor(private config: ConfigService) {
        this.config.get().subscribe(
            (myConfig) => {
                if(myConfig && myConfig.time && myConfig.time.properties) {
                    this.timeProperties = myConfig.time.properties;
                }
            }
        );
    }

    isValidUnit = function(unit) {
        var unitLowercase = lowerCase(unit);
        var valid = false;
        for (var i in this.validUnits) {
            if (unitLowercase === this.validUnits[i]) {
                valid = true;
                break;
            }
        }
        return valid;
    }

    getUnitErrorMsg = function(unit) {
        return 'Unknown time unit - ' + unit + '. Must be one of: day, hour, minute, second, millisecond or microsecond (defaults to millisecond)';
    }

    isTimeProperty = function(propName) {
        return propName in this.timeProperties;
    }

    getTimeMetaData = function(propName) {
        return this.timeProperties[propName];
    }

    getDateString = function(propName, value) {
        var dateString;
        var timeProp = this.timeProperties[propName];
        if(timeProp) {
            var dateValue =  this.convertNumberToDate(value, timeProp.unit)
            dateString = moment.utc(dateValue).format('YYYY-MM-DD HH:mm:ss');
        } else {
            // just return the original value
            dateString = value;
        }
        return dateString;
    }

    convertNumberToDate = function(value, unit) {
        if (!unit || lowerCase(unit) === 'millisecond') {
            return new Date(value);
        }
        var finalValue = cloneDeep(value);
        switch(lowerCase(unit)) {
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

    convertDateToNumber = function(date, unit) {
        var time = date.getTime();
        if (!unit || lowerCase(unit) === 'millisecond') {
            return time;
        }
        switch(lowerCase(unit)) {
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
};
