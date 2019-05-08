import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

import { AnalyticComponent } from './analytic.component';
import { AnalyticsService } from '../gaffer/analytics.service';
import { QueryService } from '../gaffer/query.service';
import { CommonService } from '../dynamic-input/common.service';
import { ErrorService } from '../dynamic-input/error.service';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { MatCardModule, MatTooltipModule } from '@angular/material';

class RouterStub {
}

class AnalyticsServiceStub {
}

describe('AnalyticComponent', () => {
  let component: AnalyticComponent;
  let fixture: ComponentFixture<AnalyticComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticComponent ],
      providers: [
        { provide: Router, useClass: RouterStub },
        { provide: AnalyticsService, useClass: AnalyticsServiceStub}
      ],
      imports: [
        MatCardModule,
        MatTooltipModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticComponent);
    component = fixture.componentInstance;
    component.model = {
      description : 'Test description',
      metaData: {
        iconURL: 'Test url',
      }
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
