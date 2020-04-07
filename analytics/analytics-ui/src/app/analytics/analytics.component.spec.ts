/*
 * Copyright 2019-2020 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { Input, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatGridListModule,
  MatFormFieldModule,
  MatCardModule,
  MatTooltipModule,
  MatIconModule,
  MatInputModule
} from '@angular/material';
import { from, throwError, EMPTY } from 'rxjs';
import { AnalyticFilterPipe } from './analytic-filter.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AnalyticsComponent } from './analytics.component';
import { AnalyticsService } from './analytics.service';
import { ErrorService } from '../services/error.service';
import { testAnalytic } from '../services/test/test.analytic';

class AnalyticsServiceStub {
  getAnalytics = () => {
    return EMPTY;
  }
}

@Component({
  selector: 'app-analytic',
  templateUrl: './analytic/analytic.component.html'
})
class AnalyticStubComponent {
  @Input() model;
}

class ErrorServiceStub {
  handle = data => { };
}

describe('AnalyticsComponent', () => {
  let component: AnalyticsComponent;
  let fixture: ComponentFixture<AnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AnalyticsComponent, AnalyticStubComponent, AnalyticFilterPipe],
      providers: [
        { provide: AnalyticsService, useClass: AnalyticsServiceStub },
        { provide: ErrorService, useClass: ErrorServiceStub },
        { provide: AnalyticFilterPipe, useClass: AnalyticFilterPipe }
      ],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        MatFormFieldModule,
        MatGridListModule,
        MatCardModule,
        MatTooltipModule,
        MatIconModule,
        MatInputModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load the analytics at initialisation', () => {
    const spy = spyOn(component, 'getAnalytics');
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith();
  });

  it('should store the analytics it loads from the server', fakeAsync(() => {
    const testData = [testAnalytic];
    const analyticArray = new Array<object>();
    analyticArray.push(testAnalytic);
    const analyticsService = TestBed.get(AnalyticsService);
    spyOn(analyticsService, 'getAnalytics').and.returnValue(
      from([analyticArray])
    );

    component.getAnalytics();
    tick();
    expect(component.analytics).toEqual(testData);
  }));

  it('should show an error notification if it fails to load the analytics', () => {
    const error = new Error();
    const testData = throwError(error);
    const analyticsService = TestBed.get(AnalyticsService);
    spyOn(analyticsService, 'getAnalytics').and.returnValue(testData);
    const errorService = TestBed.get(ErrorService);
    const spy = spyOn(errorService, 'handle');

    component.getAnalytics();

    expect(spy).toHaveBeenCalledWith(
      'Failed to load the analytics, see the console for details',
      null,
      error
    );
  });
});
