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
export class ErrorService {

    toastQueue = [];

    private showInOrder = function(toast, err) {

        if (this.toastQueue.length > 0) {
            this.toastQueue[this.toastQueue.length -1].promise.then(function() {
                this.showToast(toast, err);
            });
        } else {
            this.showToast(toast, err);
        }

        this.toastQueue.push(this.$q.defer()); // add this item to the queue
    }

    private showToast = function(toast, err) {
        this.$mdToast.show(toast).then(function(value) {

            if (value === 'ok') { // clicked More info button
                var title = err.status ? err.status : 'Error';
                var content;

                if (typeof err === 'string' || err instanceof String) {
                    content = err;
                } else if (err.simpleMessage) {
                    content = err.simpleMessage;
                } else if (err.message) {
                    content = err.message;
                } else {
                    content = "An unknown error occurred. See the console log for details";
                }
                this.$mdDialog.show(
                    this.$mdDialog.alert()
                        .title(title)
                        .textContent(content)
                        .ok('close')
                        .ariaLabel('Error dialog')
                        .clickOutsideToClose(true)
                ).finally(function() {
                    this.toastQueue[0].resolve(); // start next toast
                    this.toastQueue.splice(0, 1); // remove this item from the queue
                });
            } else {
                this.toastQueue[0].resolve(); // start next toast
                this.toastQueue.splice(0, 1); // remove this item from the queue
            }
        }, 
        function(err) { // when swiped
            this.toastQueue = [];
        });
    }

    handle = function(message, err) {

        var msg;

        if (!message) {
            msg = 'Something went wrong. Check log for details';
        } else {
            msg = message;
        }

        var toast = this.$mdToast.simple()
            .textContent(msg)
            .position('top right')
            .hideDelay(msg.length * 70);

        if (err && err !== '') {
            console.log(err);
            toast
                .action('More info')
                .highlightAction(true);
        }
        this.showInOrder(toast, err);
    }
};
