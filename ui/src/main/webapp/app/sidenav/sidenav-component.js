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

function SideNavController(navigation, $route) {
    var vm = this;
    vm.routes = $route.routes
    vm.goTo = navigation.goTo;
    vm.collapsed = false;

    vm.$onInit = function() {
        if($routeParams.graphid) {
	            $routeParams.graphid = $routeParams.graphid.split(',');
	
	        //     if(Array.isArray($routeParams.graphid)) {
	        //         // Add the first operation
	        //         var opFirst = $routeParams.operation[0] 
	        //         var opParam = opFirst.replace(/[\W_]+/g, "").toLowerCase();
	        //         for(var i in vm.availableOperations) {
	        //             if(vm.availableOperations[i].name.replace(/[\W_]+/g, "").toLowerCase() === opParam) {
	        //                 vm.model = vm.availableOperations[i];
	        //                 break;
	        //             }
	        //         }
	
	        //         // Added a new blank operation and fill it
	        //         for (var j = 1; j < $routeParams.operation.length; j++) {
	        //             operationChain.add(false);
	        //             var op = $routeParams.operation[j];
	        //             var opParam = op.replace(/[\W_]+/g, "").toLowerCase();
	        //             for(var i in vm.availableOperations) {
	        //                 if(vm.availableOperations[i].name.replace(/[\W_]+/g, "").toLowerCase() === opParam) {
	        //                     vm.model = vm.availableOperations[i];
	        //                     break;
	        //                 }
	        //             }
	
	        //         }
	        //     }
	        // }        
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
