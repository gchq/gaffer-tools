import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableModule, MatCardModule, MatTableDataSource } from '@angular/material';
import { empty} from "rxjs";

import { TableComponent } from './table.component';
import { ErrorService } from '../dynamic-input/error.service';
import { EventsService } from '../dynamic-input/events.service';
import { ResultsService } from '../gaffer/results.service';
import { CommonService } from '../dynamic-input/common.service';

class ErrorServiceStub {}
class EventsServiceStub {
  subscribe = () => {
    return empty();
  }
}
class ResultsServiceStub {
  get = () => {
    return [];
  }
}
class CommonServiceStub {}

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableComponent ],
      imports: [
        MatTableModule,
        MatCardModule
      ],
      providers: [
        { provide: EventsService, useClass: EventsServiceStub },
        { provide: ResultsService, useClass: ResultsServiceStub },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call events subscribe at initialisation', () => {
    let eventsService = TestBed.get(EventsService);
    let spy = spyOn(eventsService, 'subscribe');

    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  })

  it('should get the results at initialisation', () => {
    let resultsService = TestBed.get(ResultsService);
    let spy = spyOn(resultsService, 'get');

    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  })

  it('should update the table at initialisation', () => {
    let spy = spyOn(component, 'onResultsUpdated');

    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  })

  it('should update the results correctly', () => {
    component.data = {
      results: new MatTableDataSource([0])
    };
    let arrayNewResults = [0,1,2]
    fixture.detectChanges();

    component.onResultsUpdated(arrayNewResults)

    expect(component.data.results).toEqual(arrayNewResults);
  })
});
