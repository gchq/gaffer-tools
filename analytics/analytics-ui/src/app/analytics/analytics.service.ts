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
import { Router } from '@angular/router';

import { QueryService } from '../services/query.service';
import { ErrorService } from '../services/error.service';
import { ResultsService } from '../services/results.service';
import { EndpointService } from '../services/endpoint-service';
import { Analytic } from '../analytics/interfaces/analytic.interface';

import { startsWith } from 'lodash';
import { Observable } from 'rxjs';

const OPERATION_CHAIN_CLASS = 'uk.gov.gchq.gaffer.operation.OperationChain';
const MAP_OPERATION_CLASS = 'uk.gov.gchq.gaffer.operation.impl.Map';

// Used to store and get the selected analytic
@Injectable()
export class AnalyticsService {

  NAMED_OPERATION_CLASS = 'uk.gov.gchq.gaffer.named.operation.NamedOperation';

  constructor(
    private query: QueryService,
    private error: ErrorService,
    private http: HttpClient,
    private router: Router,
    private results: ResultsService,
    private endpoint: EndpointService
  ) { }

  /** Get the type of the results. E.g. TABLE or HTML */
  getOutputVisualisationType(analytic: Analytic) {
    return analytic.outputVisualisation.visualisationType;
  }

  /** Update the value of the given parameter of the analytic operation */
  updateAnalytic(newValue: any, parameterName: any, analytic: Analytic) {

    const parameterKeys = Object.keys(analytic.uiMapping);
    // Look for the parameter in the list of parameters and set the new current value
    for (const parameterKey of parameterKeys) {
      if (parameterKey === parameterName) {
        analytic.uiMapping[parameterKey].currentValue = newValue;
        return analytic;
      }
    }
    return analytic;
  }

  /** Initialise the analytic current values */
  initialiseAnalytic(analytic: Analytic) {
    const parameterKeys = Object.keys(analytic.uiMapping);
    for (const parameterKey of parameterKeys) {
      if (analytic.uiMapping[parameterKey].userInputType === 'boolean') {
        analytic.uiMapping[parameterKey].currentValue = false;
      } else {
        analytic.uiMapping[parameterKey].currentValue = null;
      }
    }
    return analytic;
  }

  /** Execute the analytic operation */
  executeAnalytic(analytic: Analytic): any {
    const operation = {
      class: this.NAMED_OPERATION_CLASS,
      operationName: analytic.operationName,
      parameters: null
    };

    operation.parameters = this.mapParams(analytic);

    const operationChain = this.createOpChain(operation, analytic);

    // Clear the current results
    this.results.clear();

    // Execute the operation chain and then navigate to the results page when finished loading
    this.query.executeQuery(operationChain, () => {
      this.router.navigate([analytic.analyticName, 'results']);
    }, () => { });
  }

  /** Get a map of the parameters and their values. */
  mapParams(analytic: Analytic) {
    if (analytic.uiMapping != null) {
      const parameters = {};
      const parameterKeys = Object.keys(analytic.uiMapping);
      for (const parameterKey of parameterKeys) {
        if (analytic.uiMapping[parameterKey].userInputType === 'iterable') {
          parameters[analytic.uiMapping[parameterKey].parameterName] =
            ['Iterable', analytic.uiMapping[parameterKey].currentValue.split('\n')];
        } else {
          parameters[analytic.uiMapping[parameterKey].parameterName] =
            analytic.uiMapping[parameterKey].currentValue;
        }
      }
      return parameters;
    }
  }

  /** Create an operation chain from the operation */
  createOpChain(operation: any, analytic: Analytic) {
    const operationChain = {
      class: OPERATION_CHAIN_CLASS,
      operations: []
    };
    operationChain.operations.push(operation);

    // If there is an output adapter add it to the end of the operation chain
    if (analytic.outputVisualisation != null && analytic.outputVisualisation.outputAdapter != null) {
      operationChain.operations.push({
        class: MAP_OPERATION_CLASS,
        functions: [
          analytic.outputVisualisation.outputAdapter
        ]
      });
    }
    return operationChain;
  }

  /** Get the analytics from the server */
  getAnalytics(): Observable<Analytic[]> {
    const operation = {
      class: 'uk.gov.gchq.gaffer.analytic.operation.GetAllAnalytics'
    };
    // Configure the http headers
    let header = new HttpHeaders();
    header = header.set('Content-Type', 'application/json; charset=utf-8');
    // Make the http requests
    let queryUrl =
      this.endpoint.getRestEndpoint() + '/graph/operations/execute';
    if (!startsWith(queryUrl, 'http')) {
      queryUrl = 'http://' + queryUrl;
    }
    return this.http.post<Analytic[]>(queryUrl, operation, { headers: header });
  }
}
