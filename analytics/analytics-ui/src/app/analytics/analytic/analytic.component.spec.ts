/*
 * Copyright 2019 Crown Copyright
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
import { MatCardModule, MatTooltipModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AnalyticComponent } from './analytic.component';
import { AnalyticsService } from '../../services/analytics.service';

class RouterStub {
  navigate = () => { };
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
      declarations: [AnalyticComponent],
      providers: [
        { provide: Router, useClass: RouterStub },
        { provide: AnalyticsService, useClass: AnalyticsServiceStub }
      ],
      imports: [MatCardModule, MatTooltipModule, BrowserAnimationsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticComponent);
    component = fixture.componentInstance;
    component.model = {
      description: 'Test description',
      metaData: {
        iconURL: 'Test url'
      }
    };
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

    expect(spy).toHaveBeenCalledWith(['/parameters']);
  });

  it('should create the named operation on execution of analytic', () => {
    fixture.detectChanges();
    const analyticsService = TestBed.get(AnalyticsService);
    const spy = spyOn(analyticsService, 'createArrayAnalytic');

    component.execute(['Test data']);

    expect(spy).toHaveBeenCalledWith(['Test data']);
  });
});
