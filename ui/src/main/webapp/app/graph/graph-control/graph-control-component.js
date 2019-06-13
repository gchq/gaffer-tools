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

angular.module('app').component('graphControl', graphControl());

function graphControl() {
    return {
        templateUrl: 'app/graph/graph-control/graph-control.html',
        controller: GraphControlController,
        controllerAs: 'ctrl',
        bindings: {
            'quickHop': '&',
            'redraw': '&',
            'reset': '&',
            'remove': '&',
            'filter': '&'
        }
    }
}

/**
 * The graph controls component comprises of a search bar and a series of buttons 
 * which allow a user to interact with the graph.
 * 
 * @param {*} graph The graph service
 * @param {*} navigation The navigation service
 */
function GraphControlController(graph, navigation) {
    var vm = this;
    vm.searchTerm;

    /**
     * Sets the initial search term
     */
    vm.$onInit = function() {
        vm.searchTerm = graph.getSearchTerm();
    }

    /**
     * Use the injected filter function
     */
    vm.search = function() {
        vm.filter({searchTerm: vm.searchTerm})
    }

    /**
     * Updates the service value on destruction
     */
    vm.$onDestroy = function() {
        graph.setSearchTerm(vm.searchTerm)
    }
   
    /**
     * navigate to the query page.
     */
    vm.goToQuery = function() {
        navigation.goToQuery() 
    }
}
