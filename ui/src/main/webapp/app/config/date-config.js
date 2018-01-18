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

'use strict';

angular.module('app').config(['$mdDateLocaleProvider', function($mdDateLocaleProvider) {

    $mdDateLocaleProvider.parseDate = function(dateString) {
        if (!dateString || typeof dateString !== "string") {
            return Date(NaN);
        }

        var parts = dateString.split('/');
        if (parts.length === 1) {
            parts = dateString.split('-');
            if (parts.length === 1) {
                parts = dateString.split('.');
                if (parts.length === 1) {
                    return new Date(NaN);
                }
            }
        }

        if (parts.length === 3) {
            var day = Number(parts[0]);
            var month = Number(parts[1]);
            var year = Number(parts[2]);

            return new Date(year, month, day);

        } else {
            return new Date(NaN);
        }


    }

    $mdDateLocaleProvider.formatDate = function(date) {
        return date ? new Intl.DateTimeFormat('en-GB').format(date) : null;
    }
}]);