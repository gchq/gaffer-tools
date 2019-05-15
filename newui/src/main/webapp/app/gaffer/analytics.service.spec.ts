import { AnalyticsService } from "./analytics.service";
import { QueryService } from './query.service';
import { ErrorService } from '../dynamic-input/error.service';
import { CommonService } from '../dynamic-input/common.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ResultsService } from './results.service';
import { EndpointService } from '../config/endpoint-service';
import { TestBed, async } from '@angular/core/testing';

class QueryServiceStub {}
class ErrorServiceStub {}
class CommonServiceStub {}
class HttpClientStub {}
class RouterStub {}
class ResultsServiceStub {}
class EndpointServiceStub {}

describe('AnalyticsService', () => {
    let service: AnalyticsService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
          providers: [
            AnalyticsService,
            { provide: QueryService, useClass: QueryServiceStub},
            { provide: ErrorService, useClass: ErrorServiceStub},
            { provide: CommonService, useClass: CommonServiceStub},
            { provide: HttpClient, useClass: HttpClientStub},
            { provide: Router, useClass: RouterStub},
            { provide: ResultsService, useClass: ResultsServiceStub},
            { provide: EndpointService, useClass: EndpointServiceStub},
          ],
        })
        .compileComponents();

        service = TestBed.get(AnalyticsService);
    }));
   
    it('Should get the analytic correctly', () => {
      let analytic = [0,1,2];

      service.arrayAnalytic = analytic;

      expect(service.getAnalytic()).toEqual(analytic);
    });
   
    // it('Should update the analytic correctly', () => {
    //     let parameters = 'Parameters';
    //     let newValue = 'New Value';
    //     let parameterName = 'Parameter Name';
    //     let arrayAnalytic = {
    //         []
    //     }

    //     service.updateAnalytic(parameters, newValue, parameterName);

    //     expect(service.arrayAnalytic).toEqual();
    // })

    it('Should create the array analytic correctly', () => {
        let analytic = {
            uiMapping : {
                key1: {
                    label: "Label",
                    userInputType: "TextBox", 
                    parameterName: "Parameter Name", 
                    inputClass: "java.lang.Integer"
                }
            }
        }
        let arrayAnalytic = {
            uiMapping : [
                [
                    'key1', 
                    {
                        label: "Label",
                        userInputType: "TextBox", 
                        parameterName: "Parameter Name", 
                        inputClass: "java.lang.Integer",
                        currentValue: null
                    }
                ],
            ]
        }

        service.createArrayAnalytic(analytic);

        expect(service.arrayAnalytic).toEqual(arrayAnalytic);
    })
  });