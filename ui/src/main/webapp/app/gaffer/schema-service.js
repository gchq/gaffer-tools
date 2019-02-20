/*
 * Copyright 2017-2019 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

angular.module('app').factory('schema', ['$http', 'config', '$q', 'common', 'operationService', 'query', 'error', 'operationOptions', function($http, config, $q, common, operationService, query, error, operationOptions) {

    var service = {};

    var deferred;
    var schema;
    var schemaVertices = {};
    

    /**
     * Asynchronously gets the schema. It will reject the promise if it fails to get the schema but won't
     * broadcast an error. The schema will be saved until update is called to reduce number of http requests. 
     * If called while an existing request is in progress, it will be resolved by the existing request, 
     * rather than sending another one.
     */
    service.get = function() {
        if (schema) {
            return $q.when(schema);
        } else if (!deferred) {
            deferred = $q.defer();
            getSchema();
        }
        return deferred.promise;
    }

    /**
     * Creates the get schema operation using the default operation options.
     * @param {Boolean} loud Flag passed down to indicate whether to broadcast errors
     */
    var getSchema = function(loud) {
        var getSchemaOperation = operationService.createGetSchemaOperation();
        if (Object.keys(getSchemaOperation.options).length === 0) {
            operationOptions.getDefaultOperationOptionsAsync().then(function(options) {
                getSchemaOperation.options = options;
                getSchemaWithOperation(getSchemaOperation, loud)
            });
        } else {
            getSchemaWithOperation(getSchemaOperation, loud);
        }
    }

    /**
     * Runs the GetSchema operation. Will fail if the Request sends back a non-200 response or the query.execute method
     * errors
     * @param {Operation} operation The GetSchema operation
     * @param {*} loud A flag indicating whether to broadcast errors
     */
    var getSchemaWithOperation = function(operation, loud) {
        try {
            query.execute(
                operation,
                function(response) {
                    schema = response;
                    if (!schema.entities) {
                        schema.entities = {};
                    }
                    if (!schema.edges) {
                        schema.edges = {};
                    }
                    if (!schema.types) {
                        schema.types = {};
                    }

                    updateSchemaVertices();
                    deferred.resolve(schema)
                    deferred = undefined;
                },
                function(err) {
                    deferred.reject(err);
                    if (loud) {
                        error.handle("Failed to load schema", err);
                    }
                    deferred = undefined;
                }
            );
        } catch(e) {
            deferred.reject(e);
            if (loud) {
                error.handle("Failed to load schema", e);
            }
            deferred = undefined;
        }
    }

    /**
     * Updates the schema service
     * Rejects all current promises if outstanding. Then loudly loads the schema.
     * Once finished, the schema or error is returned.
     */
    service.update = function() {
        if (deferred) {
            deferred.reject('Reloading the schema');
        }
        deferred = $q.defer();
        getSchema(true);
        return deferred.promise;
    }

    /**
     * Returns the schema vertices.
     */
    service.getSchemaVertices = function() {
        return schemaVertices;
    }

    /**
     * Function which updates the schema vertices.
     */
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

    /**
     * Returns an object representing the source and destination of the edge group. The object returned holds the 
     * vertex types and schema definition for those vertex types. It looks something like this:
     * 
     *  {
     *      "source": {
     *          "sourceVertexType": {
     *              "class": "sourceVertexClass",
     *              "serialiser": "vertexSerialiserClass"
     *              ...
     *          }        
     *      },
     *      "destination": {
     *          "destinationVertexType": {
     *              "class": "destinationVertexClass"
     *              ...
     *          }
     *      }
     *  }
     */
    service.getVertexTypesFromEdgeGroup = function(group) {
        if (!schema || !schema.edges[group]) {
            return {source: null, destination: null};
        }
        var vertexTypes = {
            source: {},
            destination: {}
        };
        
        var elementDef = schema.edges[group];
        vertexTypes['source'][ elementDef['source'] ] = schema.types[elementDef['source']];
        vertexTypes['destination'][ elementDef['destination'] ] = schema.types[elementDef['destination']];

        return vertexTypes;
    }

    /**
     * Returns an object which holds a key (the vertex type) and value 
     * (the schema type definition for the vertex type). It returns null if the schema doesn't exist or
     * The Entity group does not exist in the schema.
     */
    service.getVertexTypeFromEntityGroup = function(group) {
        if (!schema || !schema.entities[group]) {
            return null;
        }
        var vertexType = {};
        
        var elementDef = schema.entities[group];
        
        vertexType[ elementDef['vertex'] ] = schema.types[elementDef['vertex']];

        return vertexType;
    }

    /**
     * Gets the property object for a given entity group. Returns undefined if
     * the entity group contains no properties.
     */
    service.getEntityProperties = function(entity) {
        if(Object.keys(schema.entities[entity].properties).length) {
            return schema.entities[entity].properties;
        }
        return undefined;
    }

    /**
     * Gets the property object for a given edge group. Returns undefined if the
     * edge group contains no properties.
     */
    service.getEdgeProperties = function(edge) {
        if(Object.keys(schema.edges[edge].properties).length) {
            return schema.edges[edge].properties;
        }
        return undefined;
    }


    service.update().then(function() {}, function() {});

    return service;

}]);
