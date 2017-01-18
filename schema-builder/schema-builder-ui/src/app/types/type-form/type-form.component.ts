/*
 * Copyright 2016 Crown Copyright
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

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LocalStorageService } from 'ng2-webstorage';
import { GafferService } from '../../services/gaffer.service';
import * as _ from 'lodash';

@Component({
    selector: 'app-type-form',
    templateUrl: './type-form.component.html',
    styleUrls: ['./type-form.component.css'],
    providers: [GafferService]
})
export class TypeFormComponent implements OnInit {
    _type: any;
    aggregateFields: any;
    aggregateFieldsValid: any;
    aggregateFieldsDisabled: any;
    validationFields: any;
    validateFieldsValid: any;
    functions: any;
    errorMessage: any;

    @Input()
    set type(type: any) {
        this._type = type;
        if (!this._type.node && this._type.aggregateFunction !== null && this._type.aggregateFunction.class !== 'NULL') {
            this.aggregateFields = _.cloneDeep(this._type.aggregateFunction);
            this.aggregateFields.class = undefined;
            this.aggregateFieldsDisabled = false;
            try {
                this.aggregateFields = JSON.stringify(this.aggregateFields);
                this.aggregateFieldsValid = true;
            } catch (e) {
                this.aggregateFieldsValid = false;
            }
        } else {
            this.aggregateFields = '';
            this.aggregateFieldsValid = true;
            this.aggregateFieldsDisabled = true;
        }
        this.validationFields = {};
        this.validateFieldsValid = true;
        if (this._type.validateFunctions !== null && this._type.validateFunctions.length > 0) {
            let tempValidationFields = _.cloneDeep(this._type.validateFunctions);
            _.forEach(tempValidationFields, (field: any) => {
                let vFields = _.cloneDeep(field.function);
                vFields.class = undefined;
                this.validationFields[field.function.class] = JSON.stringify(vFields);
            });
        }
        this.getGafferFunctions(type.type, type.class);
    }
    get type() {
        return this._type;
    }

    @Output() typeChange = new EventEmitter();

    constructor(private storage: LocalStorageService, private gafferService: GafferService) { }

    ngOnInit() {

    }

    getGafferFunctions(type: any, javaClass: any) {
        if (type !== undefined && javaClass !== undefined) {
            this.gafferService.getSimpleFunctions(type, javaClass)
                .subscribe(
                functions => this.functions = functions,
                error => this.errorMessage = <any>error);
        } else {
            this.functions = undefined;
        }
    }

    changeValidations(checked: boolean, validator: any) {
        if (checked) {
            if (this._type.validateFunctions === null) {
                this._type.validateFunctions = [];
            }
            this._type.validateFunctions.push({
                function: {
                    class: validator
                }
            });
            if (this.validationFields[validator] === undefined || this.validationFields[validator].length === 0) {
                this.validationFields[validator] = '{}';
            } else {
                this.changeType(this.validationFields[validator], 'validationFields', _.cloneDeep(validator));
            }
        } else {
            for (let i = 0; i < this._type.validateFunctions.length; i++) {
                if (this._type.validateFunctions[i].function.class === validator) {
                    this._type.validateFunctions.splice(i, 1);
                }
            }
        }
    }

    changeType(value: any, key: any, secondaryKey: any) {
        if (key === 'aggregateFields') {
            try {
                let fieldsObject = JSON.parse(this.aggregateFields);
                fieldsObject.class = this._type.aggregateFunction.class;
                this._type.aggregateFunction = fieldsObject;
                this.aggregateFieldsValid = true;
            } catch (e) {
                if (this._type.aggregateFunction !== null && this._type.aggregateFunction.class !== 'NULL') {
                    this.aggregateFieldsValid = false;
                } else {
                    this.aggregateFieldsValid = true;
                }
            }
        } else if (key === 'validationFields') {
            try {
                let fieldsObject = JSON.parse(this.validationFields[secondaryKey]);
                fieldsObject.class = secondaryKey;
                for (let i = 0; i < this._type.validateFunctions.length; i++) {
                    if (this._type.validateFunctions[i].function.class === secondaryKey) {
                        this._type.validateFunctions[i].function = fieldsObject;
                    }
                }
                this.validateFieldsValid = true;
            } catch (e) {
                if (this._type.validateFunctions !== null && this._type.validateFunctions.length > 0) {
                    this.validateFieldsValid = false;
                } else {
                    this.validateFieldsValid = true;
                }
            }
        } else {
            if (!secondaryKey) {
                this._type[key] = value;
            } else {
                this._type[key] = {};
                this._type[key][secondaryKey] = value;
            }
            if (key === 'type' || key === 'class') {
                this.getGafferFunctions(this._type.type, this._type.class);
            }
            if (key === 'aggregateFunction' && value !== 'NULL') {
                this.changeType(this.aggregateFields, 'aggregateFields', undefined);
            }
        }
        if (this._type.aggregateFunction !== null && this._type.aggregateFunction.class !== 'NULL') {
            this.aggregateFieldsDisabled = false;
        } else {
            this.aggregateFieldsDisabled = true;
        }
    }

    checkValidation(validator) {
        let result = false;
        if (this._type.validateFunctions !== null) {
            this._type.validateFunctions.forEach(function (v) {
                if (v.function.class === validator) {
                    result = true;
                }
            });
        }
        return result;
    }

    save() {
        this.typeChange.emit({
            value: this._type
        });
    }
}
