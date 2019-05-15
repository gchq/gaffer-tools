import { AnalyticsService } from "./analytics.service";
import { QueryService } from './query.service';
import { ErrorService } from '../dynamic-input/error.service';
import { CommonService } from '../dynamic-input/common.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ResultsService } from './results.service';
import { EndpointService } from '../config/endpoint-service';
import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { empty, Observable, from, throwError, of} from "rxjs";

class QueryServiceStub {
    executeQuery = (operation, onSuccess) => {
        onSuccess();
    }
}
class ErrorServiceStub {}
class CommonServiceStub {}
class HttpClientStub {}
class RouterStub {
    navigate = (params) => {

    }
}
class ResultsServiceStub {
    clear = () => {

    }
}
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
   
    it('Should update the analytic correctly', () => {
        let newValue = 8;
        let parameterName = 'key1';
        service.arrayAnalytic = {
            uiMapping : [
                [
                    'key1', 
                    {
                        label: "Label",
                        userInputType: "TextBox", 
                        parameterName: "Parameter Name", 
                        inputClass: "java.lang.Integer",
                    }
                ],
            ]            
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
                        currentValue: newValue
                    }
                ],
            ]
        }

        service.updateAnalytic(newValue, parameterName);

        expect(service.arrayAnalytic).toEqual(arrayAnalytic);
    })

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

    it('Should clear the table results after execution', () => {
        let resultsService = TestBed.get(ResultsService);
        let spy = spyOn(resultsService, 'clear');
        service.arrayAnalytic = {
            operationName: 'Test name'
        }

        service.executeAnalytic();

        expect(spy).toHaveBeenCalled();
    })

    it('Should navigate to the results page after execution', () => {
        let router = TestBed.get(Router);
        let spy = spyOn(router, 'navigate');
        service.arrayAnalytic = {
            operationName: 'Test name'
        }

        service.executeAnalytic();

        expect(spy).toHaveBeenCalledWith(['/results'])
    })

    it('Should execute the analytic correctly', () => {
        let operationName = 'test name';
        service.arrayAnalytic = {
            uiMapping : [
                [
                    'key1', 
                    {
                        label: "Label",
                        userInputType: "TextBox", 
                        parameterName: "param1", 
                        inputClass: "java.lang.Integer",
                        currentValue: 'value1'
                    }
                ],
                [
                    'key2', 
                    {
                        label: "Label",
                        userInputType: "TextBox", 
                        parameterName: "param2", 
                        inputClass: "java.lang.Integer",
                        currentValue: 'value2'
                    }
                ],
            ],
            operationName: operationName
        }
        let parametersMap = {
            param1: 'value1',
            param2: 'value2'
        }
        let operation = {
            class: "uk.gov.gchq.gaffer.named.operation.NamedOperation",
            operationName: operationName,
            parameters: parametersMap
        };
        let queryService = TestBed.get(QueryService);
        let spy = spyOn(queryService, 'executeQuery');

        service.executeAnalytic();

        expect(spy).toHaveBeenCalledWith(operation, jasmine.any(Function));
    });
});