import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ng2-webstorage';
import { GafferService } from '../services/gaffer.service';

declare var $: any;

@Component({
    selector: 'app-schema',
    templateUrl: './schema.component.html',
    styleUrls: ['./schema.component.css'],
    providers: [GafferService]
})
export class SchemaComponent implements OnInit {

    schema: any;
    dataSchema: any;
    dataTypes: any;
    storeTypes: any;
    functions: any;
    commonTypes: any;
    validation: any;
    errorMessage: any;
    editingDataSchema: Boolean;

    parseDataSchema() {
        this.dataSchema = {
            edges: {},
            entities: {}
        };
        for (let key in this.schema.edges._data) {
            if (this.schema.edges._data.hasOwnProperty(key)) {
                let edge = this.schema.edges._data[key];
                let directed = 'true';
                if (edge.arrows !== 'to') {
                    directed = 'false';
                }
                let formattedEdge = {
                    source: this.schema.nodes._data[edge.from].label,
                    destination: this.schema.nodes._data[edge.to].label,
                    directed: directed
                };
                this.dataSchema.edges[edge.label] = formattedEdge;
            }
        }
        for (let key in this.schema.nodes._data) {
            if (this.schema.nodes._data.hasOwnProperty(key)) {
                let node = this.schema.nodes._data[key];
                if (node.entities) {
                    for (let i = 0; i < node.entities.length; i++) {
                        let entity = node.entities[i];
                        let formattedEntity = {
                            vertex: node.label,
                            properties: {}
                        }
                        if (entity.properties) {
                            for (let j = 0; j < entity.properties.length; j++) {
                                let property = entity.properties[j];
                                formattedEntity.properties[property.name] = property.type;
                            }
                        }
                        this.dataSchema.entities[entity.name] = formattedEntity;
                    }
                }
            }
        }
    }

    parseDataTypes() {
        this.dataTypes = {
            types: {}
        };
        for (let key in this.schema.types) {
            if (this.schema.types.hasOwnProperty(key)) {
                let type = this.schema.types[key];
                let formattedType = {
                    class: type.class || 'java.lang.String',
                    validateFunctions: type.validateFunctions || undefined
                };
                this.dataTypes.types[type.type] = formattedType;
            }
        }
        for (let key in this.schema.nodes._data) {
            if (this.schema.nodes._data.hasOwnProperty(key)) {
                let node = this.schema.nodes._data[key];
                let formattedNode = {
                    class: node.class || 'java.lang.String',
                    validateFunctions: node.validateFunctions || undefined
                };
                this.dataTypes.types[node.label] = formattedNode;
            }
        }
    }

    parseStoreTypes() {
        this.storeTypes = {
            types: {}
        };
        for (let key in this.schema.types) {
            if (this.schema.types.hasOwnProperty(key)) {
                let type = this.schema.types[key];
                if (type.aggregateFunction !== null || type.serialiserClass !== null) {
                    let formattedType = {
                        aggregateFunction: type.aggregateFunction || null,
                        serialiserClass: type.serialiserClass || null
                    };
                    this.storeTypes.types[type.type] = formattedType;
                }
            }
        }
    }

    constructor(private storage: LocalStorageService, private gafferService: GafferService) { }

    ngOnInit() {
        let storedNodes = this.storage.retrieve('graphNodes');
        let storedEdges = this.storage.retrieve('graphEdges');
        let storedTypes = this.storage.retrieve('types');
        this.schema = {
            nodes: storedNodes,
            edges: storedEdges,
            types: storedTypes
        };
        if (storedEdges !== null && storedNodes !== null) {
            this.parseDataSchema();
            this.parseDataTypes();
            this.parseStoreTypes();
            this.gafferService.validateSchema(this.dataSchema, this.dataTypes, this.storeTypes)
                .subscribe(
                validation => this.validation = validation,
                error => this.errorMessage = <any>error);
        }
    }
}
