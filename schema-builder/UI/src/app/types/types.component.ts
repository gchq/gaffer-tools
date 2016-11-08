import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ng2-webstorage';
import { GafferService } from '../services/gaffer.service';

@Component({
    selector: 'app-types',
    templateUrl: './types.component.html',
    styleUrls: ['./types.component.css'],
    providers: [GafferService]
})
export class TypesComponent implements OnInit {

    types: Array<any>;
    errorMessage: any;

    constructor(private storage: LocalStorageService, private gafferService: GafferService) { }

    ngOnInit() {
        let storedTypes = this.storage.retrieve('types');
        if (storedTypes !== null) {
            this.types = storedTypes;
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

    removeType(index) {
        this.types.splice(index, 1);
        this.storage.store('types', this.types);
    }

    addNewType() {
        this.types.push({
            type: 'new type',
            position: null,
            aggregateFunction: null,
            serialiserClass: null,
            class: '',
            validateFunctions: null
        });
    }

    formatTypes(commonTypes) {
        this.types = [];
        for (let key in commonTypes) {
            if (commonTypes.hasOwnProperty(key)) {
                let type = commonTypes[key];
                type.type = key;
                type.index = this.types.length;
                this.types.push(type);
            }
        }
        this.storage.store('types', this.types);
    }

    typeChanged(event) {
        let type = event.value;
        this.types[type.index] = type;
        this.types[type.index].editing = false;
        this.storage.store('types', this.types);
    }
}
