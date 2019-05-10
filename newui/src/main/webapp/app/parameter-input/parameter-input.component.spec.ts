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
  
  executeAnalytic = () => {

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
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call execute analytic on execute', () => {
    fixture.detectChanges();
    let analyticsService = TestBed.get(AnalyticsService);
    let spy = spyOn(analyticsService, 'executeAnalytic');

    component.executeAnalytic();

    expect(spy).toHaveBeenCalledWith();
  })

  it('should set loading to true on execute', () => {
    fixture.detectChanges();

    component.loading = true;

    expect(component.loading).toBeTruthy();
  })
});
