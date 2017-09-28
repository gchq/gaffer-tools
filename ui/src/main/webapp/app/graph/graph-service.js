(function() {

    'use strict'

    angular.module('app').factory('graphService', graphService)


    function graphService(schemaService) {

        return {
            getSelectedEdges: getSelectedEdges,
            getSelectedEntities: getSelectedEntities,
            getRelatedEdges: getRelatedEdges,
            getRelatedEntities: getRelatedEntities,
            doesNeedToRedraw: doesNeedToRedraw,
            redraw: redraw,
            redrawn: redrawn,
            selectAllNodes: selectAllNodes,
            selectedAllNodes: selectedAllNodes,
            doesNeedToSelectAll: doesNeedToSelectAll,
            addSeed: addSeed,
            getSeedToAdd: getSeedToAdd,
            select: select,
            unSelect: unSelect,
            updateGraphData: updateGraphData
        }

        var selectedEntities = {}
        var selectedEdges = {}
        var relatedEntities = {}
        var relatedEdges = {}
        var needToRedraw = false
        var needToSelectAll = false
        var seedToAdd = {}
        var graphData = graphData = {entities: {}, edges: {}, entitySeeds: {}}
        var selectedElementTabIndex = 0
        var selectedEntitiesCount = 0
        var selectedEdgesCount = 0

        function select(element, callback) {
            selectedElementTabIndex = 0;
            var _id = element.id();
            for (var id in graphData.entities) {
                if(_id == id) {
                    selectedEntities[id] = graphData.entities[id];
                    selectedEntitiesCount = Object.keys(selectedEntities).length;
                    updateRelatedEntities();
                    updateRelatedEdges();
                    callback()
                    return;
                }
            }
            for (var id in graphData.edges) {
                if(_id == id) {
                    selectedEdges[id] = graphData.edges[id];
                    selectedEdgesCount = Object.keys(selectedEdges).length;
                    callback()
                    return;
                }
            }

            selectedEntities[_id] = [{vertexType: element.data().vertexType, vertex: _id}];
            selectedEntitiesCount = Object.keys(selectedEntities).length;
            updateRelatedEntities();
            updateRelatedEdges();

            callback()
        }

        function unSelect(element, callback) {
            selectedElementTabIndex = 0
            if(element.id() in selectedEntities) {
                delete electedEntities[element.id()]
                selectedEntitiesCount = Object.keys(selectedEntities).length
                updateRelatedEntities()
                updateRelatedEdges()
            } else if(element.id() in selectedEdges) {
                delete selectedEdges[element.id()]
                selectedEdgesCount = Object.keys(selectedEdges).length
            }

            callback()
        }

        function updateRelatedEntities() {
            relatedEntities = []
            for(id in selectedEntities) {
                var vertexType = selectedEntities[id][0].vertexType
                for(var entityGroup in schemaService.getSchema().entities) {
                    if(vertexType === "unknown") {
                         relatedEntities.push(entityGroup)
                    } else {
                        var entity = schemaService.getSchema().entities[entityGroup]
                        if(entity.vertex === vertexType
                            && relatedEntities.indexOf(entityGroup) === -1) {
                            relatedEntities.push(entityGroup)
                        }
                    }
                }
            }
        }

        function updateRelatedEdges() {
            relatedEdges = [];
            for(id in selectedEntities) {
                var vertexType = selectedEntities[id][0].vertexType; // TODO shouldn't this be selectedEdges?
                for(var edgeGroup in schemaService.getSchema().edges) {
                    var edge = schemaService.getSchema().edges[edgeGroup];
                    if((edge.source === vertexType || edge.destination === vertexType)
                        && relatedEdges.indexOf(edgeGroup) === -1) {
                        relatedEdges.push(edgeGroup);
                    }
                }
            }
        }

        function getRelatedEntities() {
            return relatedEntities
        }

        function getRelatedEdges() {
            return relatedEdges()
        }

        function getSelectedEntities() {
            return selectedEntities
        }

        function getSelectedEdges() {
            return selectedEdges
        }

        function doesNeedToRedraw() {
            return redraw
        }

        function redraw(callback) {
            selectedEntities = {}
            selectedEdges = {}
            needToRedraw = true
            callback()
        }

        function redrawn() {
            needToRedraw = false
        }

        function doesNeedToSelectAll() {
            return needToSelectAll
        }

        function selectAllNodes(callback) {
            needToSelectAll = true
            callback()
        }

        function selectedAllNodes() {
            needToSelectAll = false
        }

        function addSeed(vertexType, vertex, callback) {
            seedToAdd = {
                vertexType: vertexType,
                vertex: vertex
            }
            callback()
        }

        function updateGraphData(data, callback) {
            graphData = data
            callback(graphData)
        }
    }

})()