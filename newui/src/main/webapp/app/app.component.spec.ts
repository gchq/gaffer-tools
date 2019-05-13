import { TestBed, async } from '@angular/core/testing';
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
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    expect(app).toBeTruthy();
  });

  // it(`should have as title 'newui'`, () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.debugElement.componentInstance;
  //   expect(app.title).toEqual('newui');
  // });

  // it('should render title in a h1 tag', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('h1').textContent).toContain('Welcome to newui!');
  // });
});
