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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MatCardModule, MatTooltipModule, MatIconModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { empty, of } from 'rxjs';

import { AnalyticComponent } from './analytic.component';
import { AnalyticsService } from '../analytics.service';
import { HttpClient } from '@angular/common/http';

class RouterStub {
  navigate = () => { };
}
class AnalyticsServiceStub {
  initialiseAnalytic = () => {
    return [];
  }
}

class HttpClientStub {
  get = params => {
    return of([0]);
  }
}

describe('AnalyticComponent', () => {
  let component: AnalyticComponent;
  let fixture: ComponentFixture<AnalyticComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AnalyticComponent],
      providers: [
        { provide: Router, useClass: RouterStub },
        { provide: AnalyticsService, useClass: AnalyticsServiceStub },
        { provide: HttpClient, useClass: HttpClientStub }
      ],
      imports: [MatCardModule, MatTooltipModule, MatIconModule, BrowserAnimationsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticComponent);
    component = fixture.componentInstance;
    component.model = {
      description: 'Test description',
      metaData: {
        icon: '<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\'>' +
          '<path d=\'M0 0h24v24H0z\' fill=\'none\'/>' +
          '<path d=\'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z\'/>' +
          '<path d=\'M0 0h24v24H0z\' fill=\'none\'/></svg>'
      },
      operationName: 'test operation name',
      analyticName: 'test analytic name'
    };
    const http = TestBed.get(HttpClient);
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should navigate on execution of analytic', () => {
    fixture.detectChanges();
    const router = TestBed.get(Router);
    const spy = spyOn(router, 'navigate');

    component.execute([]);

    expect(spy).toHaveBeenCalledWith(['test analytic name']);
  });

  it('should create the named operation on execution of analytic', () => {
    fixture.detectChanges();
    const analyticsService = TestBed.get(AnalyticsService);
    const spy = spyOn(analyticsService, 'initialiseAnalytic');

    component.execute(['Test data']);

    expect(spy).toHaveBeenCalledWith(['Test data']);
  });

  it('should load the default icon', () => {
    const http = TestBed.get(HttpClient);
    const spy = spyOn(http, 'get').and.returnValue(of('svg text'));

    component.ngAfterViewInit();

    expect(spy).toHaveBeenCalledWith('../../assets/defaultIcon.svg', { responseType: 'text' });
  });
});
