import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ParameterFormComponent } from './parameter-form.component';
import { AnalyticsService } from '../gaffer/analytics.service';

class AnalyticsServiceStub {
  updateAnalytic = () => {

  }
}

describe('ParameterFormComponent', () => {
  let component: ParameterFormComponent;
  let fixture: ComponentFixture<ParameterFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParameterFormComponent ],
      imports: [
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: AnalyticsService, useClass: AnalyticsServiceStub}
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterFormComponent);
    component = fixture.componentInstance;
    component.parameters = []
    fixture.detectChanges();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  // it('should throw an error if parameters are not defined', () => {
  //   fixture.detectChanges();
  //   expect(component).toBeTruthy();
  // });

  // it('should call update analytic on change of input', fakeAsync(() => {
  //   let analyticsService = TestBed.get(AnalyticsService);
  //   let spy = spyOn(analyticsService, 'updateAnalytic');
  //   component.parameters = [
  //     [ null, 
  //       { label : 'label',
  //       currentValue: 'value' }
  //     ]
  //   ]

  //   setInputValue('label', 'Test Input Value');
  //   fixture.detectChanges();

  //   expect(spy).toHaveBeenCalled();
  // }))

  // function setInputValue(selector: string, value: string) {
  //   fixture.detectChanges();
  //   tick();

  //   let input = fixture.debugElement.query(By.css(selector)).nativeElement;
  //   input.value = value;
  //   input.dispatchEvent(new Event('input'));
  //   tick();
  // }
});
