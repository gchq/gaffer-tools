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

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { QueryService } from './query.service';
import { ErrorService } from './error.service';
import { ResultsService } from './results.service';
import { EndpointService } from './endpoint-service';
import { Analytic } from '../analytics/classes/analytic.class';

import { startsWith } from 'lodash';

const OPERATION_CHAIN_CLASS = 'uk.gov.gchq.gaffer.operation.OperationChain';
const MAP_OPERATION_CLASS = 'uk.gov.gchq.gaffer.operation.impl.Map';

// Used to store and get the selected analytic
@Injectable()
export class AnalyticsService {
  analytic: Analytic; // The selected analytic

  NAMED_OPERATION_CLASS = 'uk.gov.gchq.gaffer.named.operation.NamedOperation';

  constructor(
    private query: QueryService,
    private error: ErrorService,
    private http: HttpClient,
    private router: Router,
    private results: ResultsService,
    private endpoint: EndpointService
  ) { }

  /** Get the chosen analytic on load of parameters page */
  getAnalytic() {
    return this.analytic;
  }

  /** Get the type of the results. E.g. TABLE or HTML */
  getOutputVisualisationType() {
    return this.analytic.outputVisualisation.visualisationType;
  }
  /** Update the analytic operation on change of parameters */
  updateAnalytic = function(newValue, parameterName) {

    const parameterKeys = Array.from(this.analytic.uiMapping.keys());
    // Look for the parameter in the list of parameters and set the new current value
    for (const parameterKey of parameterKeys) {
      if (parameterKey === parameterName) {
        this.analytic.uiMapping.get(parameterKey).currentValue = newValue;
        return;
      }
    }
    return;
  };

  /** Initialise the analytic current values */
  initialiseAnalytic = function(analytic) {
    const parameterKeys = Array.from(analytic.uiMapping.keys());
    for (const parameterKey of parameterKeys) {
      if (analytic.uiMapping.get(parameterKey).userInputType === 'boolean') {
        analytic.uiMapping.get(parameterKey).currentValue = false;
      } else {
        analytic.uiMapping.get(parameterKey).currentValue = null;
      }
    }
    this.analytic = analytic;
  };

  /** Execute the analytic operation */
  executeAnalytic = function() {
    const operation = {
      class: this.NAMED_OPERATION_CLASS,
      operationName: this.analytic.operationName,
      parameters: null
    };

    // Get a map of the parameters and their values.
    // Make sure iterable parameters are in the correct form
    if (this.analytic.uiMapping != null) {
      const parameters = {};
      const parameterKeys = Array.from(this.analytic.uiMapping.keys());
      for (const parameterKey of parameterKeys) {
        if (this.analytic.uiMapping.get(parameterKey).userInputType === 'iterable') {
          parameters[this.analytic.uiMapping.get(parameterKey).parameterName] =
            ['Iterable', this.analytic.uiMapping.get(parameterKey).currentValue.split('\n')];
        } else {
          parameters[this.analytic.uiMapping.get(parameterKey).parameterName] =
            this.analytic.uiMapping.get(parameterKey).currentValue;
        }
      }
      operation.parameters = parameters;
    }

    // Create an operation chain from the operation
    const operationChain = {
      class: OPERATION_CHAIN_CLASS,
      operations: []
    };
    operationChain.operations.push(operation);

    // If there is an output adapter add it to the end of the operation chain
    if (this.analytic.outputVisualisation != null && this.analytic.outputVisualisation.outputAdapter != null) {
      operationChain.operations.push({
        class: MAP_OPERATION_CLASS,
        functions: [
          this.analytic.outputVisualisation.outputAdapter
        ]
      });
    }

    // Clear the current results
    this.results.clear();

    // Execute the operation chain and then navigate to the results page when finished loading
    this.query.executeQuery(operationChain, () => {
      this.router.navigate([this.analytic.analyticName, 'results']);
    });
  };

  /** Get the analytics from the server */
  getAnalytics = function(): Observable<object> {
    const operation = {
      class: 'uk.gov.gchq.gaffer.analytic.operation.GetAllAnalytics'
    };
    // Configure the http headers
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    // Make the http requests
    let queryUrl =
      this.endpoint.getRestEndpoint() + '/graph/operations/execute';
    if (!startsWith(queryUrl, 'http')) {
      queryUrl = 'http://' + queryUrl;
    }
    return this.http.post(queryUrl, operation, { headers: '{headers}' });
  };
}
