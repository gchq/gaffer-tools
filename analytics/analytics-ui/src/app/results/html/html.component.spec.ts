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
import { EMPTY } from 'rxjs';
import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatPaginatorModule,
  MatSelectModule,
  MatSortModule,
  MatTableModule
} from '@angular/material';
import { By } from '@angular/platform-browser';

import { HtmlComponent } from './html.component';
import { AnalyticsService } from 'src/app/analytics/analytics.service';
import { ResultsService } from 'src/app/services/results.service';

const htmlData = '<img src="../../../assets/husky.jpg">';
class AnalyticsServiceStub {
  getAnalytics = () => {
    return EMPTY;
  }
}
class ResultsServiceStub {
  get = () => {
    return htmlData;
  }
}

describe('HtmlComponent', () => {
  let component: HtmlComponent;
  let fixture: ComponentFixture<HtmlComponent>;
  const htmlContainer: HTMLElement = document.getElementById('htmlContainer');
  if (htmlContainer) {
    htmlContainer.innerHTML = htmlData;
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HtmlComponent],
      imports: [
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatPaginatorModule,
        MatSelectModule,
        MatSortModule,
        MatTableModule],
      providers: [
        { provide: AnalyticsService, useClass: AnalyticsServiceStub },
        { provide: ResultsService, useClass: ResultsServiceStub }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display input HTML correctly', () => {
    expect(fixture.debugElement.query(By.css('#htmlContainer')).nativeElement.innerHTML).toEqual(htmlData);
  });

  it('should get the results at initialisation', () => {
    const resultsService = TestBed.get(ResultsService);
    const spy = spyOn(resultsService, 'get');

    component.ngAfterViewInit();

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
