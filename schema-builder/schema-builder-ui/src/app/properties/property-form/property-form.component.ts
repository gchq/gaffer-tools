import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { LocalStorageService } from 'ng2-webstorage';
import { UUID } from 'angular2-uuid';
import * as _ from 'lodash';

@Component({
    selector: 'app-property-form',
    templateUrl: './property-form.component.html',
    styleUrls: ['./property-form.component.css']
})
export class PropertyFormComponent implements OnInit {
    _propertyHolder: any;
    _storedTypes: any;
    nodeOptions: any;

    @Input()
    set propertyHolder(propertyHolder: any) {
        this._propertyHolder = propertyHolder;
    }
    get propertyHolder() {
        return this._propertyHolder;
    }

    @Output() holderChange = new EventEmitter();

    constructor(private storage: LocalStorageService) { }

    ngOnInit() {
        this._storedTypes = this.storage.retrieve('types');
    }

    addNewProperty() {
        let uuid = UUID.UUID();
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