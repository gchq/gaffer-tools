import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MatCardModule, MatTooltipModule } from '@angular/material';

import { AnalyticComponent } from './analytic.component';
import { AnalyticsService } from '../gaffer/analytics.service';

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
