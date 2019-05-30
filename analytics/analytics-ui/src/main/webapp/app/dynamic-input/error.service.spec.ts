import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { ToastrService } from 'ngx-toastr';

import { ErrorService } from './error.service';

class ToastrServiceStub {
    error = (params) => {}
}

describe('ErrorService', () => {
    let service: ErrorService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
          providers: [
            ErrorService,
            { provide: ToastrService, useClass: ToastrServiceStub},
          ],
        })
        .compileComponents();

        service = TestBed.get(ErrorService);
    }));

    it('should be able to show an error notification with a particular message', fakeAsync(() => {
        let toastr = TestBed.get(ToastrService);
        let spy = spyOn(toastr, 'error').and.callFake(() => {});
        let msg = 'message';
        let title = 'title';
        let err = new Error();
        let toastSettings = {
            timeOut : 7000,
            progressBar: true,
            positionClass: 'toast-top-right',
            extendedTimeOut: 2000
        }

        service.handle(msg, title, err);
    
        tick();
        expect(spy).toHaveBeenCalledWith(msg, title, toastSettings);
    }))

    it('should show the default error message if not specified', fakeAsync(() => {
        let toastr = TestBed.get(ToastrService);
        let spy = spyOn(toastr, 'error').and.callFake(() => {});
        let msg = null;
        let title = 'title';
        let err = new Error();
        let toastSettings = {
            timeOut : 7000,
            progressBar: true,
            positionClass: 'toast-top-right',
            extendedTimeOut: 2000
        }
        let defaultMessage = 'Something went wrong. Check the log for details';

        service.handle(msg, title, err);
    
        tick();
        expect(spy).toHaveBeenCalledWith(defaultMessage, title, toastSettings);
    }))
});