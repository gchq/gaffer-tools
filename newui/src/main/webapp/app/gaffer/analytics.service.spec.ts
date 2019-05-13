// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { empty} from "rxjs";

// import { AnalyticsComponent } from '../analytics/analytics.component';
// import { AnalyticsService } from '../gaffer/analytics.service';
// import { ErrorService } from '../dynamic-input/error.service';

// class ErrorServiceStub {}

// describe('AnalyticsService', () => {
//   let component: AnalyticsService;
//   let fixture: ComponentFixture<AnalyticsService>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ AnalyticsService ],
//     //   schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
//       providers: [
//         // { provide: ErrorService, useClass: ErrorServiceStub}
//       ],
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(AnalyticsService);
//     component = fixture.componentInstance;
//   });

//   it('should be created', () => {
//     fixture.detectChanges();
//     expect(component).toBeTruthy();
//   });

// //   it('should call reload analytics at initialisation', () => {
// //     let spy = spyOn(component, 'reloadAnalytics');
// //     fixture.detectChanges();
// //     expect(spy).toHaveBeenCalledWith();
// //   })
// });
