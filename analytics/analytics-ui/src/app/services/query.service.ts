/*
 * Copyright 2019-2020 Crown Copyright
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
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ErrorService } from './error.service';
import { ResultsService } from './results.service';
import { EndpointService } from './endpoint-service';

import { startsWith } from 'lodash';

@Injectable()
export class QueryService {
  constructor(
    private error: ErrorService,
    private http: HttpClient,
    private results: ResultsService,
    private endpoint: EndpointService
  ) { }

  /**
   * Executes a query. If too many results are returned a dialog is shown
   * to ask the user if they would like to view the results or amend their
   * query. On success, the result service is called to update the results.
   * The operation chain to execute. It can either be an object or a json string.
   */
  executeQuery = function(operation, onSuccess, onFailure) {
    this.execute(
      operation,
      // On success
      data => {
        // If there are too many results tell the user and only show a slice of the data

        // Store these results and show them
        this.results.update(data);
        if (onSuccess) {
          onSuccess(data);
        }
      },
      // On error
      err => {
        this.error.handle(
          'Error executing operation, see the console for details',
          null,
          err
        );
        if (onFailure) {
          onFailure(err);
        }
      }
    );
  };

  /**
   * Executes an operation and calls the onSuccess or onFailure functions provided.
   * The operation chain to execute. It can either be an object or a json string.
   */
  execute = function(operation, onSuccess, onFailure) {
    // Configure the http headers
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    // Post the request to the server
    let queryUrl =
      this.endpoint.getRestEndpoint() + '/graph/operations/execute';
    if (!startsWith(queryUrl, 'http')) {
      queryUrl = 'http://' + queryUrl;
    }
    this.http.post(queryUrl, operation, { headers: '{headers}' }).subscribe(
      // On success
      data => {
        if (onSuccess) {
          onSuccess(data);
        }
      },
      // On error
      err => {
        if (onFailure) {
          onFailure(err);
        } else {
          this.error.handle(
            'Error running operation, see the console for details',
            null,
            err
          );
        }
      }
    );
  };
}
