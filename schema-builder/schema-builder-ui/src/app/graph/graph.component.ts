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

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DataSet, Network, Node, Edge, Options } from 'vis';
import { LocalStorageService } from 'ng2-webstorage';
import * as _ from 'lodash';
declare const vis: any;

export interface DataContainer {
    nodes: DataSet<Node>,
    edges: DataSet<Edge>
}

@Component({
    selector: 'app-graph',
    templateUrl: './graph.component.html',
    styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
    nodes: DataSet<Node>;
    edges: DataSet<Edge>;
    network: Network;
    container: any;
    data: DataContainer;
    options: Options;
    selectedNode: Observable<string>;
    selectedEdge: Observable<string>;

    constructor(private storage: LocalStorageService) { }

    selectNode(params) {
        this.selectedNode = params.nodes[0];
    }

    deselectNode() {
        this.selectedNode = undefined;
    }

    selectEdge(params) {
        this.selectedEdge = params.edges[0];
    }

    deselectEdge() {
        this.selectedEdge = undefined;
    }

    saveNodes(data, callback) {
        if (data.label === 'new') {
            data.label = 'node ' + (this.nodes.get().length + 1);
        }
        callback(data);
        this.storage.store('graphEdges', this.edges);
        this.storage.store('graphNodes', this.nodes);
    }

    saveEdges(data, callback) {
        if (data.to !== undefined) {
            data.length = 200;
            data.arrows = 'to';
            if (data.label === undefined) {
                data.label = 'edge ' + (this.edges.get().length + 1);
            }
        }
        callback(data);
        this.storage.store('graphEdges', this.edges);
        this.storage.store('graphNodes', this.nodes);
    }

    ngOnInit() {
        const storedNodes = this.storage.retrieve('graphNodes');
        if (storedNodes !== null) {
            const nodeArray = [];
            _.forEach(storedNodes._data, (storedNode: any) => {
                nodeArray.push(storedNode);
            });
            this.nodes = new vis.DataSet(nodeArray);
        } else {
            this.nodes = new vis.DataSet();
        }

        const storedEdges = this.storage.retrieve('graphEdges');
        if (storedEdges !== null) {
            const edgeArray = [];
            _.forEach(storedEdges._data, (storedEdge: any) => {
                edgeArray.push(storedEdge);
            });
            this.edges = new vis.DataSet(edgeArray);
        } else {
            this.edges = new vis.DataSet();
        }

        this.container = document.getElementById('schema-graph');
        this.data = {
            nodes: this.nodes,
            edges: this.edges
        };
        this.options = {
            nodes: {
                shape: 'dot',
                size: 18,
                font: {
                    size: 16
                },
                borderWidth: 2,
                shadow: true
            },
            edges: {
                width: 2,
                shadow: true
            },
            autoResize: true,
            height: '600px',
            manipulation: {
                enabled: true,
                initiallyActive: true,
                addNode: (data, callback) => this.saveNodes(data, callback),
                addEdge: (data, callback) => this.saveEdges(data, callback),
                editEdge: (data, callback) => this.saveEdges(data, callback),
                deleteNode: (data, callback) => this.saveNodes(data, callback),
                deleteEdge: (data, callback) => this.saveEdges(data, callback),
                controlNodeStyle: {}
            }
        };

        this.network = new vis.Network(this.container, this.data, this.options);
        this.network.on('selectNode', params => this.selectNode(params));
        this.network.on('selectEdge', params => this.selectEdge(params));
        this.network.on('deselectNode', params => this.deselectNode());
        this.network.on('deselectEdge', params => this.deselectEdge());
    }

}
