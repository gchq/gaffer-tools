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
import { LocalStorageService } from 'ng2-webstorage';
import { DataSet, Edge } from 'vis';
import { GraphQLType } from '../shared/graphql-type.interface';
import { GraphQLNode } from '../shared/graphql-node.interface';
import * as _ from 'lodash';

@Component({
    selector: 'app-properties',
    templateUrl: './properties.component.html',
    styleUrls: ['./properties.component.css']
})
export class PropertiesComponent implements OnInit {
    edges: Array<Edge>;
    nodes: Array<GraphQLNode>;
    types: Array<GraphQLType>;

    constructor(private storage: LocalStorageService) { }

    ngOnInit() {
        this.types = this.storage.retrieve('types');
        const storedEdges = this.storage.retrieve('graphEdges');
        if (storedEdges !== null) {
            this.edges = [];
            _.forEach(storedEdges._data, (edge: any, key) => {
                edge.id = key;
                this.edges.push(edge);
            });
        }
        const storedNodes = this.storage.retrieve('graphNodes');
        if (storedNodes !== null) {
            this.nodes = [];
            _.forEach(storedNodes._data, (node: any, key) => {
                node.id = key;
                this.nodes.push(node);
            });
        }
    }

    edgePropertiesChanged(event) {
        const storedEdges = this.storage.retrieve('graphEdges');
        _.forEach(storedEdges._data, (edge: any) => {
            if (edge.id === event.value.id) {
                edge.properties = event.value.properties;
                edge.editing = false;
            }
        });
        this.storage.store('graphEdges', storedEdges);
    }

    entityPropertiesChanged(event) {
        const storedNodes = this.storage.retrieve('graphNodes');
        _.forEach(storedNodes._data, (node: any) => {
            _.forEach(node.entities, (entity: any) => {
                if (entity.id === event.value.id) {
                    entity.properties = event.value.properties;
                    entity.editing = false;
                }
            });
        });
        this.storage.store('graphNodes', storedNodes);
    }

}
