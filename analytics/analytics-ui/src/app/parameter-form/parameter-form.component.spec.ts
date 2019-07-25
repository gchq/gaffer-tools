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

import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync
} from '@angular/core/testing';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ParameterFormComponent } from './parameter-form.component';
import { AnalyticsService } from '../gaffer/analytics.service';

class AnalyticsServiceStub {
  updateAnalytic = params => { };
  getAnalytic = params => {
    const analytic = {
      uiMapping: []
    };
    return analytic;
  }
}

describe('ParameterFormComponent', () => {
  let component: ParameterFormComponent;
  let fixture: ComponentFixture<ParameterFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ParameterFormComponent],
      imports: [MatFormFieldModule, MatInputModule, BrowserAnimationsModule],
      providers: [{ provide: AnalyticsService, useClass: AnalyticsServiceStub }]
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ParameterFormComponent);
    component = fixture.componentInstance;
    component.parameters = [];
    fixture.detectChanges();
  }));

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should update the analytic on change of input', () => {
    const analyticsService = TestBed.get(AnalyticsService);
    const spy = spyOn(analyticsService, 'updateAnalytic');
    const parameter = 'Test parameter';
    const parameterName = 'Test parameter name';

    component.onChange(parameter, parameterName);

    expect(spy).toHaveBeenCalledWith(parameter, parameterName);
  });

  it('should change the stored parameter value when the input is changed', async(() => {
    const spy = spyOn(component, 'onChange');
    component.parameters = [
      [null, { label: 'label', currentValue: 'new value' }]
    ];
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input')).nativeElement;

    dispatchFakeEvent(input, 'change');

    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  }));

  function createFakeEvent(type: string) {
    const event = document.createEvent('Event');
    event.initEvent(type, true, true);
    return event;
  }

  function dispatchFakeEvent(node: Node | Window, type: string) {
    node.dispatchEvent(createFakeEvent(type));
  }
});
