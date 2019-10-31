import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EMPTY } from 'rxjs';
import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatPaginatorModule,
  MatSelectModule,
  MatSortModule,
  MatTableModule
} from '@angular/material';
import { By } from '@angular/platform-browser'

import { HtmlComponent } from './html.component';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { ResultsService } from 'src/app/services/results.service';

const htmlData = '<img src="https://cdn.pixabay.com/photo/2018/05/07/10/48/husky-3380548__340.jpg">'
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
  const htmlContainer: HTMLElement = document.getElementById('htmlContainer');
  if (htmlContainer) {
    htmlContainer.innerHTML = htmlData;
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HtmlComponent],
      imports: [
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatPaginatorModule,
        MatSelectModule,
        MatSortModule,
        MatTableModule],
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



  it('should equal', () => {
    expect(fixture.debugElement.query(By.css("#htmlContainer")).nativeElement.innerHTML).toEqual(htmlData);
  })
});
