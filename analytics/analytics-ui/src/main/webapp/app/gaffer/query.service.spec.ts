
import { TestBed, async} from '@angular/core/testing';
import { empty, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { QueryService } from './query.service';
import { CommonService } from '../dynamic-input/common.service';
import { ErrorService } from '../dynamic-input/error.service';
import { SettingsService } from '../settings/settings.service';
import { ResultsService } from './results.service';
import { EndpointService } from '../config/endpoint-service';

class CommonServiceStub {
    parseUrl = () => {}
}
class ErrorServiceStub {
    handle = () => {}
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
    update = () => {}
}
class EndpointServiceStub {
    getRestEndpoint = () => {}
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

    it('should show an error notification if there are too many results', () => {
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

        expect(spy).toHaveBeenCalledWith(message,null,null);
    })

    it('should store the results retrieved from the server', () => {
        let results = TestBed.get(ResultsService);
        let spy = spyOn(results, 'update');
        let http = TestBed.get(HttpClient);
        let data = [0];
        spyOn(http, 'post').and.returnValue(of(data));

        service.executeQuery(null,() => {},() => {});

        expect(spy).toHaveBeenCalledWith(data);
    })
});