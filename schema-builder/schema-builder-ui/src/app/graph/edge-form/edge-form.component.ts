import { Component, OnInit, Input } from '@angular/core';
import { LocalStorageService } from 'ng2-webstorage';
import { FormBuilder } from '@angular/forms';
import * as _ from 'lodash';

@Component({
    selector: 'app-edge-form',
    templateUrl: './edge-form.component.html',
    styleUrls: ['./edge-form.component.css'],
    providers: [FormBuilder]
})
export class EdgeFormComponent implements OnInit {
    _edge: any;
    _edges: any;
    _nodes: any;
    _network: any;
    _storedTypes: any;
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
    set selectedEdge(selectedEdge: any) {
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
