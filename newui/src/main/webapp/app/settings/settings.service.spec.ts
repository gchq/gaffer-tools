import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { empty, Observable, from, throwError, of} from "rxjs";
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

    it('should get the result limit correctly', () => {
        let resultLimit = service.resultLimit;

        let testResultLimit = service.getResultLimit();

        expect(testResultLimit).toEqual(resultLimit);        
    })

    it('should set the result limit correctly', () => {
        let resultLimit = 2000;

        service.setResultLimit(resultLimit);

        let testResultLimit = service.resultLimit;
        expect(testResultLimit).toEqual(resultLimit);
    })
});