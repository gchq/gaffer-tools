/*
 * Copyright 2017-2019 Crown Copyright
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
import { Observable, Observer, observable } from 'rxjs';

@Injectable()
export class ErrorService {
  toastQueue = []; //Queue of observables representing toasts

  constructor(private toastr: ToastrService) {}
  
  /** Add the toast to queue and show on completion of previous toast */
  private showInOrder = function(msg, title, err) {
    // // If there is already a notification in queue, 
    // // show this notification after the last notification in queue
    // let toastObservable;
    // if (this.toastQueue.length > 0) {
    //   // Immediately create the toast observable
    //   toastObservable = Observable.create((observer: Observer<String>) => {
    //     //After completion of the previous notification, show the next notification and start timer
    //     this.toastQueue[this.toastQueue.length - 1].subscribe(
    //       () => {
    //         console.log('This is a notification');
    //         this.showToast(msg, title, err);
    //         setTimeout(() => {
    //           observer.next(null);
    //         }, 7000);
    //       }
    //     );
    //   });
    // }
    // // Show the notification now 
    // else {
    //   // Create an observable that fires after 7 seconds
    //   toastObservable = Observable.create((observer: Observer<String>) => {
    //     console.log('This is a notification');
    //     this.showToast(msg, title, err);
    //     setTimeout(() => {
    //       observer.next(null);
    //     }, 7000);
    //   });
    // }

    // // add this item to the queue
    // this.toastQueue.push(toastObservable); 

    // // Remove the observable from queue after notification has ended
    // let observableSubscription = toastObservable.subscribe(
    //   () => {
    //     console.log('Notification Ended');
    //   }
    // );
  };

  /** Show an error notification */
  private showToast = function(msg, title, err) {

    setTimeout(() => {
      this.toastr.error(msg, title, {
        timeOut : 7000,
        progressBar: true,
        positionClass: 'toast-top-right',
        extendedTimeOut: 2000
      });
    });

  };

  /** Create a notification from an error */
  handle = function(message, title, err) {
    let msg;

    if (!message) {
      msg = "Something went wrong. Check the log for details";
    } else {
      msg = message;
    }

    this.showToast(msg, title, err);
    //this.showInOrder(msg, title, err);
    //this.showInOrder(msg, title, err);
  };
}
