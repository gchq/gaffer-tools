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

angular.module('app').factory('navigation', ['$location', '$route', 'common', function($location, $route, common) {

    var navigation = {};

    var currentPage = $location.path().substr(1);

    navigation.getCurrentPage = function() {
        return currentPage;
    }

    navigation.goToQuery = function() {
        navigation.goTo("query");
    }

    navigation.goTo = function(pageName) {
        console.log("page going to is: ", pageName)
        if(pageName && common.startsWith(pageName, "/")) {
            pageName = pageName.substr(1);
        }
        currentPage = pageName;
        $location.path('/' + pageName);
    }

    navigation.updateURL = function(graphIds) {
        var pageName = window.location.href.split('!/')[1].split('?')[0]
        console.log('pageName is: ', pageName)
        if (graphIds != null && graphIds.length > 0) {
            var params = {graphId: graphIds}
            $location.path('/' + pageName).search(params);
        } else {
            $location.path('/' + pageName).search('graphId',null);
        }
        // If updating url directly while on settings page, then update the ui with the new values
        if (pageName == 'settings') {
            $route.reload()
        }
    }

    return navigation;
}]);
