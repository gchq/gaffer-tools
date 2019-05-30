import { TestBed, async} from '@angular/core/testing';

import { EndpointService } from '../config/endpoint-service';

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

    it('should be able to get the REST endpoint', () => {
        let endpoint = service.defaultRestEndpoint;

        let testEndpoint = service.getRestEndpoint();

        expect(testEndpoint).toEqual(endpoint);
    })
});