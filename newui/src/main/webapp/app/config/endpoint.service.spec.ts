import { EndpointService } from '../config/endpoint-service';
import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { empty, Observable, from, throwError, of} from "rxjs";

describe('EndpointService', () => {
    let service: EndpointService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
          providers: [
            EndpointService,
          ],
        })
        .compileComponents();

        service = TestBed.get(EndpointService);
    }));

    it('should get the REST endpoint correctly', () => {
        let endpoint = service.defaultRestEndpoint;

        let testEndpoint = service.getRestEndpoint();

        expect(testEndpoint).toEqual(endpoint);
    })

    it('should get the UI endpoint correctly', () => {
        let endpoint = service.defaultUIEndpoint;

        let testEndpoint = service.getUIEndpoint();

        expect(testEndpoint).toEqual(endpoint);
    })
});