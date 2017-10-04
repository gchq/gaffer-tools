'use strict'

angular.module('app').factory('schema', ['$http', '$q', function($http, $q) {

    var schemaService = {}
    var defer = $q.defer()
    schemaService.schema = {}
    schemaService.schemaVertices = {}


    schemaService.observeSchema = function() {
        return defer.promise
    }

    schemaService.getSchema = function() {
        return schemaService.schema
    }

    schemaService.getSchemaVertices = function() {
        return schemaService.schemaVertices
    }

    schemaService.loadSchema = function(restUrl) {
         $http.get(restUrl + "/graph/config/schema")
              .success(function(data){
                 schemaService.schema = data
                 updateSchemaVertices()
                 defer.notify(schemaService.schema)
              })
              .error(function(arg) {
                 console.log("Unable to load schema: " + arg)
              })
    }

    var updateSchemaVertices = function() {
        var vertices = [];
        if(schemaService.schema) {
            for(var i in schemaService.schema.entities) {
                if(vertices.indexOf(schemaService.schema.entities[i].vertex) == -1) {
                    vertices.push(schemaService.schema.entities[i].vertex);
                }
            }
            for(var i in schemaService.schema.edges) {
                if(vertices.indexOf(schemaService.schema.edges[i].source) == -1) {
                    vertices.push(schemaService.schema.edges[i].source);
                }
                if(vertices.indexOf(schemaService.schema.edges[i].destination) == -1) {
                    vertices.push(schemaService.schema.edges[i].destination);
                }
            }
        }

        schemaService.schemaVertices = vertices;
    }

    schemaService.getEntityProperties = function(entity) {
        if(Object.keys(schemaService.schema.entities[entity].properties).length) {
            return schemaService.schema.entities[entity].properties;
        }
        return undefined;
    }

    schemaService.getEdgeProperties = function(edge) {
        if(Object.keys(schemaService.schema.edges[edge].properties).length) {
            return schemaService.schema.edges[edge].properties;
        }
        return undefined;
    }


    schemaService.getVertexTypeFromEntityGroup = function(group) {
        for(var entityGroup in schemaService.schema.entities) {
            if(schemaService.entityGroup === group) {
                return schemaService.schema.entities[entityGroup].vertex;
            }
        }
    }

    schemaService.getVertexTypesFromEdgeGroup = function(group) {
        for(var edgeGroup in schemaService.schema.edges) {
            if(edgeGroup === group) {
               return [schemaService.schema.edges[edgeGroup].source, schemaService.schema.edges[edgeGroup].destination];
            }
        }
    }


    return schemaService

}])
