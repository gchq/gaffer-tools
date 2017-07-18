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
import { GraphQLType } from '../../shared/graphql-type.interface';
import { GafferService } from '../../services/gaffer.service';
import * as _ from 'lodash';

@Component({
    selector: 'app-type-form',
    templateUrl: './type-form.component.html',
    styleUrls: ['./type-form.component.css'],
    providers: [GafferService]
})
export class TypeFormComponent implements OnInit {
    _type: GraphQLType;
    aggregateFields: any;
    aggregateFieldsValid: any;
    aggregateFieldsDisabled: any;
    validationFields: any;
    validateFieldsValid: any;
    functions: any;
    errorMessage: string;

    @Input()
    set type(type: any) {
        this._type = type;
        if (!this._type.node && this._type.aggregateFunction !== null &&
        this._type.aggregateFunction !== undefined && this._type.aggregateFunction !== null &&
        this._type.aggregateFunction.class !== 'NULL'
        && this._type.aggregateFunction !== {} ) {
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
        if (this._type.validateFunctions && this._type.validateFunctions.length > 0) {
            const tempValidationFields = _.cloneDeep(this._type.validateFunctions);
            _.forEach(tempValidationFields, (field: any) => {
                const vFields = _.cloneDeep(field);
                vFields.class = undefined;
                this.validationFields[field.class] = JSON.stringify(vFields);
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

    getGafferFunctions(type: string, javaClass: string) {
        if (type !== undefined && javaClass !== undefined) {
            this.gafferService.getSimpleFunctions(type, javaClass)
                .subscribe(
                functions => this.functions = functions,
                error => this.errorMessage = <any>error);
        } else {
            this.functions = undefined;
        }
        if(!this._type.aggregateFunction) {
            this._type.aggregateFunction = {};
        }
    }

    changeValidations(checked: boolean, validator: any) {
        if (checked) {
            if (!this._type.validateFunctions) {
                this._type.validateFunctions = [];
            }
            this._type.validateFunctions.push({
                class: validator
            });
            if (this.validationFields[validator] === undefined || this.validationFields[validator].length === 0) {
                this.validationFields[validator] = '{}';
            } else {
                this.changeType(this.validationFields[validator], 'validationFields', _.cloneDeep(validator));
            }
        } else {
            for (let i = 0; i < this._type.validateFunctions.length; i++) {
                if (this._type.validateFunctions[i].class === validator) {
                    this._type.validateFunctions.splice(i, 1);
                }
            }
        }
    }

    changeType(value: any, key: string, secondaryKey?: string) {
        if (key === 'aggregateFields') {
            if(this.aggregateFields && this._type.aggregateFunction !== null) {
                try {
                    const fieldsObject = JSON.parse(this.aggregateFields);
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
            } else {
                this.aggregateFieldsValid = true;
            }
        } else if (key === 'validationFields') {
            try {
                const fieldsObject = JSON.parse(this.validationFields[secondaryKey]);
                fieldsObject.class = secondaryKey;
                for (let i = 0; i < this._type.validateFunctions.length; i++) {
                    if (this._type.validateFunctions[i].class === secondaryKey) {
                        this._type.validateFunctions[i] = fieldsObject;
                    }
                }
                this.validateFieldsValid = true;
            } catch (e) {
                if (this._type.validateFunctions && this._type.validateFunctions.length > 0) {
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
        if (this._type.validateFunctions) {
            this._type.validateFunctions.forEach(function (v) {
                if (v.class === validator) {
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
