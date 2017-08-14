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

import { Component, OnInit, Input } from '@angular/core';
import { LocalStorageService } from 'ng2-webstorage';
import { DataSet, Network } from 'vis';
import { GraphQLNode } from '../../shared/graphql-node.interface';
import { GraphQLEdge } from '../../shared/graphql-edge.interface';
import { GraphQLType } from '../../shared/graphql-type.interface';
import { FormBuilder } from '@angular/forms';
import * as _ from 'lodash';

@Component({
    selector: 'app-edge-form',
    templateUrl: './edge-form.component.html',
    styleUrls: ['./edge-form.component.css'],
    providers: [FormBuilder]
})
export class EdgeFormComponent implements OnInit {
    _edge: GraphQLEdge;
    _edges: DataSet<GraphQLEdge>;
    _nodes: DataSet<GraphQLNode>;
    _network: Network;
    _storedTypes: Array<GraphQLType>;
    nodeOptions: any;
    form: any;

    @Input()
    set edges(edges: any) {
        this._edges = edges;
    }
    get edges() { return this._edges; }

    @Input()
    set nodes(nodes: any) {
        this._nodes = nodes;
        this.nodeOptions = nodes.get();
    }
    get nodes() { return this._nodes; }

    @Input()
    set selectedEdge(selectedEdge: string) {
        this._edge = this._edges.get(selectedEdge);
        this.updateForm(this._edge);
    }

    @Input()
    set network(network: any) {
        this._network = network;
    }

    constructor(private storage: LocalStorageService, private formBuilder: FormBuilder) { }

    ngOnInit() {
        this._storedTypes = this.storage.retrieve('types');
        this.form.valueChanges
            .debounceTime(400)
            .distinctUntilChanged()
            .subscribe((data) => this.save(data));
    }

    updateForm(edge: any) {
        this.form = this.formBuilder.group({
            from: edge.from,
            to: edge.to,
            label: edge.label,
            arrows: edge.arrows
        });
    }

    changeEdge(value: any, key: any) {
        this._edge[key] = value;
    }

    save(data) {
        this._edge = _.merge(this._edge, data);
        this._edges.update(this._edge);
        this.storage.store('graphEdges', this._edges);
    }
}
