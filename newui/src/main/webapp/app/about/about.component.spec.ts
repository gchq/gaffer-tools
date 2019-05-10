import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { MatIconModule, MatCardModule, MatDividerModule } from '@angular/material';
import { Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { By } from '@angular/platform-browser';

import { AboutComponent } from './about.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;
  let location: Location;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutComponent ],
      imports: [ 
        MatIconModule,
        MatCardModule,
        MatDividerModule,
        CommonModule,
        RouterTestingModule
       ]
    });

    router = TestBed.get(Router);
    location = TestBed.get(Location);
    fixture = TestBed.createComponent(AboutComponent);
    router.initialNavigation();
  }));

  beforeEach(() => {
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should open link to documentation', () => {
    const debugElements = fixture.debugElement.queryAll(By.css('a'));
    console.log(debugElements);
    const index = debugElements.findIndex(de => de.attributes['href'] === 'https://gchq.github.io/gaffer-doc/');
    console.log(index);
    debugElements[index].nativeElement.click();
    //fixture.detectChanges();
    //tick();
    expect(location.path()).toBe('/analytics');
  });
});
