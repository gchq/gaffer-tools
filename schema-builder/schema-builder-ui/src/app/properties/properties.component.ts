import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ng2-webstorage';
import * as _ from 'lodash';

@Component({
    selector: 'app-properties',
    templateUrl: './properties.component.html',
    styleUrls: ['./properties.component.css']
})
export class PropertiesComponent implements OnInit {
    edges: any;
    nodes: any;
    types: any;

    constructor(private storage: LocalStorageService) { }

    ngOnInit() {
        this.types = this.storage.retrieve('types');
        let storedEdges = this.storage.retrieve('graphEdges');
        if (storedEdges !== null) {
            this.edges = [];
            _.forEach(storedEdges._data, (edge: any, key) => {
                edge.id = key;
                this.edges.push(edge);
            });
        }
        let storedNodes = this.storage.retrieve('graphNodes');
        if (storedNodes !== null) {
            this.nodes = [];
            _.forEach(storedNodes._data, (node: any, key) => {
                node.id = key;
                this.nodes.push(node);
            });
        }
    }

    addNewEntity() {
        // let uuid = UUID.UUID();
        // this.entities.push({
        //     id: uuid,
        //     name: 'New Entity',
        //     properties: []
        // });
    }

    edgePropertiesChanged(event) {
        let storedEdges = this.storage.retrieve('graphEdges');
        _.forEach(storedEdges._data, (edge: any) => {
            if (edge.id === event.value.id) {
                edge.properties = event.value.properties;
                edge.editing = false;
            }
        });
        this.storage.store('graphEdges', storedEdges);
    }

    entityPropertiesChanged(event) {
        let storedNodes = this.storage.retrieve('graphNodes');
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
