import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationFieldComponent } from './operation-field.component';

describe('OperationFieldComponent', () => {
  let component: OperationFieldComponent;
  let fixture: ComponentFixture<OperationFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
