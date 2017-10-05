'use strict'

angular.module('app').factory('graph', ['schema', 'types', '$q', function(schema, types, $q) {

    var graphCy;
    var graph = {};

    graph.selectedEntities = {}
    graph.selectedEdges = {}
    graph.relatedEntities = []
    graph.relatedEdges = []


    graph.graphData = {entities: {}, edges: {}, entitySeeds: {}}

    graph.listeners = {};

    graph.load = function() {
        var deferred = $q.defer();
        graphCy = cytoscape({
            container: $('#graphCy')[0],
            style: [
                {
                    selector: 'node',
                    style: {
                        'content': 'data(label)',
                        'text-valign': 'center',
                        'background-color': 'data(color)',
                        'font-size': 14,
                        'color': '#fff',
                        'text-outline-width':1,
                        'width': 'data(radius)',
                        'height': 'data(radius)'
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'curve-style': 'bezier',
                        'label': 'data(group)',
                        'line-color': '#79B623',
                        'target-arrow-color': '#79B623',
                        'target-arrow-shape': 'triangle',
                        'font-size': 14,
                        'color': '#fff',
                        'text-outline-width':1,
                        'width': 5
                    }
                },
                {
                    selector: ':selected',
                    css: {
                        'background-color': 'data(selectedColor)',
                        'line-color': '#35500F',
                        'target-arrow-color': '#35500F'
                    }
                }
            ],
            layout: {
                name: 'concentric'
            },
            elements: [],
            ready: function(){
                deferred.resolve( this );
            }
        });

        graphCy.on('select', function(evt){
            select(evt.cyTarget)
        });

        graphCy.on('unselect', function(evt){
            unSelect(evt.cyTarget)
        })

        return deferred.promise;
    }

    function updateRelatedEntities() {
        graph.relatedEntities = []
        for(var id in graph.selectedEntities) {
            var vertexType = graph.selectedEntities[id][0].vertexType
            for(var entityGroup in schema.getSchema().entities) {
                if(vertexType === "unknown") {
                     graph.relatedEntities.push(entityGroup)
                     fire('onRelatedEntitiesUpdate', [graph.relatedEntities])
                } else {
                    var entity = schema.getSchema().entities[entityGroup]
                    if(entity.vertex === vertexType
                        && graph.relatedEntities.indexOf(entityGroup) === -1) {
                        graph.relatedEntities.push(entityGroup)
                        fire('onRelatedEntitiesUpdate', [graph.relatedEntities])
                    }
                }
            }
        }

    }

    function updateRelatedEdges() {
        graph.relatedEdges = [];
        for(var id in graph.selectedEntities) {
            var vertexType = graph.selectedEntities[id][0].vertexType;
            for(var edgeGroup in schema.getSchema().edges) {
                var edge = schema.getSchema().edges[edgeGroup]
                if((edge.source === vertexType || edge.destination === vertexType)
                    && graph.relatedEdges.indexOf(edgeGroup) === -1) {
                    graph.relatedEdges.push(edgeGroup)
                    fire('onRelatedEdgesUpdate', [graph.relatedEdges])
                }
            }
        }
    }

    function select(element) {
        var _id = element.id()
        for (var id in graph.graphData.entities) {
            if(_id == id) {
                graph.selectedEntities[id] = graphData.entities[id]
                fire('onSelectedElementsUpdate'[{"entities": graph.selectedEntities, "edges": graph.selectedEdges}])
                updateRelatedEntities()
                updateRelatedEdges()
                return
            }
        }
        for (var id in graph.graphData.edges) {
         if(_id == id) {
             graph.selectedEdges[id] = graph.graphData.edges[id]
             fire('onSelectedElementsUpdate'[{"entities": graph.selectedEntities, "edges": graph.selectedEdges}])
             return
         }
        }
        graph.selectedEntities[_id] = [{vertexType: element.data().vertexType, vertex: _id}]
        fire('onSelectedElementsUpdate'[{"entities": graph.selectedEntities, "edges": graph.selectedEdges}])
        updateRelatedEntities()
        updateRelatedEdges()
    }

    function unSelect(element) {
        if(element.id() in graph.selectedEntities) {
            delete graph.selectedEntities[element.id()]
            updateRelatedEntities()
            updateRelatedEdges()

        } else if(element.id() in graph.selectedEdges) {
            delete graph.selectedEdges[element.id()]
        }

        fire('onSelectedElementsUpdate'[{"entities": graph.selectedEntities, "edges": graph.selectedEdges}])
    }

    graph.reload = function() {
        graph.load()
        updateGraph(graph.graphData)
    }

    graph.reset = function() {
        graph.selectedEdges = {}
        graph.selectedEntities = {}
        fire('onSelectedElementsUpdate'[{"entities": graph.selectedEntities, "edges": graph.selectedEdges}])
    }

    graph.addSeed = function(vt, v) {
        var entitySeed = { vertexType: vt, vertex: v }
        if(v in graph.graphData.entitySeeds) {
            if(!ObjectContainsValue(graph.graphData.entitySeeds[v], entitySeed)) {
                graph.graphData.entitySeeds[v].push(entitySeed);
            }
        } else {
            graph.graphData.entitySeeds[v] = [entitySeed];
        }

        updateGraph(graph.graphData)
    }

    graph.update = function(results) {
        var graphData = {entities: {}, edges: {}, entitySeeds: {}};
        for (var i in results.entities) {
            var entity = clone(results.entities[i]);
            entity.vertex = parseVertex(entity.vertex);
            var id = entity.vertex;
            entity.vertexType = schema.getVertexTypeFromEntityGroup(entity.group);
            if(id in graphData.entities) {
                if(!ObjectContainsValue(graphData.entities[id], entity)) {
                    graphData.entities[id].push(entity);
                }
            } else {
                graphData.entities[id] = [entity];
            }
        }

        for (var i in results.edges) {
            var edge = clone(results.edges[i]);
            edge.source = parseVertex(edge.source);
            edge.destination = parseVertex(edge.destination);

            var vertexTypes = schema.getVertexTypesFromEdgeGroup(edge.group);
            edge.sourceType = vertexTypes[0];
            edge.destinationType = vertexTypes[1];
            var id = edge.source + "|" + edge.destination + "|" + edge.directed + "|" + edge.group;
            if(id in graphData.edges) {
                if(!ObjectContainsValue(graphData.edges[id], edge)) {
                    graphData.edges[id].push(edge);
                }
            } else {
                graphData.edges[id] = [edge];
            }
        }

        for (var i in results.entitySeeds) {
            var entitySeed = {
               vertex: parseVertex(results.entitySeeds[i]),
               vertexType: "unknown"
            }

            var id = entitySeed.vertex;
            if(id in graphData.entitySeeds) {
                if(!ObjectContainsValue(graphData.entitySeeds[id], entitySeed)) {
                    graphData.entitySeeds[id].push(entitySeed);
                }
            } else {
                graphData.entitySeeds[id] = [entitySeed];
            }
        }

        graph.graphData = graphData
        updateGraph(graph.graphData)
    }

    var clone = function(obj) {
        return JSON.parse(JSON.stringify(obj))
    }

    function parseVertex(vertex) {
        if(typeof vertex === 'string' || vertex instanceof String) {
            vertex = "\"" + vertex + "\"";
        }

        try {
             JSON.parse(vertex);
        } catch(err) {
             // Try using stringify
             vertex = JSON.stringify(vertex);
        }

        return vertex;
    }

    var updateGraph = function(results) {
        for (var id in results.entities) {
            var existingNodes = graphCy.getElementById(id);
            if(existingNodes.length > 0) {
                if(existingNodes.data().radius < 60) {
                    existingNodes.data('radius', 60);
                    existingNodes.data('color', '#337ab7');
                    existingNodes.data('selectedColor', '#204d74');
                }
            } else {
                graphCy.add({
                    group: 'nodes',
                    data: {
                        id: id,
                        label: graph.createLabel(id),
                        radius: 60,
                        color: '#337ab7',
                        selectedColor: '#204d74'
                    },
                    position: {
                        x: 100,
                        y: 100
                    },
                    selected: ObjectContainsValue(graph.selectedEntities, id)
                });
            }
        }

        for (var id in results.edges) {
            var edge = results.edges[id][0];
            if(graphCy.getElementById(edge.source).length === 0) {
                graphCy.add({
                    group: 'nodes',
                    data: {
                        id: edge.source,
                        label: graph.createLabel(edge.source),
                        radius: 20,
                        color: '#888',
                        selectedColor: '#444',
                        vertexType: edge.sourceType
                    },
                    position: {
                        x: 100,
                        y: 100
                    },
                    selected: ObjectContainsValue(graph.selectedEntities, edge.source)
                });
            }

            if(graphCy.getElementById(edge.destination).length === 0) {
                graphCy.add({
                    group: 'nodes',
                    data: {
                        id: edge.destination,
                        label: graph.createLabel(edge.destination),
                        radius: 20,
                        color: '#888',
                        selectedColor: '#444',
                        vertexType: edge.destinationType
                    },
                    position: {
                        x: 100,
                        y: 100
                    },
                    selected: ObjectContainsValue(graph.selectedEntities, edge.destination)
                });
            }

            if(graphCy.getElementById(id).length === 0) {
                graphCy.add({
                    group: 'edges',
                    data: {
                        id: id,
                        source: edge.source,
                        target: edge.destination,
                        group: edge.group,
                        selectedColor: '#35500F',
                    },
                    selected: ObjectContainsValue(graph.selectedEdges, id)
                });
            }
        }

        for (var id in results.entitySeeds) {
            addEntitySeed(results.entitySeeds[id][0].vertexType, id);
        }

        graph.redraw();
    }

    graph.onSelectedElementsUpdate = function(fn){
        listen('onSelectedElementsUpdate', fn);
    };

    graph.onRelatedEntitiesUpdate = function(fn){
        listen('onRelatedEntitiesUpdate', fn);
    };

     graph.onRelatedEdgesUpdate = function(fn){
            listen('onRelatedEdgesUpdate', fn);
        };

    graph.clear = function(){
        while(graphCy.elements().length > 0) {
            graphCy.remove(graphCy.elements()[0]);
        }
    }

    graph.redraw = function() {
        graphCy.layout({name: 'concentric'});
    }

    graph.createLabel = function(vertex) {
        var label;
        var json;
        try {
            json = JSON.parse(vertex)
        } catch (e) {
            json = vertex
        }
        if(typeof json === 'string'
            || json instanceof String
            || typeof json === 'number') {
            label = vertex;
        } else if(Object.keys(json).length == 1) {
            var typeClass = Object.keys(json)[0];
            label = settings.getType(typeClass).getShortValue(json);
        } else {
            label = vertex;
        }

        return label;
    }

    var addEntitySeed = function(vertexType, vertex){
        if(graphCy.getElementById(vertex).length === 0) {
            graphCy.add({
                group: 'nodes',
                data: {
                    id: vertex,
                    label: graph.createLabel(vertex),
                    vertex: vertex,
                    color: '#888',
                    selectedColor: '#444',
                    radius: 20,
                    vertexType: vertexType
                },
                position: {
                    x: 100,
                    y: 100
                },
                selected: ObjectContainsValue(graph.selectedEntities, vertex)
            });
        }
    }

    var ObjectContainsValue = function(obj, value) {
        return (value in obj)
    }

    graph.selectAllNodes = function() {
        graphCy.filter('node').select();
    }

    function fire(e, args){
        var listeners = graph.listeners[e];

        for( var i = 0; listeners && i < listeners.length; i++ ){
            var fn = listeners[i];

            fn.apply( fn, args );
        }
    }

    function listen(e, fn){
        var listeners = graph.listeners[e] = graph.listeners[e] || []
        listeners.push(fn);
    }

    return graph

}])