import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputManagerComponent } from './input-manager.component';

describe('InputManagerComponent', () => {
  let component: InputManagerComponent;
  let fixture: ComponentFixture<InputManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
