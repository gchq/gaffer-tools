import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ng2-webstorage';
import { GafferService } from '../services/gaffer.service';

import * as _ from 'lodash';

@Component({
    selector: 'app-types',
    templateUrl: './types.component.html',
    styleUrls: ['./types.component.css'],
    providers: [GafferService]
})
export class TypesComponent implements OnInit {

    types: Array<any>;
    nodeTypes: Array<any>;
    errorMessage: any;

    constructor(private storage: LocalStorageService, private gafferService: GafferService) { }

    ngOnInit() {
        let storedTypes = this.storage.retrieve('types');
        if (storedTypes !== null) {
            this.types = storedTypes;
            this.getNodes();
        } else {
            this.resetTypes();
        }
    }

    getNodes() {
        let storedNodes = this.storage.retrieve('graphNodes');
        if (storedNodes !== null) {
            this.nodeTypes = [];
            _.forEach(storedNodes._data, (node: any) => {
                this.nodeTypes.push({
                    type: node.label,
                    class: node.class || 'java.lang.String',
                    validateFunctions: node.validateFunctions || [],
                    aggregateFunction: null,
                    index: this.nodeTypes.length,
                    node: true
                });
            });
        }
    }

    resetTypes() {
        this.gafferService.getCommonTypes()
            .subscribe(
            commonTypes => this.formatTypes(commonTypes.types),
            error => this.errorMessage = <any>error);
        this.getNodes();
    }

    removeType(index) {
        this.types.splice(index, 1);
        this.storage.store('types', this.types);
    }

    addNewType() {
        this.types.push({
            type: 'new type',
            aggregateFunction: null,
            serialiserClass: null,
            class: '',
            validateFunctions: null
        });
    }

    formatTypes(commonTypes) {
        this.types = [];
        _.forEach(commonTypes, (type: any, key) => {
            type.type = key;
            type.index = this.types.length;
            this.types.push(type);
        });
        this.storage.store('types', this.types);
    }

    typeChanged(event) {
        let type = event.value;
        this.types[type.index] = type;
        this.types[type.index].editing = false;
        this.storage.store('types', this.types);
    }

    nodeTypeChanged(event) {
        let type = event.value;
        let storedNodes = this.storage.retrieve('graphNodes');
        if (storedNodes !== null) {
            _.forEach(storedNodes._data, (node: any) => {
                if (node.label === type.type) {
                    node.class = type.class;
                    node.validateFunctions = type.validateFunctions;
                }
            });
        }
        this.nodeTypes[type.index].editing = false;
        this.storage.store('graphNodes', storedNodes);
    }
}
