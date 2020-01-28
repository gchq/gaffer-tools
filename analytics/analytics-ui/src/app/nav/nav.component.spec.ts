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

import { LayoutModule } from '@angular/cdk/layout';
import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatIconModule,
  MatListModule,
  MatSidenavModule,
  MatToolbarModule,
  MatTabsModule
} from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule, Location } from '@angular/common';
import { Routes, Router } from '@angular/router';
import { Component } from '@angular/core';

import { NavComponent } from './nav.component';

@Component({
  template: ''
})
class AnalyticsStubComponent { }

@Component({
  template: ''
})
class ParameterInputStubComponent { }

@Component({
  template: ''
})
class TableStubComponent { }

describe('NavComponent', () => {
  let location: Location;
  let router: Router;
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;
  const routes: Routes = [
    { path: 'analytics', component: AnalyticsStubComponent },
    { path: 'parameters', component: ParameterInputStubComponent },
    { path: 'parameters/:operation', component: ParameterInputStubComponent },
    { path: 'results', component: TableStubComponent },
    { path: '**', redirectTo: 'analytics' }
  ];
  const navLinks = [
    { path: 'analytics', label: 'ANALYTICS' },
    { path: 'parameters', label: 'PARAMETERS' },
    { path: 'results', label: 'RESULTS' }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NavComponent,
        ParameterInputStubComponent,
        TableStubComponent,
        AnalyticsStubComponent
      ],
      imports: [
        NoopAnimationsModule,
        LayoutModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatSidenavModule,
        MatToolbarModule,
        RouterTestingModule.withRoutes(routes),
        MatTabsModule,
        CommonModule
      ]
    });

    router = TestBed.get(Router);
    location = TestBed.get(Location);
    fixture = TestBed.createComponent(NavComponent);
    router.initialNavigation();
  }));

  beforeEach(() => {
    component = fixture.componentInstance;
    component.navLinks = navLinks;
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should contain the correct navigation links', () => {
    fixture.detectChanges();
    expect(component.navLinks).toEqual(navLinks);
  });

  it('should be able to navigate to analytics', fakeAsync(() => {
    router.navigate(['analytics']);
    tick();
    expect(location.path()).toBe('/analytics');
  }));

  it('should be able to navigate to parameters', fakeAsync(() => {
    router.navigate(['parameters']);
    tick();
    expect(location.path()).toBe('/parameters');
  }));

  it('should be able to navigate to results', fakeAsync(() => {
    router.navigate(['results']);
    tick();
    expect(location.path()).toBe('/results');
  }));

  it('should redirect to analytics', fakeAsync(() => {
    router.navigate(['**']);
    tick();
    expect(location.path()).toBe('/analytics');
  }));
});
