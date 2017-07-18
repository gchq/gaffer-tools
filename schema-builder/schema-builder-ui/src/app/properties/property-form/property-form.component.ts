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

import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { LocalStorageService } from 'ng2-webstorage';
import { GafferService } from '../../services/gaffer.service';
import { UUID } from 'angular2-uuid';
import * as _ from 'lodash';

@Component({
    selector: 'app-property-form',
    templateUrl: './property-form.component.html',
    styleUrls: ['./property-form.component.css'],
    providers: [GafferService]
})
export class PropertyFormComponent implements OnInit {
    _propertyHolder: any;
    _storedTypes: any;
    nodeOptions: any;
    errorMessage: any;

    @Input()
    set propertyHolder(propertyHolder: any) {
        this._propertyHolder = propertyHolder;
    }
    get propertyHolder() {
        return this._propertyHolder;
    }

    @Output() holderChange = new EventEmitter();

    constructor(private storage: LocalStorageService, private gafferService: GafferService) { }

    ngOnInit() {
        const storedTypes = this.storage.retrieve('types');
        if (storedTypes !== null) {
            this._storedTypes = storedTypes;
        } else {
            this.resetTypes();
        }
    }

    resetTypes() {
        this.gafferService.getCommonTypes()
            .subscribe(
            commonTypes => this.formatTypes(commonTypes.types),
            error => this.errorMessage = <any>error);
    }

    formatTypes(commonTypes) {
        this._storedTypes = [];
        _.forEach(commonTypes, (type: any, key) => {
            type.type = key;
            type.index = this._storedTypes.length;
            this._storedTypes.push(type);
        });
        this.storage.store('types', this._storedTypes);
    }

    addNewProperty() {
        const uuid = UUID.UUID();
        if (!this._propertyHolder.properties) {
            this._propertyHolder.properties = [];
        }
        this._propertyHolder.properties.push({
            id: uuid,
            name: 'New Property',
            type: this._storedTypes[0].type || 'string'
        });
    }

    removeProperty(propertyId) {
        this._propertyHolder.properties = _.filter(this._propertyHolder.properties, (property: any) => {
            return property.id !== propertyId;
        });
    }

    save() {
        this.holderChange.emit({
            value: this.propertyHolder
        });
    }
}
