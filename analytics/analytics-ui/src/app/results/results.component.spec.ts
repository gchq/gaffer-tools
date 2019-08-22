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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResultsComponent } from './results.component';
import { ResultsService } from '../gaffer/results.service';
import { MatTableModule } from '@angular/material';
import { AnalyticsService } from '../gaffer/analytics.service';

let results;

class ResultsServiceStub {
  get = () => {
    return results;
  }
}
class AnalyticsServiceStub {
  getOutputVisualisationType = () => {
    return 'TABLE';
  }
}

describe('ResultsComponent', () => {
  let component: ResultsComponent;
  let fixture: ComponentFixture<ResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResultsComponent],
      imports: [MatTableModule],
      providers: [{ provide: ResultsService, useClass: ResultsServiceStub },
                  { provide: AnalyticsService, useClass: AnalyticsServiceStub }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should get the results at initialisation', () => {
    const resultsService = TestBed.get(ResultsService);
    const spy = spyOn(resultsService, 'get');

    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should use a "value" key for string results', () => {
    results = ['a', 'b', 'c'];

    fixture.detectChanges();

    const expected = [{
      value: 'a'
    },
    {
      value: 'b'
    },
    {
      value: 'c'
    }
    ];

    expect(component.dataSource.data).toEqual(expected);
  });

  it('should use "value" as the key for non-object result for column names', () => {
    results = [1, 2, 3];

    fixture.detectChanges();

    expect(component.tableColumns).toEqual(['value']);
  });

  it('should use the keys of objects for object results for column names', () => {
    results = [{
      varA: 1
    },
    {
      varB: 'B'
    }
    ];

    fixture.detectChanges();

    expect(component.tableColumns).toEqual(['varA', 'varB']);
  });
});
