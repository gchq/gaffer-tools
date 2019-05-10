import { LayoutModule } from '@angular/cdk/layout';
import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatIconModule,
  MatListModule,
  MatSidenavModule,
  MatToolbarModule,
  MatTabsModule,
} from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';

import { NavComponent } from './nav.component';
import { CommonModule, Location } from '@angular/common';
import { By } from '@angular/platform-browser';
import { RouterLinkWithHref, Routes, Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  template: ''
})
class AboutComponentStub {}

@Component({
  template: ''
})
class AnalyticsComponentStub {}

@Component({
  template: ''
})
class ParameterInputComponentStub {}

@Component({
  template: ''
})
class TableComponentStub {}

describe('NavComponent', () => {
  let location: Location;
  let router: Router;
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;
  const routes: Routes = [
    { path: "about", component: AboutComponentStub },
    { path: "analytics", component: AnalyticsComponentStub },
    { path: "parameters", component: ParameterInputComponentStub },
    { path: "parameters/:operation", component: ParameterInputComponentStub },
    { path: "results", component: TableComponentStub },
    { path: "**", redirectTo: "analytics" }
  ];
  const navLinks = [
    { path: "analytics", label: "ANALYTICS" },
    { path: "parameters", label: "PARAMETERS" },
    { path: "results", label: "RESULTS" },
    { path: "about", label: "ABOUT" }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        NavComponent,
        AboutComponentStub,
        ParameterInputComponentStub,
        TableComponentStub,
        AnalyticsComponentStub
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

  it('should compile', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should contain the correct navigation links', () => {
    fixture.detectChanges();
    expect(component.navLinks).toEqual(navLinks);
  });

  it('should navigate to analytics', fakeAsync(() => {
    router.navigate(['analytics']);
    tick();
    expect(location.path()).toBe('/analytics');
  }))

  it('should navigate to about', fakeAsync(() => {
    router.navigate(['about']);
    tick();
    expect(location.path()).toBe('/about');
  }))

  it('should navigate to parameters', fakeAsync(() => {
    router.navigate(['parameters']);
    tick();
    expect(location.path()).toBe('/parameters');
  }))

  it('should navigate to results', fakeAsync(() => {
    router.navigate(['results']);
    tick();
    expect(location.path()).toBe('/results');
  }))

  it('should redirect to analytics', fakeAsync(() => {
    router.navigate(['**']);
    tick();
    expect(location.path()).toBe('/analytics');
  }))
});
