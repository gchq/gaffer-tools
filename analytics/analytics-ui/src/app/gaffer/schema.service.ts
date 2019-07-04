/*
 * Copyright 2019 Crown Copyright
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

import { of, Observable, Observer } from 'rxjs';
import { Injectable } from '@angular/core';

import { QueryService } from './query.service';

@Injectable()
export class SchemaService {
  deferred;
  schema;
  schemaVertices = {};

  constructor(private query: QueryService) { }

  /**
   * Asynchronously gets the schema. It will reject the promise if it fails to get the schema but won't
   * broadcast an error. The schema will be saved until update is called to reduce number of http requests.
   * If called while an existing request is in progress, it will be resolved by the existing request,
   * rather than sending another one.
   */
  get = function() {
    if (this.schema) {
      return of(this.schema);
    } else if (!this.schemaObservable) {
      this.schemaObservable = new Observable((
        (observer: Observer<string>) => {
          this.getSchema(null, observer);
        }
      ));
    }
    return this.schemaObservable;
  };

  /**
   * Creates the get schema operation using the default operation options.
   * Flag passed down to indicate whether to broadcast errors
   */
  private getSchema = function(loud, observer) {
    const getSchemaOperation = this.createGetSchemaOperation();
    this.getSchemaWithOperation(getSchemaOperation, loud, observer);
  };

  /**
   * Runs the GetSchema operation. Will fail if the Request sends back a non-200 response or the query.execute method
   * errors
   * The GetSchema operation
   * A flag indicating whether to broadcast errors
   */
  private getSchemaWithOperation = function(operation, loud, observer) {
    try {
      this.query.execute(
        operation,
        response => {
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
          observer.next(this.schema);
          observer.complete(undefined);
        },
        err => {
          observer.error(err);
          if (loud) {
            this.error.handle('Failed to load schema', null, err);
            console.error(err);
          }
          observer.complete(undefined);
        }
      );
    } catch (e) {
      observer.error(e);
      if (loud) {
        this.error.handle('Failed to load schema', null, e);
        console.error(e);
      }
      observer.complete(undefined);
    }
  };

  createGetSchemaOperation = () => {
    return {
      class: 'uk.gov.gchq.gaffer.store.operation.GetSchema',
      compact: false,
      options: {}
    };
  }

  /**
   * Function which updates the schema vertices.
   */
  private updateSchemaVertices = function() {
    const vertices = [];
    if (this.schema) {
      for (const entity of this.schema.entities) {
        if (vertices.indexOf(entity.vertex) === -1) {
          vertices.push(entity.vertex);
        }
      }
      for (const edge of this.schema.edges) {
        if (vertices.indexOf(edge.source) === -1) {
          vertices.push(edge.source);
        }
        if (vertices.indexOf(edge.destination) === -1) {
          vertices.push(edge.destination);
        }
      }
    }

    this.schemaVertices = vertices;
  };
}
