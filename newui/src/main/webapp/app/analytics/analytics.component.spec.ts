import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { empty} from "rxjs";

import { AnalyticsComponent } from './analytics.component';
import { AnalyticsService } from '../gaffer/analytics.service';
import { ErrorService } from '../dynamic-input/error.service';

class AnalyticsServiceStub {
  reloadAnalytics = () => {
    return empty();
  }
}

class ErrorServiceStub {}

describe('AnalyticsComponent', () => {
  let component: AnalyticsComponent;
  let fixture: ComponentFixture<AnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [
        { provide: AnalyticsService, useClass: AnalyticsServiceStub},
        { provide: ErrorService, useClass: ErrorServiceStub}
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
