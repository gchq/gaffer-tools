import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MatCardModule, MatTooltipModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AnalyticComponent } from './analytic.component';
import { AnalyticsService } from '../gaffer/analytics.service';

class RouterStub {
  navigate = () => {}
}
class AnalyticsServiceStub {
  createArrayAnalytic = () => {
    return [];
  }
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
        MatTooltipModule,
        BrowserAnimationsModule
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
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should navigate on execution of analytic', () => {
    fixture.detectChanges();
    let router = TestBed.get(Router);
    let spy = spyOn(router, 'navigate');

    component.execute([]);

    expect(spy).toHaveBeenCalledWith(['/parameters']);
  })

  it('should create the named operation on execution of analytic', () => {
    fixture.detectChanges();
    let analyticsService = TestBed.get(AnalyticsService);
    let spy = spyOn(analyticsService, 'createArrayAnalytic');

    component.execute(['Test data']);

    expect(spy).toHaveBeenCalledWith(['Test data']);
  })
});
