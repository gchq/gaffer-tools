import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ng2-webstorage';
import { GafferService } from '../services/gaffer.service';
import { UUID } from 'angular2-uuid';
import * as _ from 'lodash';

declare var $: any;
declare var vis: any;

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

    edgesById: any;
    edgesByName: any;
    nodesById: any;
    nodesByName: any;

    errors: any;
    editing: any;

    parseDataSchema() {
        this.dataSchema = {
            edges: {},
            entities: {}
        };
        if (this.schema.hasOwnProperty('edges')) {
            _.forEach(this.schema.edges._data, (edge: any) => {
                let directed = 'true';
                if (edge.arrows !== 'to') {
                    directed = 'false';
                }
                let formattedEdge = {
                    source: this.nodesById[edge.from],
                    destination: this.nodesById[edge.to],
                    directed: directed,
                    properties: {}
                };
                if (edge.hasOwnProperty('properties')) {
                    for (let j = 0; j < edge.properties.length; j++) {
                        let property = edge.properties[j];
                        formattedEdge.properties[property.name] = property.type;
                    }
                }
                this.dataSchema.edges[edge.label] = formattedEdge;
            });
        }
        if (this.schema.hasOwnProperty('nodes')) {
            _.forEach(this.schema.nodes._data, (node: any) => {
                if (node.entities) {
                    for (let i = 0; i < node.entities.length; i++) {
                        let entity = node.entities[i];
                        let formattedEntity = {
                            vertex: node.label,
                            properties: {}
                        }
                        if (entity.hasOwnProperty('properties')) {
                            for (let j = 0; j < entity.properties.length; j++) {
                                let property = entity.properties[j];
                                formattedEntity.properties[property.name] = property.type;
                            }
                        }
                        this.dataSchema.entities[entity.name] = formattedEntity;
                    }
                }
            });
        }
    }

    parseDataTypes() {
        this.dataTypes = {
            types: {}
        };
        if (this.schema.hasOwnProperty('types')) {
            _.forEach(this.schema.types, (type: any) => {
                let formattedType = {
                    class: type.class || 'java.lang.String',
                    validateFunctions: type.validateFunctions || undefined
                };
                this.dataTypes.types[type.type] = formattedType;
            });
        }
        if (this.schema.hasOwnProperty('nodes')) {
            _.forEach(this.schema.nodes._data, (node: any) => {
                let formattedNode = {
                    class: node.class || 'java.lang.String',
                    validateFunctions: node.validateFunctions || undefined
                };
                this.dataTypes.types[node.label] = formattedNode;
            });
        }
    }

    parseStoreTypes() {
        this.storeTypes = {
            types: {}
        };
        if (this.schema.hasOwnProperty('types')) {
            _.forEach(this.schema.types, (type: any) => {
                if (type.aggregateFunction !== null || type.serialiserClass !== null) {
                    let formattedType = {
                        aggregateFunction: type.aggregateFunction || null,
                        serialiserClass: type.serialiserClass || null
                    };
                    this.storeTypes.types[type.type] = formattedType;
                }
            });
        }
    }

    updateDataSchema() {
        let editedText;
        try {
            editedText = JSON.parse($('#dataSchemaTextArea').val());
        } catch (e) {
            editedText = undefined;
            this.errors.dataSchema = 'Failed to parse JSON: ' + e.message;
        }
        if (editedText) {
            this.setupEdgeLookups();
            this.setupNodeLookups();
            let edges = new vis.DataSet();
            let nodes = new vis.DataSet();
            let newNodes = [];
            let newEdges = [];
            this.errors.dataSchema = undefined;
            if (editedText.edges) {
                _.forEach(editedText.edges, (editedEdge: any, edgeName) => {
                    let fromId;
                    let toId;
                    if (!_.some(newNodes, {label: editedEdge.source})) {
                        fromId = UUID.UUID();
                        newNodes.push({
                            id: fromId,
                            label: editedEdge.source
                        });
                    } else {
                        fromId = _.find(newNodes, {label: editedEdge.source}).id;
                    }
                    if (!_.some(newNodes, {label: editedEdge.destination})) {
                        toId = UUID.UUID();
                        newNodes.push({
                            id: toId,
                            label: editedEdge.destination
                        });
                    } else {
                        toId = _.find(newNodes, {label: editedEdge.destination}).id;
                    }
                    let edgeId = 
                    newEdges.push({
                        id: UUID.UUID(),
                        from: fromId,
                        label: edgeName,
                        arrows: 'to',
                        to: toId
                    });
                });
            }
            nodes.add(newNodes);
            edges.add(newEdges);
            this.storage.store('graphNodes', nodes);
            this.storage.store('graphEdges', edges);
            this.editing.dataSchema = false;
        }
    }

    setupEdgeLookups() {
        let edgesByName = {};
        let edgesById = {};
        let storedEdges = this.storage.retrieve('graphEdges');
        _.forEach(storedEdges._data, (storedEdge: any, storedId) => {
            edgesById[storedId] = storedEdge.label;
            edgesByName[storedEdge.label] = storedId;
        });
        this.edgesById = edgesById;
        this.edgesByName = edgesByName;
    }

    setupNodeLookups() {
        let nodesByName = {};
        let nodesById = {};
        let storedNodes = this.storage.retrieve('graphNodes');
        _.forEach(storedNodes._data, (storedNode: any, storedId) => {
            nodesById[storedId] = storedNode.label;
            nodesByName[storedNode.label] = storedId;
        });
        this.nodesById = nodesById;
        this.nodesByName = nodesByName;
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
        this.errors = {
            dataSchema: undefined,
            dataTypes: undefined,
            storeTypes: undefined
        }
        this.editing = {
            dataSchema: false,
            dataTypes: false,
            storeTypes: false
        }
        this.setupEdgeLookups();
        this.setupNodeLookups();
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
