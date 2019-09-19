import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableComponent } from './table.component';

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

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TableComponent]
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

    expect(component.data.results).toEqual(expected);
  });

  it('should use "value" as the key for non-object result for column names', () => {
    results = [1, 2, 3];

    fixture.detectChanges();

    expect(component.columnsToDisplay).toEqual(['value']);
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

    expect(component.columnsToDisplay).toEqual(['varA', 'varB']);
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
