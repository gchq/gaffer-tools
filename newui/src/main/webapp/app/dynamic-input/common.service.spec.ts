import { TestBed, async} from '@angular/core/testing';

import { CommonService } from './common.service';

describe('CommonService', () => {
    let service: CommonService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
          providers: [
            CommonService,
          ],
        })
        .compileComponents();

        service = TestBed.get(CommonService);
    }));

    it('should be able to check whether a string starts with a given prefix', () => {
        let prefix = 'w';
        let str = 'word';

        let result = service.startsWith(str,prefix);

        expect(result).toBeTruthy();
    })

    it('should be able to append http:// to a url', () => {
        let url = '/some/fake/url';

        let parsedUrl = service.parseUrl(url);

        expect(parsedUrl).toEqual('http://' + url);
    })

    it('should be able to find an object in an array', () => {
        let object = {key1 : 'some value'};
        let array = [0,object,2];

        let result = service.arrayContainsObject(array, object);

        expect(result).toBeTruthy();
    })

    it('should not be able to find an object in an array', () => {
        let object = {key1 : 'some value'};
        let array = [0,1,2];

        let result = service.arrayContainsObject(array, object);

        expect(result).toBeFalsy();
    })
});