'use strict'

angular.module('app').factory('table', [function() {
    var table = {}

    var tableData = {entities: {}, edges: {}, entitySeeds: [], other: []}

    table.getData = function() {
        return tableData
    }

    table.update = function(results) {
        tableData = {entities: {}, edges: {}, entitySeeds: [], other: []}
        for (var i in results.entities) {
            var entity = results.entities[i];
            if(!tableData.entities[entity.group]) {
                tableData.entities[entity.group] = [];
            }
            if (tableData.entities[entity.group].indexOf(angular.toJson(entity)) === -1) {
                tableData.entities[entity.group].push(angular.toJson(entity));
            }
        }

        for (var i in results.edges) {
            var edge = results.edges[i];
            if(!tableData.edges[edge.group]) {
                tableData.edges[edge.group] = [];
            }
            if (tableData.edges[edge.group].indexOf(angular.toJson(edge)) == -1) {
                tableData.edges[edge.group].push(angular.toJson(edge));
            }
        }

        for (var i in results.entitySeeds) {
            var es = parseVertex(results.entitySeeds[i]);
            if (tableData.entitySeeds.indexOf(es) == -1) {
                tableData.entitySeeds.push(es);
            }
        }

        for (var i in results.other) {
            if (tableData.other.indexOf(results.other[i]) === -1) {
                tableData.other.push(results.other[i]);
            }
        }

        convertElements();
    }

    var convertElements = function() {
        for (var i in tableData.entities) {
            for (var a in tableData.entities[i]) {
                tableData.entities[i][a] = JSON.parse(tableData.entities[i][a]);
            }
        }
        for (var i in tableData.edges) {
            for (var a in tableData.edges[i])
            tableData.edges[i][a] = JSON.parse(tableData.edges[i][a]);
        }

    }

    var parseVertex = function(vertex) {
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

    return table
}])