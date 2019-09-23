import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableComponent } from './table.component';
import { MatTableDataSource } from '@angular/material';
import { MaterialModule } from 'src/app/material.module';
import { ResultsService } from 'src/app/services/results.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

let results: string[] | number[] | ({ varA: number; varB?: undefined; } | { varB: string; varA?: undefined; })[];
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

class ResultsServiceStub {
  get = () => {
    return fullResultsData;
  }
}

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TableComponent],
      imports: [MaterialModule, BrowserAnimationsModule],
      providers: [{ provide: ResultsService, useClass: ResultsServiceStub }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
