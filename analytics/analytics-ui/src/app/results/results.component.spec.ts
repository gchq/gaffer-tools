/*
 * Copyright 2019-2020 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatPaginatorModule,
  MatSelectModule,
  MatSortModule,
  MatTableModule
} from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AnalyticsService } from '../analytics/analytics.service';
import { ResultsComponent } from './results.component';
import { ResultsService } from '../services/results.service';
import { ErrorService } from '../services/error.service';
import { Component, Input } from '@angular/core';

const routes: Routes = [
  { path: '**', redirectTo: 'analytics' }
];

@Component({
  selector: 'app-table',
  template: ''
})
class MockTableComponent {
  @Input() model;
}

@Component({
  selector: 'app-html',
  template: ''
})
class MockHtmlComponent {
  @Input() model;
}

class ErrorServiceStub { }
class AnalyticsServiceStub {
  getOutputVisualisationType = () => {
    return 'TABLE';
  }
}
class ResultsServiceStub {
  get = () => {
    return [];
  }
}

describe('ResultsComponent', () => {
  let component: ResultsComponent;
  let fixture: ComponentFixture<ResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResultsComponent, MockTableComponent, MockHtmlComponent],
      imports: [HttpClientTestingModule, BrowserAnimationsModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatPaginatorModule,
        MatSelectModule,
        MatSortModule,
        MatTableModule,
        RouterModule.forRoot(routes)],
      providers: [
        Location,
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        { provide: AnalyticsService, useClass: AnalyticsServiceStub },
        { provide: ErrorService, useClass: ErrorServiceStub },
        { provide: ResultsService, useClass: ResultsServiceStub }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should get the output visualisation type at initialisation', () => {
    const analyticsService = TestBed.get(AnalyticsService);
    const spy = spyOn(analyticsService, 'getOutputVisualisationType');

    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
