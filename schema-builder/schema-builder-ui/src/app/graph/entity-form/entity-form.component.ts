import { Component, OnInit, Input } from '@angular/core';
import { LocalStorageService } from 'ng2-webstorage';
import { UUID } from 'angular2-uuid';

declare var $: any;

@Component({
    selector: 'app-entity-form',
    templateUrl: './entity-form.component.html',
    styleUrls: ['./entity-form.component.css']
})
export class EntityFormComponent implements OnInit {
    _node: any;
    _nodes: any;
    _storedTypes: any;
    entities: any;

    @Input()
    set nodes(nodes: any) {
        this._nodes = nodes;
    }
    get nodes() { return this._nodes; }

    @Input()
    set selectedNode(selectedNode: any) {
        this._node = this._nodes.get(selectedNode);
        this.entities = this._node.entities || [];
    }

    constructor(private storage: LocalStorageService) { }

    ngOnInit() {
        this._storedTypes = this.storage.retrieve('types');
    }

    changeNode(value: any, key: any) {
        this._node[key] = value;
    }

    addNewEntity() {
        let uuid = UUID.UUID();
        this.entities.push({
            id: uuid,
            name: 'New Entity',
            properties: []
        });
    }

    addNewEntityProperty(entity) {
        let uuid = UUID.UUID();
        entity.properties.push({
            id: uuid,
            name: 'New Property',
            type: this._storedTypes[0].type || 'string'
        })
    }

    save() {
        this._node.entities = this.entities;
        this._nodes.update(this._node);
        this.storage.store('graphNodes', this._nodes);
    }
}
