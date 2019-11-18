/*
 * Copyright 2019 Crown Copyright
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
import { QueryService } from './query.service';
import { ErrorService } from './error.service';
import { ResultsService } from './results.service';
import { EndpointService } from './endpoint-service';
import testAnalytic from './test/test.analytic';
import { cloneDeep } from 'lodash';
import { UIMappingDetail } from '../analytics/classes/uiMappingDetail.class';

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
  }));

  it('Should be able to get the analytic', () => {
    service.analytic = testAnalytic;

    const result = service.getAnalytic();

    expect(result).toEqual(testAnalytic);
  });

  it('Should be able to update the analytic', () => {
    const newValue = 8;
    const parameterKey = 'key1'
    service.analytic = testAnalytic;

    let expectedAnalytic = cloneDeep(testAnalytic);
    const uiMappingDetail1 = {
      label: 'Label',
      userInputType: 'TextBox',
      parameterName: 'param1',
      inputClass: 'java.lang.Integer',
      currentValue: newValue
    };
    expectedAnalytic.uiMapping.set(parameterKey,new UIMappingDetail().deserialize(uiMappingDetail1));

    service.updateAnalytic(newValue, parameterKey);

    expect(service.analytic).toEqual(expectedAnalytic);
  });

  it('Should be able to clear the table results after execution', () => {
    const resultsService = TestBed.get(ResultsService);
    const spy = spyOn(resultsService, 'clear');
    service.analytic = testAnalytic;

    service.executeAnalytic();

    expect(spy).toHaveBeenCalled();
  });

  it('Should be able to navigate to the results page after execution', () => {
    const router = TestBed.get(Router);
    const spy = spyOn(router, 'navigate');
    service.analytic = testAnalytic;

    service.executeAnalytic();

    expect(spy).toHaveBeenCalledWith([service.analytic.analyticName, 'results']);
  });

  it('Should be able to execute the analytic', () => {
    service.analytic = testAnalytic;

    const params = {
      param1: 'value1',
      param2: 'value2'
    };
    const operation = {
      class: 'uk.gov.gchq.gaffer.operation.OperationChain',
      operations: [{
        class: 'uk.gov.gchq.gaffer.named.operation.NamedOperation',
        operationName: 'test operation name',
        parameters: params
      }]
    };

    const queryService = TestBed.get(QueryService);
    const spy = spyOn(queryService, 'executeQuery');

    service.executeAnalytic();

    expect(spy).toHaveBeenCalledWith(operation, jasmine.any(Function));
  });
});
