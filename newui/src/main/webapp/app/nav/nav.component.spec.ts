import { LayoutModule } from '@angular/cdk/layout';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;
  let navLinks = [
    { path: "analytics", label: "ANALYTICS" },
    { path: "parameters", label: "PARAMETERS" },
    { path: "results", label: "RESULTS" },
    { path: "about", label: "ABOUT" }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NavComponent],
      imports: [
        NoopAnimationsModule,
        LayoutModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatSidenavModule,
        MatToolbarModule,
        RouterTestingModule,
        MatTabsModule,
        CommonModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    component.navLinks = navLinks;
  });

  it('should compile', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should contain the correct navlinks', () => {
    fixture.detectChanges();
    expect(component.navLinks).toEqual(navLinks);
  });

  // it('should navigate to analytics', () => {
  //   let href = fixture.debugElement.query(By.css('a')).nativeElement.getAttribute('href');
  //   expect(href).toEqual('/analytics');
  // })
});
