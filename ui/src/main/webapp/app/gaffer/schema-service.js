(function() {

    'use strict'

    function schemaService($http, settingsService) {

        loadSchema()

        var schema = {}
        var schemaVertices = [];

        return {
            getSchema: getSchema,
            getSchemaVertices: getSchemaVertices,
            loadSchema: loadSchema
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

         var updateSchemaVertices() {
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


    }

})()