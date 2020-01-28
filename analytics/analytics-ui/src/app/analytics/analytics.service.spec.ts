/*
 * Copyright 2019-2020 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { TestBed, async } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { AnalyticsService } from './analytics.service';
import { AnalyticStoreService } from './analytic-store.service';
import { QueryService } from '../services/query.service';
import { ErrorService } from '../services/error.service';
import { ResultsService } from '../services/results.service';
import { EndpointService } from '../services/endpoint-service';
import { UIMappingDetail } from '../analytics/interfaces/uiMappingDetail.interface';
import { testAnalytic } from '../services/test/test.analytic';

import { cloneDeep } from 'lodash';

class QueryServiceStub {
  executeQuery = (operation, onSuccess) => {
    onSuccess();
  }
}
class ErrorServiceStub {
  handle = () => { };
}
class CommonServiceStub {
  startsWith = (str, prefix) => {
    // to support ES5
    return str.indexOf(prefix) === 0;
  }
  parseUrl = url => {
    if (!this.startsWith(url, 'http')) {
      url = 'http://' + url;
    }

    return url;
  }
}
class HttpClientStub {
  post = params => {
    return;
  }
}
class RouterStub {
  navigate = params => { };
}
class ResultsServiceStub {
  clear = () => { };
}
class EndpointServiceStub {
  getRestEndpoint = () => {
    return 'http://localhost:8080' + '/rest/latest';
  }
}

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let store: AnalyticStoreService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        AnalyticsService,
        { provide: QueryService, useClass: QueryServiceStub },
        { provide: ErrorService, useClass: ErrorServiceStub },
        { provide: HttpClient, useClass: HttpClientStub },
        { provide: Router, useClass: RouterStub },
        { provide: ResultsService, useClass: ResultsServiceStub },
        { provide: EndpointService, useClass: EndpointServiceStub }
      ]
    }).compileComponents();

    service = TestBed.get(AnalyticsService);
    store = TestBed.get(AnalyticStoreService);
    store.analytic = cloneDeep(testAnalytic);
  }));

  it('Should be able to update the analytic', () => {
    const newValue = 'newValue';
    const parameterKey = 'key1';

    const expectedAnalytic = cloneDeep(testAnalytic);
    const uiMappingDetail1 = {
      label: 'Label',
      userInputType: 'TextBox',
      parameterName: 'param1',
      inputClass: 'java.lang.String',
      currentValue: newValue
    };
    expectedAnalytic.uiMapping[parameterKey] = uiMappingDetail1;

    service.updateAnalytic(newValue, parameterKey, store.analytic);

    expect(store.analytic).toEqual(expectedAnalytic);
  });

  it('Should be able to clear the table results after execution', () => {
    const resultsService = TestBed.get(ResultsService);
    const spy = spyOn(resultsService, 'clear');

    service.executeAnalytic(store.analytic);

    expect(spy).toHaveBeenCalled();
  });

  it('Should be able to navigate to the results page after execution', () => {
    const router = TestBed.get(Router);
    const spy = spyOn(router, 'navigate');

    service.executeAnalytic(store.analytic);

    expect(spy).toHaveBeenCalledWith([store.analytic.analyticName, 'results']);
  });

  it('Should be able to execute the analytic', () => {
    store.analytic = testAnalytic;

    const params = {
      param1: 'value1',
      param2: 2
    };
    const operation = {
      class: 'uk.gov.gchq.gaffer.operation.OperationChain',
      operations: [{
        class: 'uk.gov.gchq.gaffer.named.operation.NamedOperation',
        operationName: 'test operation name',
        parameters: params
      },
      {
        class: 'uk.gov.gchq.gaffer.operation.impl.Map',
        functions: ['test output adapter']
      }]
    };

    const queryService = TestBed.get(QueryService);
    const spy = spyOn(queryService, 'executeQuery');

    service.executeAnalytic(store.analytic);

    expect(spy).toHaveBeenCalledWith(operation, jasmine.any(Function), jasmine.any(Function));
  });
});
