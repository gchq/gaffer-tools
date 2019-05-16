
import { TestBed, async, tick, fakeAsync } from '@angular/core/testing';
import { QueryService } from './query.service';
import { CommonService } from '../dynamic-input/common.service';
import { ErrorService } from '../dynamic-input/error.service';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../settings/settings.service';
import { ResultsService } from './results.service';
import { EndpointService } from '../config/endpoint-service';
import { empty, from, of } from 'rxjs';

class CommonServiceStub {
    parseUrl = () => {

    }
}
class ErrorServiceStub {
    handle = () => {

    }
}
class HttpClientStub {
    post = () => {
        return empty();
    }
}
class SettingsServiceStub {
    getResultLimit = () => {
        return 1000;
    }
}
class ResultsServiceStub {
    update = () => {

    }
}
class EndpointServiceStub {
    getRestEndpoint = () => {

    }
}

describe('QueryService', () => {
    let service: QueryService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
          providers: [
            QueryService,
            { provide: CommonService, useClass: CommonServiceStub},
            { provide: ErrorService, useClass: ErrorServiceStub},
            { provide: HttpClient, useClass: HttpClientStub},
            { provide: SettingsService, useClass: SettingsServiceStub},
            { provide: ResultsService, useClass: ResultsServiceStub},
            { provide: EndpointService, useClass: EndpointServiceStub},
          ],
        })
        .compileComponents();

        service = TestBed.get(QueryService);
    }));

    it('should show an error notification if too many results', fakeAsync(() => {
        let error = TestBed.get(ErrorService);
        let spy = spyOn(error, 'handle');
        let resultLimit = 1000;
        let message = "Too many results to show, showing only the first " +
                        resultLimit +
                      " rows";
        let testData = Array.apply(null, {length: resultLimit+1}).map(Number.call, Number)
        let http = TestBed.get(HttpClient);
        spyOn(http, 'post').and.returnValue(of(testData));

        service.executeQuery(null,() => {},() => {});

        tick();
        expect(spy).toHaveBeenCalledWith(message,null,null);
    }))
});