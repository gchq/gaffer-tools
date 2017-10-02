(function() {

    'use strict'

    angular.module('app').factory('schemaService', schemaService)

    function schemaService($http, settingsService) {

        loadSchema()

        var schema = {}
        var schemaVertices = [];

        return {
            getSchema: getSchema,
            getSchemaVertices: getSchemaVertices,
            loadSchema: loadSchema,
            getEntityProperties: getEntityProperties,
            getEdgeProperties: getEdgeProperties,
            getVertexTypeFromEntityGroup: getVertexTypeFromEntityGroup,
            getVertexTypesFromEdgeGroup: getVertexTypesFromEdgeGroup
        }

        function getSchema() {
            return schema;
        }
        
        function getSchemaVertices() {
            return schemaVertices;
        }

        function loadSchema() {
             $http.get(settingsService.getRestUrl() + "/graph/config/schema")
                  .success(function(data){
                     schema = data;
                     updateSchemaVertices();
                  })
                  .error(function(arg) {
                     console.log("Unable to load schema: " + arg);
                  });
         }

        function updateSchemaVertices() {
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

        function getEntityProperties(entity) {
            if(Object.keys(schema.entities[entity].properties).length) {
                return schema.entities[entity].properties;
            }
            return undefined;
        }

        function getEdgeProperties(edge) {
            if(Object.keys(schema.edges[edge].properties).length) {
                return schema.edges[edge].properties;
            }
            return undefined;
        }

        function getVertexTypeFromEntityGroup(group) {
                for(var entityGroup in schema.entities) {
                    if(entityGroup === group) {
                        return schema.entities[entityGroup].vertex;
                    }
                }
            }

        function getVertexTypesFromEdgeGroup(group) {
            for(var edgeGroup in schema.edges) {
                if(edgeGroup === group) {
                   return [schema.edges[edgeGroup].source, schema.edges[edgeGroup].destination];
                }
            }
        }


    }

})()