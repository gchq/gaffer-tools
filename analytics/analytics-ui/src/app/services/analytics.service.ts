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
import { Observable, Observer } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { QueryService } from './query.service';
import { ErrorService } from './error.service';
import { ResultsService } from './results.service';
import { cloneDeep, startsWith } from 'lodash';
import { EndpointService } from './endpoint-service';
import { ParameterFormComponent } from '../parameters/parameter-form/parameter-form.component';

const OPERATION_CHAIN_CLASS = 'uk.gov.gchq.gaffer.operation.OperationChain';
const MAP_OPERATION_CLASS = 'uk.gov.gchq.gaffer.operation.impl.Map';

// Used to store and get the selected analytic
@Injectable()
export class AnalyticsService {
  arrayAnalytic; // The analytic with array parameters

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
    return this.arrayAnalytic;
  }

  /** Get the type of the results. E.g. TABLE or HTML */
  getOutputVisualisationType() {
    return this.arrayAnalytic.outputVisualisation.visualisationType;
  }
  /** Update the analytic operation on change of parameters */
  updateAnalytic = function(newValue, parameterName) {

    // Look for the parameter in the list of parameters and set the new current value
    for (const parameterPair of this.arrayAnalytic.uiMapping) {
      if (parameterPair[0] === parameterName) {
        parameterPair[1].currentValue = newValue;
        return;
      }
    }
    return;
  };

  /** Create an analytic with array parameters that can be iterated over */
  createArrayAnalytic = function(analytic) {
    // Convert the key value map of parameters into an iterable array
    let arrayParams = analytic.uiMapping;
    if (arrayParams !== null && arrayParams !== undefined) {
      arrayParams = Object.keys(analytic.uiMapping).map(key => {
        return [key, analytic.uiMapping[key]];
      });

      // Add a new key and value in parameters to store the current value of that parameter
      for (const param of arrayParams) {
        // If boolean type, set its initial value to false, otherwise set it to null
        if (param[1].userInputType === 'boolean') {
          param[1].currentValue = false;
        } else {
          param[1].currentValue = null;
        }
      }
    } else {
      arrayParams = null;
    }

    // Create the analytic operation from these parameters if any
    this.arrayAnalytic = cloneDeep(analytic);
    this.arrayAnalytic.uiMapping = arrayParams;
  };

  /** Execute the analytic operation */
  executeAnalytic = function() {
    const operation = {
      class: this.NAMED_OPERATION_CLASS,
      operationName: this.arrayAnalytic.operationName,
      parameters: null
    };

    // Convert parameters from an array to a key value map
    // so the parameters are in the correct form when they reach the server
    if (this.arrayAnalytic.uiMapping != null) {
      const parametersMap = {};
      for (const param of this.arrayAnalytic.uiMapping) {
        if (param[1].userInputType === 'iterable') {
          parametersMap[param[1].parameterName] = ['Iterable', param[1].currentValue.split('\n')];
        } else {
          parametersMap[param[1].parameterName] = param[1].currentValue;
        }
      }
      operation.parameters = parametersMap;
    }

    // Clear the current results
    this.results.clear();

    // Create an operation chain, add the operation and if theres an output adapter, apply it
    const operationChain = {
      class: OPERATION_CHAIN_CLASS,
      operations: []
    };

    operationChain.operations.push(operation);

    if (this.arrayAnalytic.outputVisualisation != null && this.arrayAnalytic.outputVisualisation.outputAdapter != null) {
      operationChain.operations.push({
        class: MAP_OPERATION_CLASS,
        functions: [
          this.arrayAnalytic.outputVisualisation.outputAdapter
        ]
      });
    }

    // Execute the analytic and then navigate when finished loading
    this.query.executeQuery(operationChain, () => {
      const name = this.arrayAnalytic.analyticName;
      this.router.navigate([name, 'results']);
    });
  };

  /** Get the analytics from the server */
  reloadAnalytics = function(loud) {
    const observable = new Observable((observer: Observer<string>) => {
      const operation = {
        class: 'uk.gov.gchq.gaffer.analytic.operation.GetAllAnalytics'
      };
      // Configure the http headers
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json; charset=utf-8');
      // Make the http request
      let queryUrl =
        this.endpoint.getRestEndpoint() + '/graph/operations/execute';
      if (!startsWith(queryUrl, 'http')) {
        queryUrl = 'http://' + queryUrl;
      }
      this.http.post(queryUrl, operation, { headers: '{headers}' }).subscribe(
        // On success
        data => {
          observer.next(data);
        },
        // On error
        err => {
          if (loud) {
            this.error.handle(
              'Failed to load analytics, see the console for details',
              null,
              err
            );
            observer.error(err);
          } else {
            observer.next(err);
          }
        }
      );
    });
    return observable;
  };
}
