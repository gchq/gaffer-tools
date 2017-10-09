'use strict'

angular.module('app').factory('graph', ['schema', 'types', '$q', function(schema, types, $q) {

    var graphCy;
    var graph = {};

    var selectedEntities = {}
    var selectedEdges = {}
    var relatedEntities = []
    var relatedEdges = []


    var graphData = {entities: {}, edges: {}, entitySeeds: {}}

    graph.getSelectedEntities = function() {
        return selectedEntities
    }

    graph.getRelatedEntities = function() {
        return relatedEntities
    }

    graph.getSelectedEdges = function() {
        return selectedEdges
    }

    graph.getRelatedEdges = function() {
        return relatedEdges
    }

    var listeners = {}

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
        relatedEntities = []
        for(var id in selectedEntities) {
            var vertexType = selectedEntities[id][0].vertexType
            for(var entityGroup in schema.get().entities) {
                if(vertexType === "unknown") {
                     relatedEntities.push(entityGroup)
                     fire('onRelatedEntitiesUpdate', [relatedEntities])
                } else {
                    var entity = schema.get().entities[entityGroup]
                    if(entity.vertex === vertexType
                        && relatedEntities.indexOf(entityGroup) === -1) {
                        relatedEntities.push(entityGroup)
                        fire('onRelatedEntitiesUpdate', [relatedEntities])
                    }
                }
            }
        }

    }

    function updateRelatedEdges() {
        graph.relatedEdges = [];
        for(var id in selectedEntities) {
            var vertexType = selectedEntities[id][0].vertexType;
            for(var edgeGroup in schema.get().edges) {
                var edge = schema.get().edges[edgeGroup]
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
        for (var id in graphData.entities) {
            if(_id == id) {
                selectedEntities[id] = graphData.entities[id]
                fire('onSelectedElementsUpdate', [{"entities": selectedEntities, "edges": selectedEdges}])
                updateRelatedEntities()
                updateRelatedEdges()
                return
            }
        }
        for (var id in graphData.edges) {
         if(_id == id) {
             selectedEdges[id] = graphData.edges[id]
             fire('onSelectedElementsUpdate', [{"entities": selectedEntities, "edges": selectedEdges}])
             return
         }
        }
        selectedEntities[_id] = [{vertexType: element.data().vertexType, vertex: _id}]
        fire('onSelectedElementsUpdate', [{"entities": selectedEntities, "edges": selectedEdges}])
        updateRelatedEntities()
        updateRelatedEdges()
    }

    function unSelect(element) {
        if(element.id() in selectedEntities) {
            delete selectedEntities[element.id()]
            updateRelatedEntities()
            updateRelatedEdges()

        } else if(element.id() in selectedEdges) {
            delete selectedEdges[element.id()]
        }

        fire('onSelectedElementsUpdate', [{"entities": selectedEntities, "edges": selectedEdges}])
    }

    graph.reload = function(results) {
        graph.load()
        if (results.entities.length === 0 &&
        results.edges.length === 0 &&
        results.entitySeeds.length === 0) {

            updateGraph(graphData)
        } else {
            graph.update(results)
        }
    }

    graph.reset = function() {
        selectedEdges = {}
        selectedEntities = {}
        fire('onSelectedElementsUpdate'[{"entities": selectedEntities, "edges": selectedEdges}])
    }

    graph.addSeed = function(vt, v) {
        var entitySeed = { vertexType: vt, vertex: v }
        if(v in graphData.entitySeeds) {
            if(!arrayContainsValue(graphData.entitySeeds[v], entitySeed)) {
                graphData.entitySeeds[v].push(entitySeed);
            }
        } else {
            graphData.entitySeeds[v] = [entitySeed];
        }

        updateGraph(graphData)
    }

    graph.update = function(results) {
        graphData = { entities: {}, edges: {}, entitySeeds: {} };
        for (var i in results.entities) {
            var entity = clone(results.entities[i]);
            entity.vertex = parseVertex(entity.vertex);
            var id = entity.vertex;
            entity.vertexType = schema.getVertexTypeFromEntityGroup(entity.group);
            if(id in graphData.entities) {
                if(!arrayContainsValue(graphData.entities[id], entity)) {
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
                if(!arrayContainsValue(graphData.edges[id], edge)) {
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
                if(!arrayContainsValue(graphData.entitySeeds[id], entitySeed)) {
                    graphData.entitySeeds[id].push(entitySeed);
                }
            } else {
                graphData.entitySeeds[id] = [entitySeed];
            }
        }

        updateGraph(graphData)
        graph.redraw()
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
                    selected: objectContainsValue(selectedEntities, id)
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
                    selected: objectContainsValue(selectedEntities, edge.source)
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
                    selected: objectContainsValue(selectedEntities, edge.destination)
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
                    selected: objectContainsValue(selectedEdges, id)
                });
            }
        }

        for (var id in results.entitySeeds) {
            addEntitySeed(results.entitySeeds[id][0].vertexType, id);
        }
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
            label = types.getType(typeClass).getShortValue(json);
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
                selected: objectContainsValue(selectedEntities, vertex)
            });
        }
    }

    var objectContainsValue = function(obj, value) {
        return (value in obj)
    }

    var arrayContainsValue = function(arr, value) {
        return (arr.indexOf(value) !== -1)
    }

    graph.selectAllNodes = function() {
        graphCy.filter('node').select();
    }

    function fire(e, args){
        var currentListeners = listeners[e];

        for( var i = 0; currentListeners && i < currentListeners.length; i++ ){
            var fn = currentListeners[i];

            fn.apply( fn, args );
        }
    }

    function listen(e, fn){
        var currentListeners = listeners[e] = listeners[e] || []
        currentListeners.push(fn);
    }

    return graph

}])