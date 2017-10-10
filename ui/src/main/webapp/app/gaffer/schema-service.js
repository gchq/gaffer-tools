'use strict'

angular.module('app').factory('schema', ['$http', 'config', '$q', 'common', function($http, config, $q, common) {

    var schemaService = {}

    var defer = $q.defer()
    var schema = {}
    var schemaVertices = {}


    schemaService.observe = function() {
        return defer.promise
    }

    schemaService.get = function() {
        return schema
    }

    schemaService.getSchemaVertices = function() {
        return schemaVertices
    }

    schemaService.load = function() {
        var queryUrl = common.parseUrl(config.get().restEndpoint + "/graph/config/schema")

        $http.get(queryUrl)
        .success(function(data){
            schema = data
            updateSchemaVertices()
            defer.notify(schema)
        })
        .error(function(err) {
            console.log("Unable to load schema: " + err.statusCode + " - " + err.status)
        })
    }

    var updateSchemaVertices = function() {
        var vertices = [];
        if(schema) {
            for(var i in schema.entities) {
                if(vertices.indexOf(schema.entities[i].vertex) == -1) {
                    vertices.push(schema.entities[i].vertex);
                }
            }
            for(var i in schema.edges) {
                if(vertices.indexOf(schema.edges[i].source) == -1) {
                    vertices.push(schema.edges[i].source);
                }
                if(vertices.indexOf(schema.edges[i].destination) == -1) {
                    vertices.push(schema.edges[i].destination);
                }
            }
        }

        schemaVertices = vertices;
    }

    schemaService.getEntityProperties = function(entity) {
        if(Object.keys(schema.entities[entity].properties).length) {
            return schema.entities[entity].properties;
        }
        return undefined;
    }

    schemaService.getEdgeProperties = function(edge) {
        if(Object.keys(schema.edges[edge].properties).length) {
            return schema.edges[edge].properties;
        }
        return undefined;
    }


    schemaService.getVertexTypeFromEntityGroup = function(group) {
        for(var entityGroup in schema.entities) {
            if(entityGroup === group) {
                return schema.entities[entityGroup].vertex;
            }
        }
    }

    schemaService.getVertexTypesFromEdgeGroup = function(group) {
        for(var edgeGroup in schema.edges) {
            if(edgeGroup === group) {
               return [schema.edges[edgeGroup].source, schema.edges[edgeGroup].destination];
            }
        }
    }


    return schemaService

}])
