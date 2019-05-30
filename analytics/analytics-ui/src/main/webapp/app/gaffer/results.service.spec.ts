
import { TestBed, async } from '@angular/core/testing';

import { ResultsService } from './results.service';

describe('ResultsService', () => {
    let service: ResultsService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
          providers: [
            ResultsService,
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

    it('should be able to convert results to an array if there is only one result', () => {
        let results = 0;

        service.update(results);

        expect(service.results).toEqual([0]);
    })
});