/*
 * Copyright 2017-2018 Crown Copyright
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
        var m = moment(dateString, ['YYYY/MM/DD', 'YYYY-MM-DD', 'YYYY.MM.DD'], true);
        return m.isValid() ? m.toDate() : new Date(NaN);
    }

    $mdDateLocaleProvider.formatDate = function(date) {
        var m = moment(date);
        return m.isValid() ? m.format('YYYY-MM-DD') : '';
    }

}]);
