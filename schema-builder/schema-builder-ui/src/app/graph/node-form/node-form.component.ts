import { Component, OnInit, Input } from '@angular/core';
import { LocalStorageService } from 'ng2-webstorage';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import * as _ from 'lodash';
declare var $: any;

@Component({
    selector: 'app-node-form',
    templateUrl: './node-form.component.html',
    styleUrls: ['./node-form.component.css'],
    providers: [FormBuilder]
})
export class NodeFormComponent implements OnInit {
    _node: any;
    _nodes: any;
    _network: any;
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
