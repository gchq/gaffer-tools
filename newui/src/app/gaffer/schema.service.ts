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

import { Injectable } from '@angular/core';
import { Observable, Observer, of } from 'rxjs';
import { OperationService } from './operation.service';
import { OperationOptionsService } from '../options/operation-options.service';

@Injectable()

export class SchemaService {
    deffered; //Used to be $q.defer(), now the observable
    schema;
    schemaVertices = {};

    constructor(
        private operationService: OperationService,
        private operationOptions: OperationOptionsService
        ) 
        
        { 
        this.update().then(function() {}, function() {});
    }
    
    /**
     * Asynchronously gets the schema. It will reject the promise if it fails to get the schema but won't
     * broadcast an error. The schema will be saved until update is called to reduce number of http requests. 
     * If called while an existing request is in progress, it will be resolved by the existing request, 
     * rather than sending another one.
     */
    get = function() {
        if (this.schema) {
            return of(this.schema); 
        } else if (!this.deferred) {
            //this.deferred = new Observable();
            this.deferred = Observable.create((observer: Observer<String>) => {});
            this.getSchema();
        }
        return this.deferred;
    }

    // get = function() {
    //     if (this.schema) {
    //         return this.$q.when(this.schema);
    //     } else if (!this.deferred) {
    //         this.deferred = this.$q.defer();
    //         this.getSchema();
    //     }
    //     return this.deferred.promise;
    // }

    /**
     * Creates the get schema operation using the default operation options.
     * @param {Boolean} loud Flag passed down to indicate whether to broadcast errors
     */
    private getSchema = function(loud) {
        var getSchemaOperation = this.operationService.createGetSchemaOperation();
        if (Object.keys(getSchemaOperation.options).length === 0) {
            this.operationOptions.getDefaultOperationOptionsAsync().then(function(options) {
                getSchemaOperation.options = options;
                this.getSchemaWithOperation(getSchemaOperation, loud)
            });
        } else {
            this.getSchemaWithOperation(getSchemaOperation, loud);
        }
    }

    /**
     * Runs the GetSchema operation. Will fail if the Request sends back a non-200 response or the query.execute method
     * errors
     * @param {Operation} operation The GetSchema operation
     * @param {*} loud A flag indicating whether to broadcast errors
     */
    private getSchemaWithOperation = function(operation, loud) {
        try {
            this.query.execute(
                operation,
                function(response) {
                    this.schema = response;
                    if (!this.schema.entities) {
                        this.schema.entities = {};
                    }
                    if (!this.schema.edges) {
                        this.schema.edges = {};
                    }
                    if (!this.schema.types) {
                        this.schema.types = {};
                    }

                    this.updateSchemaVertices();
                    this.deferred.resolve(this.schema)
                    this.deferred = undefined;
                },
                function(err) {
                    this.deferred.throw(err);
                    if (loud) {
                        this.error.handle("Failed to load schema", err);
                    }
                    this.deferred = undefined;
                }
            );
        } catch(e) {
            this.deferred.throw(e);
            if (loud) {
                this.error.handle("Failed to load schema", e);
            }
            this.deferred = undefined;
        }
    }

    /**
     * Updates the schema service
     * Rejects all current promises if outstanding. Then loudly loads the schema.
     * Once finished, the schema or error is returned.
     */
    update = function() {
        if (this.deferred) {
            this.deferred.throw('Reloading the schema');
        }
        this.deferred = Observable.create((observer: Observer<String>) => {});
        this.getSchema(true);
        return this.deferred;
    }

    /**
     * Returns the schema vertices.
     */
    getSchemaVertices = function() {
        return this.schemaVertices;
    }

    /**
     * Function which updates the schema vertices.
     */
    private updateSchemaVertices = function() {
        var vertices = [];
        if(this.schema) {
            for(var i in this.schema.entities) {
                if(vertices.indexOf(this.schema.entities[i].vertex) == -1) {
                    vertices.push(this.schema.entities[i].vertex);
                }
            }
            for(var i in this.schema.edges) {
                if(vertices.indexOf(this.schema.edges[i].source) == -1) {
                    vertices.push(this.schema.edges[i].source);
                }
                if(vertices.indexOf(this.schema.edges[i].destination) == -1) {
                    vertices.push(this.schema.edges[i].destination);
                }
            }
        }

        this.schemaVertices = vertices;
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
    getVertexTypesFromEdgeGroup = function(group) {
        if (!this.schema || !this.schema.edges[group]) {
            return {source: null, destination: null};
        }
        var vertexTypes = {
            source: {},
            destination: {}
        };
        
        var elementDef = this.schema.edges[group];
        vertexTypes['source'][ elementDef['source'] ] = this.schema.types[elementDef['source']];
        vertexTypes['destination'][ elementDef['destination'] ] = this.schema.types[elementDef['destination']];

        return vertexTypes;
    }

    /**
     * Returns an object which holds a key (the vertex type) and value 
     * (the schema type definition for the vertex type). It returns null if the schema doesn't exist or
     * The Entity group does not exist in the schema.
     */
    getVertexTypeFromEntityGroup = function(group) {
        if (!this.schema || !this.schema.entities[group]) {
            return null;
        }
        var vertexType = {};
        
        var elementDef = this.schema.entities[group];
        
        vertexType[ elementDef['vertex'] ] = this.schema.types[elementDef['vertex']];

        return vertexType;
    }

    /**
     * Gets the property object for a given entity group. Returns undefined if
     * the entity group contains no properties.
     */
    getEntityProperties = function(entity) {
        if(Object.keys(this.schema.entities[entity].properties).length) {
            return this.schema.entities[entity].properties;
        }
        return undefined;
    }

    /**
     * Gets the property object for a given edge group. Returns undefined if the
     * edge group contains no properties.
     */
    getEdgeProperties = function(edge) {
        if(Object.keys(this.schema.edges[edge].properties).length) {
            return this.schema.edges[edge].properties;
        }
        return undefined;
    }
};
