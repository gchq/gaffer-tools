import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from '../../material.module';
import { EMPTY } from 'rxjs';

import { HtmlComponent } from './html.component';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { ErrorService } from 'src/app/services/error.service';
import { ResultsService } from 'src/app/services/results.service';

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

class AnalyticsServiceStub {
  reloadAnalytics = () => {
    return EMPTY;
  }
}
class ErrorServiceStub {
  handle = data => { };
}
class ResultsServiceStub {
  get = () => {
    return fullResultsData;
  }
}

describe('HtmlComponent', () => {
  let component: HtmlComponent;
  let fixture: ComponentFixture<HtmlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HtmlComponent ],
      providers: [
        { provide: AnalyticsService, useClass: AnalyticsServiceStub },
        { provide: ResultsService, useClass: ResultsServiceStub },
        { provide: ErrorService, useClass: ErrorServiceStub }
      ],
      imports: [MaterialModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
