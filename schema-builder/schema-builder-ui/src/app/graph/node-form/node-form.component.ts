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
import { FormBuilder } from '@angular/forms';
import * as _ from 'lodash';
declare const $: any;

@Component({
    selector: 'app-node-form',
    templateUrl: './node-form.component.html',
    styleUrls: ['./node-form.component.css'],
    providers: [FormBuilder]
})
export class NodeFormComponent implements OnInit {
    _node: any;
    _nodes: DataSet<GraphQLNode>;
    _network: Network;
    form: any;

    @Input()
    set nodes(nodes: any) {
        this._nodes = nodes;
    }
    get nodes() { return this._nodes; }

    @Input()
    set selectedNode(selectedNode: any) {
        this._node = this._nodes.get(selectedNode);
        this.updateForm(this._node);
    }

    @Input()
    set network(network: any) {
        this._network = network;
    }

    constructor(private storage: LocalStorageService, private formBuilder: FormBuilder) {}

    ngOnInit() {
        this.form.valueChanges
            .debounceTime(400)
            .distinctUntilChanged()
            .subscribe((data) => this.save(data));
    }

    updateForm(node: any) {
        this.form = this.formBuilder.group({
            label: node.label
        });
    }

    save(data) {
        this._node = _.merge(this._node, data);
        this._nodes.update(this._node);
        this.storage.store('graphNodes', this._nodes);
    }
}
