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

function SideNavController($route, navigation, operationOptions, config) {
    var vm = this;
    vm.routes = $route.routes
    vm.goTo = navigation.goTo;
    vm.collapsed = false;

    vm.$onInit = function() {
        // Listen for changes in the url
        window.addEventListener('hashchange', vm.hashChangeCallback);
        // Check if there are initial parameters on loading the site. First get the config and save it.
        getConfig()
    }

    vm.$onDestroy = function() {
        window.removeEventListener(vm.hashChangeCallback);
    }

    /**
     * If the default configuration is not yet set by the user, get the default operation options from the config.
     */ 
    var getConfig = function() {
        config.get().then(function(conf) {
            var optionsConfig = angular.copy(conf.operationOptions);
            if (optionsConfig) {
                if (optionsConfig.visible === undefined) {
                    optionsConfig.visible = [];
                } 
                if (optionsConfig.hidden === undefined) {
                    optionsConfig.hidden = [];
                }

                for (var visibleOrHidden in optionsConfig) {
                    for (var i in optionsConfig[visibleOrHidden]) {
                        var option = optionsConfig[visibleOrHidden][i];
                        if (option.value) {
                            if (option.multiple && !Array.isArray(option.value)) {
                                option.value = [ option.value ]
                            }
                            vm.presets = {}
                            vm.presets[option.key] = option.value;
                        } else if (option.multiple) {
                            option.value = [];
                        }
                    }
                }
            } else if (conf.operationOptionKeys) {
                console.warn('UI "operationOptionKeys" config is deprecated. See the docs for the new options configuration.');

                optionsConfig = {
                    visible: [],
                    hidden: []
                };

                for (var label in conf.operationOptionKeys) {
                    var option = {
                        'key': conf.operationOptionKeys[label],
                        'label': label
                    };

                    optionsConfig.visible.push(option);
                }
            }
            operationOptions.setDefaultConfiguration(optionsConfig);
            // Check if there are initial parameters on loading the site.
            vm.hashChangeCallback()
        });
    }

    /**
     * Save the url parameters
     */
    vm.hashChangeCallback = function (event) {

        // Get the url parameters
        var params = $route.current.params

        // Load the options config
        var optionsConfig = operationOptions.getDefaultConfiguration();

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
        
        // Save this new graph Id setting
        operationOptions.setDefaultConfiguration(optionsConfig);

        // If updating the URL directly while on the settings page, then reload the settings page to update the UI
        var pageName = window.location.href.split('!/')[1].split('?')[0]
        if (pageName == 'settings') {
            $route.reload()
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
