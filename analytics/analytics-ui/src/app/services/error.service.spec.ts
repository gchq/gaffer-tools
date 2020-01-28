/*
 * Copyright 2019-2020 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { ToastrService } from 'ngx-toastr';

import { ErrorService } from './error.service';

class ToastrServiceStub {
  error = params => { };
}

describe('ErrorService', () => {
  let service: ErrorService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        ErrorService,
        { provide: ToastrService, useClass: ToastrServiceStub }
      ]
    }).compileComponents();

    service = TestBed.get(ErrorService);
  }));

  it('should be able to show an error notification with a particular message', fakeAsync(() => {
    const toastr = TestBed.get(ToastrService);
    const spy = spyOn(toastr, 'error').and.callFake(() => { });
    const msg = 'message';
    const title = 'title';
    const err = new Error();
    const toastSettings = {
      timeOut: 7000,
      progressBar: true,
      positionClass: 'toast-top-right',
      extendedTimeOut: 2000
    };

    service.handle(msg, title, err);

    tick();
    expect(spy).toHaveBeenCalledWith(msg, title, toastSettings);
  }));

  it('should show the default error message if not specified', fakeAsync(() => {
    const toastr = TestBed.get(ToastrService);
    const spy = spyOn(toastr, 'error').and.callFake(() => { });
    const msg = null;
    const title = 'title';
    const err = new Error();
    const toastSettings = {
      timeOut: 7000,
      progressBar: true,
      positionClass: 'toast-top-right',
      extendedTimeOut: 2000
    };
    const defaultMessage = 'Something went wrong. Check the log for details';

    service.handle(msg, title, err);

    tick();
    expect(spy).toHaveBeenCalledWith(defaultMessage, title, toastSettings);
  }));
});
