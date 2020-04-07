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

import { TestBed, async } from '@angular/core/testing';

import { ResultsService } from './results.service';

describe('ResultsService', () => {
  let service: ResultsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [ResultsService]
    }).compileComponents();

    service = TestBed.get(ResultsService);
  }));

  it('should be able to get the results', () => {
    const results = service.results;

    const testResults = service.get();

    expect(testResults).toEqual(results);
  });

  it('should be able to clear the results', () => {
    service.results = [0, 1, 2];

    service.clear();

    expect(service.results).toEqual([]);
  });

  it('should be able to convert results to an array if there is only one result', () => {
    const results = 0;

    service.update(results);

    expect(service.results).toEqual([0]);
  });
});
