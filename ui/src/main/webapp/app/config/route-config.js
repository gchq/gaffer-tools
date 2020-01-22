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

angular.module('app').config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(false)

    $routeProvider
        .when('/query', {
            title: 'Query',
            template: '<operation-chain></operation-chain>',
            icon: 'query',
            inNav: true
        })
        .when('/my-queries', {
            title: 'My Queries',
            template: '<my-queries></my-queries>',
            icon: 'rerun',
            inNav: true
        })
        .when('/table', {
            title: 'Table',
            template: '<results-table></results-table>',
            icon: 'table',
            inNav: true
        })
        .when('/graph', {
            title: 'Graph',
            template: '<graph-page></graph-page>',
            icon: 'graph',
            inNav: true
        })
        .when('/schema', {
            title: 'Schema',
            templateUrl: 'app/schema/schema-view-page.html',
            icon: 'schema',
            inNav: true
        })
        .when('/raw', {
            title: 'Raw',
            template: '<raw></raw>',
            icon: 'raw',
            inNav: true
        })
        .when('/saved-data', {
            title: 'Saved Data',
            template: '<saved-results></saved-results>',
            icon: 'save',
            inNav: true
        })
        .when('/settings', {
            title: 'Settings',
            template: '<settings-view></settings-view>',
            icon: 'settings',
            inNav: true
        })
        .when('/about', {
            title: 'About',
            template: '<about></about>',
            icon: 'info',
            inNav: true
        })
        .when('/results', {
            redirectTo: '/table'
        })
        .when('/', {
            redirectTo: '/query'
        });
}]);

