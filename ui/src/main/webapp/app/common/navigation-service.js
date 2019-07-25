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

'use strict';

angular.module('app').factory('navigation', ['$location', 'events', 'common', function($location, events, common) {

    var navigation = {};

    var currentPage = $location.path().substr(1);

    navigation.getCurrentPage = function() {
        return currentPage;
    }

    navigation.goToQuery = function() {
        navigation.goTo("query");
    }

    navigation.goTo = function(pageName) {
        if(pageName && common.startsWith(pageName, "/")) {
            pageName = pageName.substr(1);
        }
        currentPage = pageName;
        $location.path('/' + pageName);
        events.broadcast('routeChange', [currentPage]);
    }

    return navigation;
}]);
