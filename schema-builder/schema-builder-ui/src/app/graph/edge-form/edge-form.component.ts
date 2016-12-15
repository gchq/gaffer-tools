import { Component, OnInit, Input } from '@angular/core';
import { LocalStorageService } from 'ng2-webstorage';
import { UUID } from 'angular2-uuid';

@Component({
    selector: 'app-edge-form',
    templateUrl: './edge-form.component.html',
    styleUrls: ['./edge-form.component.css']
})
export class EdgeFormComponent implements OnInit {
    _edge: any;
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
        this.nodeOptions = nodes.get();
    }
    get nodes() { return this._nodes; }

    @Input()
    set selectedEdge(selectedEdge: any) {
        this._edge = this._edges.get(selectedEdge);
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

    save(isValid: boolean, e: any) {
        if (!isValid) {
            return;
        }
        this._edges.update(this._edge);
        this.storage.store('graphEdges', this._edges);
    }
}
