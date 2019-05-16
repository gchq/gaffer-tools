import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { ErrorService } from './error.service';
import { ToastrService } from 'ngx-toastr';

class ToastrServiceStub {
    error = (params) => {

    }
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

    it('should handle an error with message correctly', fakeAsync(() => {
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
});