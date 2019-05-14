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

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ParameterFormComponent);
    component = fixture.componentInstance;
    component.parameters = []
    fixture.detectChanges();
  }));

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call update analytic on change of input', fakeAsync(() => {
    let analyticsService = TestBed.get(AnalyticsService);
    let spy = spyOn(analyticsService, 'updateAnalytic');
    component.parameters = 'Test parameters';
    let parameter = 'Test parameter';
    let parameterName = 'Test parameter name';

    component.onChange(parameter,parameterName);

    expect(spy).toHaveBeenCalledWith(component.parameters,parameter,parameterName);
  }))

  it('should change stored parameter value on change of input', async(() => {
    let spy = spyOn(component, 'onChange');
    component.parameters = [
      [ null, 
        { label : 'label',
        currentValue: 'new value' }
      ]
    ]
    fixture.detectChanges();
    let input = fixture.debugElement.query(By.css('input')).nativeElement;

    dispatchFakeEvent(input, 'change');
    
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  }))

  function createFakeEvent(type: string) {
    const event = document.createEvent('Event');
    event.initEvent(type, true, true);
    return event;
   }
   
  function dispatchFakeEvent(node: Node | Window, type: string) 
   {
     node.dispatchEvent(createFakeEvent(type));
   }
});
