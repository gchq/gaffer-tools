import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableModule, MatCardModule } from '@angular/material';
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
        { provide: ErrorService, useClass: ErrorServiceStub },
        { provide: EventsService, useClass: EventsServiceStub },
        { provide: ResultsService, useClass: ResultsServiceStub },
        { provide: CommonService, useClass: CommonServiceStub }
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
