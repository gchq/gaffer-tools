import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { LocalStorageService } from 'ng2-webstorage';
import * as _ from 'lodash';
declare var vis: any;

@Component({
    selector: 'app-graph',
    templateUrl: './graph.component.html',
    styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
    nodes: any;
    edges: any;
    network: any;
    container: any;
    events: any;
    data: any;
    options: any;
    selectedNode: Observable<any>;
    selectedEdge: Observable<any>;

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
            data.label = 'node ' + (Object.keys(this.nodes._data).length + 1);
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
                data.label = 'edge ' + (Object.keys(this.edges._data).length + 1);
            }
        }
        callback(data);
        this.storage.store('graphEdges', this.edges);
        this.storage.store('graphNodes', this.nodes);
    }

    ngOnInit() {
        let storedNodes = this.storage.retrieve('graphNodes');
        if (storedNodes !== null) {
            let nodeArray = [];
            _.forEach(storedNodes._data, (storedNode: any) => {
                nodeArray.push(storedNode);
            });
            this.nodes = new vis.DataSet(nodeArray);
        } else {
            this.nodes = new vis.DataSet();
        }

        let storedEdges = this.storage.retrieve('graphEdges');
        if (storedEdges !== null) {
            let edgeArray = [];
            _.forEach(storedEdges._data, (storedEdge: any) => {
                edgeArray.push(storedEdge);
            });
            this.edges = new vis.DataSet(edgeArray);
        } else {
            this.edges = new vis.DataSet();
        }

        this.container = document.getElementById('mynetwork');
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
                controlNodeStyle: {
                    // all node options are valid.
                }
            }
        };

        this.network = new vis.Network(this.container, this.data, this.options);
        this.events = 'test';

        this.network.on('click', function (params) {
            this.events = params;
        });
        this.network.on('doubleClick', function (params) {
            console.log(params);
        });
        this.network.on('oncontext', function (params) {
            console.log(params);
        });
        this.network.on('dragStart', function (params) {
            console.log(params);
        });
        this.network.on('dragging', function (params) {
            console.log(params);
        });
        this.network.on('dragEnd', function (params) {
            console.log(params);
        });
        this.network.on('zoom', function (params) {
            console.log(params);
        });
        this.network.on('showPopup', function (params) {
            console.log(params);
        });
        this.network.on('hidePopup', function (params) {
            console.log(params);
        });
        this.network.on('select', function (params) {
            console.log(params);
        });
        this.network.on('selectNode', params => this.selectNode(params));
        this.network.on('selectEdge', params => this.selectEdge(params));
        this.network.on('deselectNode', params => this.deselectNode());
        this.network.on('deselectEdge', params => this.deselectEdge());
        this.network.on('hoverNode', function (params) {
            console.log(params);
        });
        this.network.on('hoverEdge', function (params) {
            console.log(params);
        });
        this.network.on('blurNode', function (params) {
            console.log(params);
        });
        this.network.on('blurEdge', function (params) {
            console.log(params);
        });
    }

}
