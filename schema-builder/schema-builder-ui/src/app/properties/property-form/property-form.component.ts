import { Component, OnInit, Input } from '@angular/core';
import { LocalStorageService } from 'ng2-webstorage';
import { UUID } from 'angular2-uuid';
import * as _ from 'lodash';

@Component({
    selector: 'app-property-form',
    templateUrl: './property-form.component.html',
    styleUrls: ['./property-form.component.css']
})
export class PropertyFormComponent implements OnInit {
    _edge: any;
    _entity: any;
    _edges: any;
    _nodes: any;
    _network: any;
    _storedTypes: any;
    nodeOptions: any;

    @Input()
    set edges(edges: any) {
        this._edges = edges;
    }
    get edges() { return this._edges; }

    @Input()
    set nodes(nodes: any) {
        this._nodes = nodes;
    }
    get nodes() { return this._nodes; }

    @Input()
    set selectedEdge(selectedEdge: any) {
        _.forEach(this._edges, (edge: any) => {
            if (edge.id === selectedEdge) {
                this._edge = edge;
            }
        });
    }

    @Input()
    set selectedEntity(selectedEntity: any) {
        _.forEach(this._nodes._data, (node: any) => {
            _.forEach(node.entities, (entity: any) => {
                if (entity.id === selectedEntity) {
                    this._entity = entity;
                }
            });
        });
    }

    @Input()
    set network(network: any) {
        this._network = network;
    }

    constructor(private storage: LocalStorageService) { }

    ngOnInit() {
        this._storedTypes = this.storage.retrieve('types');
    }

    changeEdge(value: any, key: any) {
        this._edge[key] = value;
    }

    addNewProperty() {
        let uuid = UUID.UUID();
        if (!this._edge.properties) {
            this._edge.properties = [];
        }
        this._edge.properties.push({
            id: uuid,
            name: 'New Property',
            type: this._storedTypes[0].type || 'string'
        });
    }

    save(isValid: boolean, e: any) {
        if (!isValid) {
            return;
        }
        this.storage.store('graphEdges', this._edges);
    }
}