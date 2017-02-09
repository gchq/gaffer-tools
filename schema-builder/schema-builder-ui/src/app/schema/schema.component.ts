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

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
    errorMessageURL: any;
    successURL: any;

    edgesById: any;
    edgesByName: any;
    nodesById: any;
    nodesByName: any;

    schemaUrl: string;

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
                _.forEach(edge.properties, (property: any) => {
                    formattedEdge.properties[property.name] = property.type;
                });
                this.dataSchema.edges[edge.label] = formattedEdge;
            });
        }
        if (this.schema.hasOwnProperty('nodes')) {
            _.forEach(this.schema.nodes._data, (node: any) => {
                _.forEach(node.entities, (entity: any) => {
                    let formattedEntity = {
                        vertex: node.label,
                        properties: {}
                    };
                    _.forEach(entity.properties, (property: any) => {
                        formattedEntity.properties[property.name] = property.type;
                    });
                    this.dataSchema.entities[entity.name] = formattedEntity;
                });
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

    clearSchema() {
        this.storage.clear();
        this.ngOnInit();
        this.dataSchema = undefined;
        this.dataTypes = undefined;
        this.storeTypes = undefined;
    }

    enableEditMode(key: string) {
        this.editing[key] = true;
        $('#' + key + 'TextArea').trigger('input');
    }

    updateDataSchema(input) {
        let editedText;
        if (input) {
            editedText = input;
        } else {
            try {
                editedText = JSON.parse($('#dataSchemaTextArea').val());
            } catch (e) {
                editedText = undefined;
                this.errors.dataSchema = 'Failed to parse JSON: ' + e.message;
            }
        }
        if (editedText) {
            let edges = new vis.DataSet();
            let nodes = new vis.DataSet();
            let newNodes = [];
            let newEdges = [];
            this.errors.dataSchema = undefined;
            if (editedText.edges) {
                _.forEach(editedText.edges, (editedEdge: any, edgeName) => {
                    let fromId;
                    let toId;
                    if (!_.some(newNodes, { label: editedEdge.source })) {
                        fromId = UUID.UUID();
                        newNodes.push({
                            id: fromId,
                            entities: [],
                            label: editedEdge.source
                        });
                    } else {
                        fromId = _.find(newNodes, { label: editedEdge.source }).id;
                    }
                    if (!_.some(newNodes, { label: editedEdge.destination })) {
                        toId = UUID.UUID();
                        newNodes.push({
                            id: toId,
                            entities: [],
                            label: editedEdge.destination
                        });
                    } else {
                        toId = _.find(newNodes, { label: editedEdge.destination }).id;
                    }
                    let props = [];
                    _.forEach(editedEdge.properties, (value: string, name) => {
                        props.push({
                            id: UUID.UUID(),
                            name: name,
                            type: value
                        });
                    });
                    newEdges.push({
                        id: UUID.UUID(),
                        from: fromId,
                        label: edgeName,
                        properties: props,
                        length: 200,
                        arrows: 'to',
                        to: toId
                    });
                });
            }
            if (editedText.entities) {
                _.forEach(editedText.entities, (editedEntity: any, entityName) => {
                    let nodeId;
                    let props = [];
                    _.forEach(editedEntity.properties, (value: string, name) => {
                        props.push({
                            id: UUID.UUID(),
                            name: name,
                            type: value
                        });
                    });
                    if (!_.some(newNodes, { label: editedEntity.vertex })) {
                        nodeId = UUID.UUID();
                        let newNode = {
                            id: nodeId,
                            entities: [],
                            label: editedEntity.vertex
                        };
                        newNode.entities.push({
                            id: UUID.UUID(),
                            name: entityName,
                            properties: props
                        });
                        newNodes.push(newNode);
                    } else {
                        _.forEach(newNodes, (node: any) => {
                            if (node.label === editedEntity.vertex) {
                                node.entities.push({
                                    id: UUID.UUID(),
                                    name: entityName,
                                    properties: props
                                });
                            }
                        });
                    }
                });
            }
            nodes.add(newNodes);
            edges.add(newEdges);
            this.storage.store('graphNodes', nodes);
            this.storage.store('graphEdges', edges);
            this.editing.dataSchema = false;
            this.ngOnInit();
        }
    }

    updateDataTypes(input) {
        let editedText;
        if (input) {
            editedText = input;
        } else {
            try {
                editedText = JSON.parse($('#dataTypesTextArea').val());
            } catch (e) {
                editedText = undefined;
                this.errors.dataTypes = 'Failed to parse JSON: ' + e.message;
            }
        }
        if (editedText) {
            let storedNodes = this.storage.retrieve('graphNodes');
            let newTypes = [];
            if (editedText.types) {
                _.forEach(editedText.types, (editedType: any, typeName) => {
                    let found = false;
                    _.forEach(storedNodes._data, (storedNode: any, storedId) => {
                        if (storedNode.label === typeName) {
                            storedNode.class = editedType.class;
                            storedNode.validateFunctions = editedText.validateFunctions;
                            found = true;
                        }
                    });
                    if (!found) {
                        newTypes.push({
                            class: editedType.class,
                            type: typeName,
                            validateFunctions: editedType.validateFunctions
                        });
                    }
                });
                this.storage.store('graphNodes', storedNodes);
                this.storage.store('types', newTypes);
                this.updateStoreTypes(undefined);
                this.editing.dataTypes = false;
            }
        }
    }

    updateStoreTypes(input) {
        let editedText;
        if (input) {
            editedText = input;
        } else {
            try {
                editedText = JSON.parse($('#storeTypesTextArea').val());
            } catch (e) {
                editedText = undefined;
                this.errors.storeTypes = 'Failed to parse JSON: ' + e.message;
            }
        }
        if (editedText && editedText.types) {
            let storedTypes = this.storage.retrieve('types');
            _.forEach(editedText.types, (editedType: any, typeName) => {
                let existingType = _.find(storedTypes, { type: typeName });
                if (existingType) {
                    existingType = _.merge(existingType, editedType);
                }
            });
            this.storage.store('types', storedTypes);
            this.editing.storeTypes = false;
            this.ngOnInit();
        }
    }

    setupNodeLookups() {
        let nodesById = {};
        let storedNodes = this.storage.retrieve('graphNodes');
        if (storedNodes) {
            _.forEach(storedNodes._data, (storedNode: any, storedId) => {
                nodesById[storedId] = storedNode.label;
            });
        }
        this.nodesById = nodesById;
    }

    loadFromUrl() {
        this.successURL = undefined;
        this.gafferService.getSchemaFromURL(this.schemaUrl)
            .subscribe(
                result => this.formatSchemaResult(result),
                error => this.errorMessageURL = <any>error);
    }

    schemaUrlChanged() {
        if (this.schemaUrl.length === 0) {
            this.storage.clear('schemaURL');
            this.router.navigate(['/schema']);
        }
    }

    formatSchemaResult(result) {
        this.errorMessageURL = undefined;
        this.errorMessage = undefined;
        this.router.navigate(['/schema', { url: this.schemaUrl }]);
        if (result.hasOwnProperty('types') && result.hasOwnProperty('edges')) {
            this.updateDataSchema(result);
            this.updateDataTypes(result);
            this.updateStoreTypes(result);
        }
        this.successURL = 'Successfully loaded schema from URL';
    }

    constructor(private storage: LocalStorageService, private gafferService: GafferService,
                private router: Router, private route: ActivatedRoute) { }

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
        };
        this.editing = {
            dataSchema: false,
            dataTypes: false,
            storeTypes: false
        };
        this.schemaUrl = '';
        this.route.params.distinctUntilChanged().subscribe((routeParams: any) => {
            if (routeParams.hasOwnProperty('url')) {
                this.schemaUrl = routeParams.url;
                this.storage.store('schemaURL', routeParams.url);
            } else {
                let storedSchemaUrl = this.storage.retrieve('schemaURL');
                if (storedSchemaUrl && storedSchemaUrl !== null) {
                    this.schemaUrl = this.storage.retrieve('schemaURL');
                    this.router.navigate(['/schema', { url: this.schemaUrl }]);
                }
            }
        });
        this.setupNodeLookups();
        $('textarea').each(function () {
            this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
        }).on('input', function () {
            setTimeout(() => {
                this.style.height = (this.scrollHeight) + 'px';
            }, 100);
        });
        if (storedEdges !== null && storedNodes !== null) {
            this.parseDataSchema();
            this.parseDataTypes();
            this.parseStoreTypes();
            this.validation = undefined;
            this.errorMessage = undefined;
            this.gafferService.validateSchema(this.dataSchema, this.dataTypes, this.storeTypes)
                .subscribe(
                validation => this.validation = validation,
                error => this.errorMessage = <any>error);
        }
    }
}
