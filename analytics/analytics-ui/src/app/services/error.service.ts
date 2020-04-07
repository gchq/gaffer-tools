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

import { Injectable } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorService {
  constructor(private toastr: ToastrService) {}

  /** Create a notification from an error */
  handle = function(message, title, err) {
    let msg;
    console.error(err);

    // If no message provided, use a default error message
    if (!message) {
      msg = 'Something went wrong. Check the log for details';
    } else {
      msg = message;
    }

    setTimeout(() => {
      this.toastr.error(msg, title, {
        timeOut: 7000,
        progressBar: true,
        positionClass: 'toast-top-right',
        extendedTimeOut: 2000
      });
    });
  };
}
