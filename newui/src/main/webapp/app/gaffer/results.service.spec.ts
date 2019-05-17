
import { TestBed, async } from '@angular/core/testing';

import { ResultsService } from './results.service';
import { EventsService } from '../dynamic-input/events.service';

class EventsServiceStub {
    broadcast = (params) => {}
}

describe('ResultsService', () => {
    let service: ResultsService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
          providers: [
            ResultsService,
            { provide: EventsService, useClass: EventsServiceStub},
          ],
        })
        .compileComponents();

        service = TestBed.get(ResultsService);
    }));

    it('should be able to get the results', () => {
        let results = service.results;

        let testResults = service.get();

        expect(testResults).toEqual(results);
    })

    it('should be able to clear the results', () => {
        service.results = [0,1,2];

        service.clear();

        expect(service.results).toEqual([]);
    })

    it('should be able to broadcast that the results have been updated when clearing', () => {
        let events = TestBed.get(EventsService);
        let spy = spyOn(events, 'broadcast');

        service.clear();

        expect(spy).toHaveBeenCalledWith('resultsUpdated',[[]]);
    })
   
    it('should be able to broadcast that the results have been updated when updating', () => {
        let events = TestBed.get(EventsService);
        let spy = spyOn(events, 'broadcast');
        let results = [0,1,2];

        service.update(results);

        expect(spy).toHaveBeenCalledWith('resultsUpdated',[results]);
    })

    it('should be able to convert results to an array if there is only one result', () => {
        let events = TestBed.get(EventsService);
        let spy = spyOn(events, 'broadcast');
        let results = 0;

        service.update(results);

        expect(spy).toHaveBeenCalledWith('resultsUpdated',[[results]]);
    })
});