import { Component, OnInit, Input } from '@angular/core';
import { LocalStorageService } from 'ng2-webstorage';
declare var $: any;

@Component({
  selector: 'app-node-form',
  templateUrl: './node-form.component.html',
  styleUrls: ['./node-form.component.css']
})
export class NodeFormComponent implements OnInit {
  _node: any;
  _nodes: any;
  _network: any;

  @Input()
  set nodes(nodes: any) {
    this._nodes = nodes;
  }
  get nodes() { return this._nodes; }

  @Input()
  set selectedNode(selectedNode: any) {
    this._node = this._nodes.get(selectedNode);
  }

  @Input()
  set network(network: any) {
    this._network = network;
  }

  constructor(private storage: LocalStorageService) {}

  ngOnInit() {

  }

  changeNode(value: any, key: any) {
    this._node[key] = value;
  }

  save(isValid: boolean, e: any) {
    if (!isValid) {
      return;
    }
    this._nodes.update(this._node);
    this.storage.store('graphNodes', this._nodes);
  }
}
