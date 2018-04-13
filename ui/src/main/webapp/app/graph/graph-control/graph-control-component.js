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

angular.module('app').component('graphControl', selectedElements());

function selectedElements() {
    return {
        templateUrl: 'app/graph/graph-control/graph-control.html',
        controller: GraphControlController,
        controllerAs: 'ctrl'
    }
}

function GraphControlController($scope, $timeout, events, graph, types, schema, time, navigation) {
    var vm = this;
    vm.searchTerm = "";

    vm.filter = function() {
        graph.filter(vm.searchTerm);
    }

    vm.quickHop = graph.quickHop;
    vm.redraw = graph.redraw;
    vm.reset = graph.reset;
    vm.removeSelected = graph.removeSelected;
    vm.goToQuery = navigation.goToQuery;
}
