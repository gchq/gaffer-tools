/*
 * Copyright 2017-2018 Crown Copyright
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
    

    service.get = function() {
        if (schema) {
            return $q.when(schema);
        } else if (!deferred) {
            deferred = $q.defer();
            getSchema();
        }
        return deferred.promise;
    }

    var getSchema = function(loud) {
        var getSchemaOperation = operationService.createGetSchemaOperation();
        if (getSchemaOperation.options == {}) {
            operationOptions.getDefaultOperationOptionsAsync().then(function(options) {
                getSchemaOperation.options = options;
                getSchemaWithOperation(getSchemaOperation, loud)
            });
        } else {
            getSchemaWithOperation(getSchemaOperation, loud);
        }
    }

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

    service.update = function() {
        if (deferred) {
            deferred.reject('Reloading the schema');
        }
        deferred = $q.defer();
        getSchema(true);
        return deferred.promise;
    }

    service.getSchemaVertices = function() {
        return schemaVertices;
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

    service.getVertexTypeFromEntityGroup = function(group) {
        if (!schema || !schema.entities[group]) {
            return null;
        }
        var vertexType = {};
        
        var elementDef = schema.entities[group];
        
        vertexType[ elementDef['vertex'] ] = schema.types[elementDef['vertex']];

        return vertexType;
    }

    service.getEntityProperties = function(entity) {
        if(Object.keys(schema.entities[entity].properties).length) {
            return schema.entities[entity].properties;
        }
        return undefined;
    }

    service.getEdgeProperties = function(edge) {
        if(Object.keys(schema.edges[edge].properties).length) {
            return schema.edges[edge].properties;
        }
        return undefined;
    }


    service.update();

    return service;

}]);
