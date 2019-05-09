import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { Component, Input } from '@angular/core';

import { OperationComponent } from "./operation.component";

@Component({
  selector: 'app-parameter-form',
  template: ''
})
class MockParameterFormComponent {
  @Input() parameters;
}

describe("OperationComponent", () => {
  let component: OperationComponent;
  let fixture: ComponentFixture<OperationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        OperationComponent,
        MockParameterFormComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationComponent);
    component = fixture.componentInstance;
    component.model = {
      uiMapping: {
      }
    }
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
