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
import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatPaginatorModule,
  MatSelectModule,
  MatSortModule,
  MatTableModule
} from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AnalyticsService } from '../services/analytics.service';
import { ResultsComponent } from './results.component';
import { ResultsService } from '../services/results.service';
import { ErrorService } from '../services/error.service';
import { TableComponent } from './table/table.component';
import { HtmlComponent } from './html/html.component';

const routes: Routes = [
  { path: '**', redirectTo: 'analytics' }
];

const fullResultsData = [
  {
    class: 'test.Entity',
    group: 'BasicEntity1',
    vertex: 'vertex1',
    properties: {
      count: 1,
      prop1: 'value1'
    }
  },
  {
    class: 'test.Entity',
    group: 'BasicEntity1',
    vertex: 'vertex2',
    properties: {
      count: 2,
      prop1: 'value2'
    }
  },
  {
    class: 'test.Entity',
    group: 'BasicEntity2',
    vertex: 'vertex1',
    properties: {
      count: 1,
      prop2: 'value1'
    }
  },
  {
    class: 'test.Edge',
    group: 'BasicEdge1',
    source: 'source1',
    destination: 'destination1',
    directed: true,
    properties: {
      count: 1,
      prop1: 'value1'
    }
  },
  {
    class: 'test.Edge',
    group: 'BasicEdge1',
    source: 'source2',
    destination: 'destination2',
    directed: true,
    properties: {
      count: 2,
      prop1: 'value2'
    }
  },
  {
    class: 'test.Edge',
    group: 'BasicEdge2',
    source: 'source1',
    destination: 'destination1',
    directed: true,
    properties: {
      count: 1,
      prop2: 'value1'
    }
  },
  {
    class: 'String',
    value: 'value1'
  },
  {
    class: 'Integer',
    value: 4
  },
  {
    class: 'EntitySeed',
    vertex: 'vertex1'
  }
];

const fullData = {
  results: [
    {
      'result type': 'Edge',
      GROUP: 'BasicEdge2',
      SOURCE: 'source1',
      DESTINATION: 'destination1',
      DIRECTED: true,
      count: 1,
      prop2: 'value1'
    },
    {
      'result type': 'Edge',
      GROUP: 'BasicEdge1',
      SOURCE: 'source1',
      DESTINATION: 'destination1',
      DIRECTED: true,
      count: 1,
      prop1: 'value1'
    },
    {
      'result type': 'Edge',
      GROUP: 'BasicEdge1',
      SOURCE: 'source2',
      DESTINATION: 'destination2',
      DIRECTED: true,
      count: 2,
      prop1: 'value2'
    },
    {
      'result type': 'Entity',
      GROUP: 'BasicEntity2',
      SOURCE: 'vertex1',
      count: 1,
      prop2: 'value1'
    },
    {
      'result type': 'Entity',
      GROUP: 'BasicEntity1',
      SOURCE: 'vertex1',
      count: 1,
      prop1: 'value1'
    },
    {
      'result type': 'Entity',
      GROUP: 'BasicEntity1',
      SOURCE: 'vertex2',
      count: 2,
      prop1: 'value2'
    },
    {
      GROUP: '',
      'result type': 'String',
      value: 'value1'
    },
    {
      GROUP: '',
      'result type': 'Integer',
      value: 4
    },
    {
      GROUP: '',
      'result type': 'EntitySeed',
      SOURCE: 'vertex1'
    }
  ],
  columns: ['SOURCE', 'result type', 'value', 'GROUP', 'DESTINATION', 'DIRECTED', 'prop2', 'count', 'prop1'],
  allColumns: ['SOURCE', 'result type', 'value', 'GROUP', 'DESTINATION', 'DIRECTED', 'prop2', 'count', 'prop1'],
  groups: ['BasicEdge1', 'BasicEdge2', 'BasicEntity1', 'BasicEntity2', ''],
  allGroups: ['BasicEdge1', 'BasicEdge2', 'BasicEntity1', 'BasicEntity2', ''],
  types: ['Edge', 'Entity', 'String', 'Integer', 'EntitySeed'],
  allTypes: ['Edge', 'Entity', 'String', 'Integer', 'EntitySeed'],
  tooltips: {}
};

class ResultsServiceStub {
  get = () => {
    return fullResultsData;
  }
}

class ErrorServiceStub { }

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
      declarations: [ResultsComponent, TableComponent, HtmlComponent],
      imports: [HttpClientTestingModule, BrowserAnimationsModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatPaginatorModule,
        MatSelectModule,
        MatSortModule,
        MatTableModule,
        RouterModule.forRoot(routes)],
      providers: [{ provide: ResultsService, useClass: ResultsServiceStub },
        Location,
      { provide: LocationStrategy, useClass: PathLocationStrategy },
      { provide: AnalyticsService, useClass: AnalyticsServiceStub },
      { provide: ErrorService, useClass: ErrorServiceStub },
      ]
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

});
