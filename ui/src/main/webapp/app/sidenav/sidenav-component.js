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

angular.module('app').component('sidenav', sidenav());

function sidenav() {
    return {
        templateUrl: 'app/sidenav/sidenav.html',
        controller: SideNavController,
        controllerAs: 'ctrl'
    };
}

function SideNavController(navigation, $route, $routeParams, $location, operationOptions) {
    var vm = this;
    vm.routes = $route.routes
    vm.goTo = navigation.goTo;
    vm.collapsed = false;

    vm.$onInit = function() {
        window.addEventListener('hashchange', vm.hashChangeCallback);
        vm.hashChangeCallback();
    }

    vm.$onDestroy = function() {
        window.removeEventListener(vm.hashChangeCallback);
    }

    vm.hashChangeCallback = function (event) {

        // Get the url parameters
        console.log('//////////////////////////////')
        console.log('event: ', event);
        var params = $route.current.params
        console.log('params: ', params);
        // Load the options config
        var optionsConfig = operationOptions.getDefaultConfiguration();
        console.log('optionsConfig Before: ', optionsConfig);
        console.log('optionsConfig Before: ', optionsConfig.visible[0].value);

        // Overwrite the graph Id setting with the setting from the url parameter.
        if (optionsConfig) {
            optionsConfig.visible.forEach(element => {
                if (element.key == 'gaffer.federatedstore.operation.graphIds') {
                    if (params.graphId) {
                        if (Array.isArray(params.graphId)) {
                            element.value = params.graphId;
                        } else {
                            element.value = [params.graphId];
                        }
                    }
                }
            });
        }
        //var options = operationOptions.getDefaultOperationOptions();
        console.log('optionsConfig After: ', optionsConfig);
        console.log('optionsConfig After: ', optionsConfig.visible[0].value);
        //console.log(options);
        
        // Save this new graph Id setting
        operationOptions.setDefaultConfiguration(optionsConfig);

        // Update the URL parameters
        console.log('graphIds for url: ', params.graphId);
        if (params.graphId) {
            navigation.updateURL(params.graphId);
        } else {
            navigation.updateURL(null);
        }
    }

    vm.isActive = function(route) {
        if(route) {
            if(route.startsWith("/")) {
                route = route.substr(1);
            }
            return route === navigation.getCurrentPage();
        }
        return false;
    }

    vm.collapse = function() {
        vm.collapsed = true;
    }

    vm.expand = function() {
        vm.collapsed = false;
    }
}
