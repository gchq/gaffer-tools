import { LayoutModule } from "@angular/cdk/layout";
import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import {
  MatButtonModule,
  MatIconModule,
  MatListModule,
  MatSidenavModule,
  MatToolbarModule,
  MatTabsModule
} from "@angular/material";
import { RouterTestingModule } from "@angular/router/testing";
import { CommonModule, Location } from "@angular/common";
import { Routes, Router } from "@angular/router";
import { Component } from "@angular/core";

import { NavComponent } from "./nav.component";

@Component({
  template: ""
})
class AnalyticsComponentStub {}

@Component({
  template: ""
})
class ParameterInputComponentStub {}

@Component({
  template: ""
})
class TableComponentStub {}

describe("NavComponent", () => {
  let location: Location;
  let router: Router;
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;
  const routes: Routes = [
    { path: "analytics", component: AnalyticsComponentStub },
    { path: "parameters", component: ParameterInputComponentStub },
    { path: "parameters/:operation", component: ParameterInputComponentStub },
    { path: "results", component: TableComponentStub },
    { path: "**", redirectTo: "analytics" }
  ];
  const navLinks = [
    { path: "analytics", label: "ANALYTICS" },
    { path: "parameters", label: "PARAMETERS" },
    { path: "results", label: "RESULTS" }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NavComponent,
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

  it("should be created", () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should contain the correct navigation links", () => {
    fixture.detectChanges();
    expect(component.navLinks).toEqual(navLinks);
  });

  it("should be able to navigate to analytics", fakeAsync(() => {
    router.navigate(["analytics"]);
    tick();
    expect(location.path()).toBe("/analytics");
  }));

  it("should be able to navigate to parameters", fakeAsync(() => {
    router.navigate(["parameters"]);
    tick();
    expect(location.path()).toBe("/parameters");
  }));

  it("should be able to navigate to results", fakeAsync(() => {
    router.navigate(["results"]);
    tick();
    expect(location.path()).toBe("/results");
  }));

  it("should redirect to analytics", fakeAsync(() => {
    router.navigate(["**"]);
    tick();
    expect(location.path()).toBe("/analytics");
  }));
});
