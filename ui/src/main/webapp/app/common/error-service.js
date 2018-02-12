/*
 * Copyright 2017 Crown Copyright
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

'use strict'

angular.module('app').factory('error', ['$mdToast', '$mdDialog', function($mdToast, $mdDialog) {
    var service = {};

    var addMoreInfo = function(toast, err) {

    }

    service.handle = function(message, err) {

        var msg;

        if (!message) {
            msg = 'Something went wrong. Check log for details';
        } else {
            msg = message;
        }

        var toast = $mdToast.simple()
            .textContent(msg)
            .position('top right')
            .hideDelay(msg.length * 100);

        if (err && err !== '') {
            console.log(err);
            toast
                .action('More info')
                .highlightAction(true)
                .highlightClass('md-accent');
        }

        $mdToast.show(toast)
            .then(function(value) {
                if (value === 'ok') {
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
                    $mdDialog.show(
                        $mdDialog.alert()
                            .title(title)
                            .textContent(content)
                            .ok('close')
                            .ariaLabel('Error dialog')
                            .clickOutsideToClose(true)
                    );
                }
            });
    }


    return service;
}]);