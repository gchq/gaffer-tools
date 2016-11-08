import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LocalStorageService } from 'ng2-webstorage';
import { GafferService } from '../../services/gaffer.service';

@Component({
    selector: 'app-type-form',
    templateUrl: './type-form.component.html',
    styleUrls: ['./type-form.component.css'],
    providers: [GafferService]
})
export class TypeFormComponent implements OnInit {
    _type: any;
    functions: any;
    errorMessage: any;

    @Input()
    set type(type: any) {
        this._type = type;
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

    save() {
        this.typeChange.emit({
            value: this._type
        });
    }
}
