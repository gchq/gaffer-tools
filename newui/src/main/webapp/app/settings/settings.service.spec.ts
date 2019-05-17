import { TestBed, async} from '@angular/core/testing';

import { SettingsService } from './settings.service';

describe('SettingsService', () => {
    let service: SettingsService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
          providers: [
            SettingsService,
          ],
        })
        .compileComponents();

        service = TestBed.get(SettingsService);
    }));

    it('should be able to get the result limit', () => {
        let resultLimit = service.resultLimit;

        let testResultLimit = service.getResultLimit();

        expect(testResultLimit).toEqual(resultLimit);        
    })

    it('should be able to set the result limit', () => {
        let resultLimit = 2000;

        service.setResultLimit(resultLimit);

        let testResultLimit = service.resultLimit;
        expect(testResultLimit).toEqual(resultLimit);
    })
});