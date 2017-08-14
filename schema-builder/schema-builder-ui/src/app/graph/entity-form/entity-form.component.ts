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
import { FormBuilder } from '@angular/forms';
import { DataSet, Network } from 'vis';
import { GraphQLNode } from '../../shared/graphql-node.interface';
import { GraphQLEntity } from '../../shared/graphql-entity.interface';
import { GraphQLType } from '../../shared/graphql-type.interface';
import { UUID } from 'angular2-uuid';
import * as _ from 'lodash';

declare const $: any;

@Component({
    selector: 'app-entity-form',
    templateUrl: './entity-form.component.html',
    styleUrls: ['./entity-form.component.css'],
    providers: [FormBuilder]
})
export class EntityFormComponent implements OnInit {
    _node: GraphQLNode;
    _nodes: DataSet<GraphQLNode>;
    _storedTypes: Array<GraphQLType>;
    entities: Array<GraphQLEntity>;
    form: any;

    @Input()
    set nodes(nodes: any) {
        this._nodes = nodes;
    }
    get nodes() { return this._nodes; }

    @Input()
    set selectedNode(selectedNode: string) {
        this._node = this._nodes.get(selectedNode);
        this.entities = this._node.entities || [];
        this.updateForm(this.entities);
    }

    constructor(private storage: LocalStorageService, private formBuilder: FormBuilder) { }

    ngOnInit() {
        this._storedTypes = this.storage.retrieve('types');
    }

    updateForm(entities: any) {
        const formObject = {};
        _.forEach(entities, (entity: any) => {
            formObject[entity.id] = entity.name;
        });
        this.form = this.formBuilder.group(formObject);
        this.form.valueChanges
            .debounceTime(400)
            .distinctUntilChanged()
            .subscribe((data) => this.save(data));
    }

    addNewEntity() {
        const uuid = UUID.UUID();
        this.entities.push({
            id: uuid,
            name: 'New Entity',
            properties: []
        });
        this.updateForm(this.entities);
        this.save(this.form._value);
    }

    removeEntity(entityId) {
        this.entities = _.filter(this.entities, (entity: any) => {
            return entity.id !== entityId;
        });
        this.updateForm(this.entities);
        this.save(this.form._value);
    }

    save(data) {
        _.forEach(this.entities, (entity: any) => {
            entity.name = data[entity.id];
        });
        this._node.entities = this.entities;
        this._nodes.update(this._node);
        this.storage.store('graphNodes', this._nodes);
    }
}
