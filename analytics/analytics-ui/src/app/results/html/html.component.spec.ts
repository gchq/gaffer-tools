import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EMPTY } from 'rxjs';

import { HtmlComponent } from './html.component';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { ResultsService } from 'src/app/services/results.service';

const htmlData = "<img src='https://cdn.pixabay.com/photo/2018/05/07/10/48/husky-3380548__340.jpg'>"
const expectedOutput = "<mat-card>" + "<img src='https://cdn.pixabay.com/photo/2018/05/07/10/48/husky-3380548__340.jpg'>" + "</mat-card>"
class AnalyticsServiceStub {
  reloadAnalytics = () => {
    return EMPTY;
  }
}
class ResultsServiceStub {
  get = () => {
    return htmlData;
  }
}

describe('HtmlComponent', () => {
  let component: HtmlComponent;
  let fixture: ComponentFixture<HtmlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HtmlComponent],
      providers: [
        { provide: AnalyticsService, useClass: AnalyticsServiceStub },
        { provide: ResultsService, useClass: ResultsServiceStub }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('HTMLDataInput', function() {

  let component: HtmlComponent;
  let fixture: ComponentFixture<HtmlComponent>;
  const htmlContainer: HTMLElement = document.getElementById('htmlContainer');
  if (htmlContainer) {
    htmlContainer.innerHTML = htmlData;
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HtmlComponent],
      providers: [
        { provide: AnalyticsService, useClass: AnalyticsServiceStub },
        { provide: ResultsService, useClass: ResultsServiceStub }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  let output = component.ngAfterViewInit.toString;

  it('should equal', () => {
    expect(output).toEqual(expectedOutput);
  })
});