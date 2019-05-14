import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { MatToolbarModule} from '@angular/material';
import { Component } from '@angular/core';

import { AppComponent } from './app.component';

@Component({
  selector: 'app-nav',
  template: ''
})
class MockNavComponent {
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        MockNavComponent
      ],
      imports: [
        MatToolbarModule,
      ]
    }).compileComponents();
  }));

  it('should be created', () => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.debugElement.componentInstance;
    //component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have the correct title', () => {
    let title = 'Analytic UI';

    expect(component.title).toEqual(title)
  })
});
