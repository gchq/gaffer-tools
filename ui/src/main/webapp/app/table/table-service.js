'use strict'

angular.module('app').factory('table', [function() {
    var table = {}

    table.data = {entities: {}, edges: {}, entitySeeds: [], other: []}

    table.update = function(results) {
        table.data = {entities: {}, edges: {}, entitySeeds: [], other: []}
        for (var i in results.entities) {
            var entity = results.entities[i];
            if(!table.data.entities[entity.group]) {
                table.data.entities[entity.group] = [];
            }
            if (table.data.entities[entity.group].indexOf(angular.toJson(entity)) === -1) {
                table.data.entities[entity.group].push(angular.toJson(entity));
            }
        }

        for (var i in results.edges) {
            var edge = results.edges[i];
            if(!table.data.edges[edge.group]) {
                table.data.edges[edge.group] = [];
            }
            if (table.data.edges[edge.group].indexOf(angular.toJson(edge)) == -1) {
                table.data.edges[edge.group].push(angular.toJson(edge));
            }
        }

        for (var i in results.entitySeeds) {
            var es = parseVertex(results.entitySeeds[i]);
            if (table.data.entitySeeds.indexOf(es) == -1) {
                table.data.entitySeeds.push(es);
            }
        }

        for (var i in results.other) {
            if (table.data.other.indexOf(results.other[i]) === -1) {
                table.data.other.push(results.other[i]);
            }
        }

        convertElements();
    }

    var convertElements = function() {
        for (var i in table.data.entities) {
            for (var a in table.data.entities[i]) {
                table.data.entities[i][a] = JSON.parse(table.data.entities[i][a]);
            }
        }
        for (var i in table.data.edges) {
            for (var a in table.data.edges[i])
            table.data.edges[i][a] = JSON.parse(table.data.edges[i][a]);
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