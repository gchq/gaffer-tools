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
import { Injectable } from '@angular/core';
import {  } from 'lodash';

import { CommonService } from '../dynamic-input/common.service';

@Injectable()
export class TypeService {

    types = {};
    // var simpleClassNames = {};

    unknownType =
        {
            fields: [
                {
                    label: "Value",
                    type: "text",
                    class: "java.lang.String"
                }
            ]
        }

    constructor(private common: CommonService) {}

    getShortValue = function(value) {

        if (typeof value === 'string' || value instanceof String || typeof value === 'number' || typeof value === 'boolean' || value === null || value === undefined) {
            return value;
        }

        if (value.constructor === Array) {
            return this.listShortValue(value);
        } else if (Object.keys(value).length != 1) {
            return this.defaultShortValue(value);
        }

        var typeClass = Object.keys(value)[0];
        var parts = value[typeClass]; // the value without the class prepended
        if(parts === undefined) {
            return "";
        }

        var type = this.getType(typeClass);

        if (type.custom) {
            return this.customShortValue(type.fields, parts)
        }

        if (!this.isKnown(typeClass)) {
            if (this.common.endsWith(typeClass, 'Map')) {
                return this.mapShortValue(parts);
            } else if (this.common.endsWith(typeClass, 'List') || this.common.endsWith(typeClass, 'Set')) {
                return this.listShortValue(parts);
            }
        }

        if (typeof parts === 'object') {
            return Object.keys(parts).map((key) => {
                var val = parts[key];
                return this.getShortValue(val);
            }).join("|");
        }

        return parts;
    }

    private getType = function(typeClass) {
        if (typeClass !== undefined && this.types[typeClass]) {
            return this.types[typeClass];
        }
        return this.unknownType;
    }

    isKnown = function(className) {
        var knownType = this.types[className];

        if(knownType) {
            return true;
        }

        return false;
    }

    defaultShortValue = function(value) {
        return JSON.stringify(value);
    }

    listShortValue = function(values) {
        return values.map((value) => {
            return this.getShortValue(value);
        }).join(', ');
    }
};
