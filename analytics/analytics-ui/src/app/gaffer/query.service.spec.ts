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

import { TestBed, async } from '@angular/core/testing';
import { empty, of, EMPTY } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { QueryService } from './query.service';
import { CommonService } from '../dynamic-input/common.service';
import { ErrorService } from '../dynamic-input/error.service';
import { ResultsService } from './results.service';
import { EndpointService } from '../config/endpoint-service';

class CommonServiceStub {
  parseUrl = () => { };
}
class ErrorServiceStub {
  handle = () => { };
}
class HttpClientStub {
  post = () => {
    return EMPTY;
  }
}

class ResultsServiceStub {
  update = () => { };
}
class EndpointServiceStub {
  getRestEndpoint = () => { };
}

describe('QueryService', () => {
  let service: QueryService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        QueryService,
        { provide: CommonService, useClass: CommonServiceStub },
        { provide: ErrorService, useClass: ErrorServiceStub },
        { provide: HttpClient, useClass: HttpClientStub },
        { provide: ResultsService, useClass: ResultsServiceStub },
        { provide: EndpointService, useClass: EndpointServiceStub }
      ]
    }).compileComponents();

    service = TestBed.get(QueryService);
  }));

  it('should show an error notification if there are too many results', () => {
    const error = TestBed.get(ErrorService);
    const spy = spyOn(error, 'handle');
    const resultLimit = 1000;
    const message =
      'Too many results to show, showing only the first ' +
      resultLimit +
      ' rows';
    const testData = Array.apply(null, { length: resultLimit + 1 }).map(
      Number.call,
      Number
    );
    const http = TestBed.get(HttpClient);
    spyOn(http, 'post').and.returnValue(of(testData));

    service.executeQuery(null, () => { }, () => { });

    expect(spy).toHaveBeenCalledWith(message, null, null);
  });

  it('should store the results retrieved from the server', () => {
    const results = TestBed.get(ResultsService);
    const spy = spyOn(results, 'update');
    const http = TestBed.get(HttpClient);
    const data = [0];
    spyOn(http, 'post').and.returnValue(of(data));

    service.executeQuery(null, () => { }, () => { });

    expect(spy).toHaveBeenCalledWith(data);
  });
});
