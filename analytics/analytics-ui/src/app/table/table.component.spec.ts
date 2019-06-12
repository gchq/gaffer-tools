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
  MatTableModule,
  MatCardModule,
  MatTableDataSource
} from '@angular/material';
import { empty, of } from 'rxjs';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TableComponent } from './table.component';
import { ResultsService } from '../gaffer/results.service';
import { TypeService } from '../gaffer/type.service';
import { TimeService } from '../gaffer/time.service';
import { SchemaService } from '../gaffer/schema.service';
import { ErrorService } from '../dynamic-input/error.service';


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
  columns: [ 'SOURCE', 'result type', 'value', 'GROUP', 'DESTINATION', 'DIRECTED', 'prop2', 'count', 'prop1' ],
  allColumns: [ 'SOURCE', 'result type', 'value', 'GROUP', 'DESTINATION', 'DIRECTED', 'prop2', 'count', 'prop1' ],
  groups: [ 'BasicEdge1', 'BasicEdge2', 'BasicEntity1', 'BasicEntity2', '' ],
  allGroups: [ 'BasicEdge1', 'BasicEdge2', 'BasicEntity1', 'BasicEntity2', '' ],
  types: [ 'Edge', 'Entity', 'String', 'Integer', 'EntitySeed' ],
  allTypes: [ 'Edge', 'Entity', 'String', 'Integer', 'EntitySeed' ],
  tooltips: {}
};

const types = {
    'java.util.Date': {
      fields: [
        {
          type: 'number',
          step: '1',
          class: 'java.util.Date'
        }
      ],
      wrapInJson: true
    },
    'java.lang.Boolean': {
      fields: [
        {
          type: 'checkbox',
          class: 'java.lang.Boolean',
          required: true
        }
      ]
    },
    boolean: {
      fields: [
        {
          type: 'checkbox',
          class: 'java.lang.Boolean',
          required: true
        }
      ]
    },
    'java.lang.Long': {
      fields: [
        {
          type: 'number',
          step: '1',
          class: 'java.lang.Long',
          required: true
        }
      ],
      wrapInJson: true
    },
    long: {
      fields: [
        {
          type: 'number',
          step: '1',
          class: 'java.lang.Long',
          required: true
        }
      ],
      wrapInJson: true
    },
    'java.lang.Integer': {
      fields: [
        {
          type: 'number',
          step: '1',
          class: 'java.lang.Integer',
          required: true
        }
      ]
    },
    integer: {
      fields: [
        {
          type: 'number',
          step: '1',
          class: 'java.lang.Integer',
          required: true
        }
      ]
    },
    int: {
      fields: [
        {
          type: 'number',
          step: '1',
          class: 'java.lang.Integer',
          required: true
        }
      ]
    },
    'java.lang.Short': {
      fields: [
        {
          type: 'number',
          step: '1',
          class: 'java.lang.Short',
          required: true
        }
      ],
      wrapInJson: true
    },
    short: {
      fields: [
        {
          type: 'number',
          step: '1',
          class: 'java.lang.Short',
          required: true
        }
      ],
      wrapInJson: true
    },
    'java.lang.Double': {
      fields: [
        {
          type: 'number',
          step: '0.1',
          class: 'java.lang.Double',
          required: true
        }
      ],
      wrapInJson: true
    },
    double: {
      fields: [
        {
          type: 'number',
          step: '0.1',
          class: 'java.lang.Double',
          required: true
        }
      ],
      wrapInJson: true
    },
    'java.lang.Float': {
      fields: [
        {
          type: 'number',
          step: '0.1',
          class: 'java.lang.Float',
          required: true
        }
      ],
      wrapInJson: true
    },
    float: {
      fields: [
        {
          type: 'number',
          step: '0.1',
          class: 'java.lang.Float',
          required: true
        }
      ],
      wrapInJson: true
    },
    'java.lang.String': {
      fields: [
        {
          type: 'text',
          class: 'java.lang.String',
          required: true
        }
      ]
    },
    'java.lang.Class': {
      fields: [
        {
          type: 'text',
          class: 'java.lang.Class',
          required: true
        }
      ]
    },
    'uk.gov.gchq.gaffer.types.TypeValue': {
      fields: [
        {
          label: 'Type',
          type: 'text',
          key: 'type',
          class: 'java.lang.String'
        },
        {
          label: 'Value',
          type: 'text',
          key: 'value',
          class: 'java.lang.String',
          required: true
        }
      ],
      wrapInJson: true
    },
    'uk.gov.gchq.gaffer.types.TypeSubTypeValue': {
      fields: [
        {
          label: 'Type',
          type: 'text',
          key: 'type',
          class: 'java.lang.String'
        },
        {
          label: 'Sub Type',
          type: 'text',
          key: 'subType',
          class: 'java.lang.String'
        },
        {
          label: 'Value',
          type: 'text',
          key: 'value',
          class: 'java.lang.String',
          required: true
        }
      ],
      wrapInJson: true
    },
    'com.clearspring.analytics.stream.cardinality.HyperLogLogPlus': {
      fields: [
        {
          label: 'cardinality',
          type: 'number',
          key: 'hyperLogLogPlus.cardinality',
          class: 'java.lang.Integer',
          step: 1,
          required: true
        }
      ],
      custom: true,
      wrapInJson: true
    },
    JSON: {
      fields: [
        {
          label: 'JSON',
          type: 'textarea',
          class: ''
        }
      ],
      wrapInJson: false
    }
};
const schema = {
  entities: {
      BasicEntity1: {
          properties: {
              count: 'long'
          }
      },
      BasicEntity2: {
          properties: {
              count: 'long'
          }
      }
  },
  edges: {
      BasicEdge1: {
          properties: {
              count: 'long'
          }
      }
  },
  types: {
      long: {
          class: 'java.lang.Long'
      }
  }
};

class ResultsServiceStub {
  get = () => {
    return fullResultsData;
  }
}
class SchemaServiceStub {
  get = () => {
    return of(schema);
  }
}
class ErrorServiceStub {}

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TableComponent],
      imports: [MatTableModule, MatCardModule, HttpClientTestingModule],
      providers: [{ provide: ResultsService, useClass: ResultsServiceStub },
                  TypeService,
                  TimeService,
                  { provide: SchemaService, useClass: SchemaServiceStub },
                  { provide: ErrorService, useClass: ErrorServiceStub },
                  ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    const typeService = TestBed.get(TypeService);
    spyOn(typeService, 'get').and.returnValue(of(types));
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

  it('should update the table at initialisation', () => {
    const spy = spyOn(component, 'updateFilteredResults');

    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should format the data correctly', () => {
    fixture.detectChanges();

    expect(component.data.results.data).toEqual(fullData.results);

  });

  it('should have the correct columns', () => {
    fixture.detectChanges();

    expect(component.columnsToDisplay).toEqual(fullData.allColumns);
  });

});
