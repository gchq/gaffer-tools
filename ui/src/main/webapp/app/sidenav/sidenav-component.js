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

angular.module('app').component('sidenav', sidenav());

function sidenav() {
    return {
        templateUrl: 'app/sidenav/sidenav.html',
        controller: SideNavController,
        controllerAs: 'ctrl'
    };
}

function SideNavController(navigation, config) {
    var vm = this;

    vm.pages = [
        {
          "id": "query",
          "title": "Query",
          "icon": "query"
        },
        {
          "id": "table",
          "title": "Table",
          "icon": "table"
        },
        {
          "id": "graph",
          "title": "Graph",
          "icon": "graph"
        },
        {
          "id": "schema",
          "title": "Schema",
          "icon": "schema"
        },
        {
          "id": "raw",
          "title": "Raw",
          "icon": "raw"
        },
        {
          "id": "settings",
          "title": "Settings",
          "icon": "settings"
        }
    ];

    vm.$onInit = function() {
         config.get().then(function(conf) {
            if(conf && conf.pages && conf.pages.length > 0) {
                vm.pages = angular.copy(conf.pages);
            }
        });
    }

    vm.goTo = navigation.goTo;
    vm.getCurrentPage = function() {
        return navigation.getCurrentPage();
    }

    vm.collapsed = false;

    vm.collapse = function() {
        vm.collapsed = true;
    }

    vm.expand = function() {
        vm.collapsed = false;
    }
}
