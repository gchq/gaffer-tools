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
    functions: any;
    errorMessage: any;

    @Input()
    set type(type: any) {
        this._type = type;
        if (this._type.aggregateFunction !== null && this._type.aggregateFunction.class !== 'NULL') {
            this.aggregateFields = _.cloneDeep(this._type.aggregateFunction);
            this.aggregateFields.class = undefined;
            try {
                this.aggregateFields = JSON.stringify(this.aggregateFields);
                this.aggregateFieldsValid = true;
            } catch(e) {
                this.aggregateFieldsValid = false;
            }
        } else {
            this.aggregateFields = '';
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

    changeType(value: any, key: any, secondaryKey: any) {
        if (key === 'aggregateFields') {
            try {
                let fieldsObject = JSON.parse(value);
                fieldsObject.class = this._type.aggregateFunction.class;
                this._type.aggregateFunction = fieldsObject;
                this.aggregateFieldsValid = true;
            } catch(e) {
                this.aggregateFieldsValid = false;
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
        }
    }

    save() {
        this.typeChange.emit({
            value: this._type
        });
    }
}
