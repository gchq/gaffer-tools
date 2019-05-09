import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';

import { ParameterInputComponent } from './parameter-input.component';
import { MatCardModule, MatProgressSpinnerModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { AnalyticsService } from '../gaffer/analytics.service';

@Component({
  selector: 'app-query',
  template: ''
})
class MockOperationComponent {
  @Input() model;
}

class AnalyticsServiceStub {
  getAnalytic = () => {
    return {
      operationName: 'Test operation name'
    }
  }
}

describe('ParameterInputComponent', () => {
  let component: ParameterInputComponent;
  let fixture: ComponentFixture<ParameterInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        ParameterInputComponent,
        MockOperationComponent
       ],
      imports: [
        MatCardModule,
        MatProgressSpinnerModule,
        FormsModule
      ],
      providers: [
        { provide: AnalyticsService, useClass: AnalyticsServiceStub}
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
