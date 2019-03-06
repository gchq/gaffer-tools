/*
 * Copyright 2018-2019 Crown Copyright
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

angular.module('app').component('graphPage', graphPage());

function graphPage() {
    return {
        templateUrl: 'app/graph/graph-page.html',
        controller: GraphPageController,
        controllerAs: 'ctrl'
    }
}

/**
 * Component containing the graph and selected elements. It is responsible for getting selected elements model and 
 * sharing it between the two components.
 * 
 * @param {*} graph The graph service
 */
function GraphPageController(graph) {
    var vm = this;

    /**
     * Initialisation method gets the selected elements from the graph service
     */
    vm.$onInit = function() {
        vm.selectedElements = graph.getSelectedElements();
    }

    /**
     * Destruction method which persists the selected elements in the graph service.
     */
    vm.$onDestroy = function() {
        graph.setSelectedElements(vm.selectedElements);
    }
}
