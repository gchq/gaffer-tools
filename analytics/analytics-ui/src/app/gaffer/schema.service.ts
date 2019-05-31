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
export class SchemaService {

    service = {};

    deferred;
    schema;
    schemaVertices = {};
    
    /**
     * Asynchronously gets the schema. It will reject the promise if it fails to get the schema but won't
     * broadcast an error. The schema will be saved until update is called to reduce number of http requests. 
     * If called while an existing request is in progress, it will be resolved by the existing request, 
     * rather than sending another one.
     */
    get = function() {
        if (this.schema) {
            return this.$q.when(this.schema);
        } else if (!this.deferred) {
            this.deferred = this.$q.defer();
            this.getSchema();
        }
        return this.deferred.promise;
    }

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
    // private getSchemaWithOperation = function(operation, loud) {
    //     try {
    //         this.query.execute(
    //             operation,
    //             function(response) {
    //                 this.schema = response;
    //                 if (!this.schema.entities) {
    //                     this.schema.entities = {};
    //                 }
    //                 if (!this.schema.edges) {
    //                     this.schema.edges = {};
    //                 }
    //                 if (!this.schema.types) {
    //                     this.schema.types = {};
    //                 }

    //                 this.updateSchemaVertices();
    //                 this.deferred.resolve(this.schema)
    //                 this.deferred = undefined;
    //             },
    //             function(err) {
    //                 this.deferred.reject(err);
    //                 if (loud) {
    //                     this.error.handle("Failed to load schema", err);
    //                 }
    //                 this.deferred = undefined;
    //             }
    //         );
    //     } catch(e) {
    //         this.deferred.reject(e);
    //         if (loud) {
    //             this.error.handle("Failed to load schema", e);
    //         }
    //         this.deferred = undefined;
    //     }
    // }
};
