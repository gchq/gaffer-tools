import { Component, OnInit, Input } from '@angular/core';
import { LocalStorageService } from 'ng2-webstorage';
import { FormBuilder } from '@angular/forms';
import { UUID } from 'angular2-uuid';
import * as _ from 'lodash';

declare var $: any;

@Component({
    selector: 'app-entity-form',
    templateUrl: './entity-form.component.html',
    styleUrls: ['./entity-form.component.css'],
    providers: [FormBuilder]
})
export class EntityFormComponent implements OnInit {
    _node: any;
    _nodes: any;
    _storedTypes: any;
    entities: any;
    form: any;

    @Input()
    set nodes(nodes: any) {
        this._nodes = nodes;
    }
    get nodes() { return this._nodes; }

    @Input()
    set selectedNode(selectedNode: any) {
        this._node = this._nodes.get(selectedNode);
        this.entities = this._node.entities || [];
        this.updateForm(this.entities);
    }

    constructor(private storage: LocalStorageService, private formBuilder: FormBuilder) { }

    ngOnInit() {
        this._storedTypes = this.storage.retrieve('types');
    }

    updateForm(entities: any) {
        let formObject = {};
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
        let uuid = UUID.UUID();
        this.entities.push({
            id: uuid,
            name: 'New Entity',
            properties: []
        });
        this.updateForm(this.entities);
    }

    removeEntity(entityId) {
        this.entities = _.filter(this.entities, (entity: any) => {
            return entity.id !== entityId;
        });
        this.updateForm(this.entities);
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
