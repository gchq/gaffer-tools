/*
 * Copyright 2017 Crown Copyright
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

angular.module('app').component('selectedElements', selectedElements());

function selectedElements() {
    return {
        templateUrl: 'app/graph/selected-elements/selected-elements.html',
        controller: SelectedElementsController,
        controllerAs: 'ctrl'
    }
}

function SelectedElementsController($scope, $timeout, events, graph, types, schema, time) {
    var vm = this;

    vm.selectedEdges = graph.getSelectedEdges();
    vm.selectedEntities = graph.getSelectedEntities();
    vm.schema;

    var selectedElementsUpdate = function(selectedElements) {
         vm.selectedEdges = selectedElements.edges;
         vm.selectedEntities = selectedElements.entities;

         if(!promise) {
             promise = $timeout(function() {
                 $scope.$apply();
                 promise = null;
             })
         }
    };

    var promise;

    vm.$onInit = function() {
        schema.get().then(function(schema) {
            vm.schema = schema;
        });

        events.subscribe('selectedElementsUpdate', selectedElementsUpdate);
    }

    vm.$onDestroy = function() {
        events.unsubscribe('selectedElementsUpdate', selectedElementsUpdate);
    }

    vm.resolve = function(propName, value) {
        var shortValue = types.getShortValue(value);
        if(time.isTimeProperty(propName)) {
            shortValue = time.getDateString(propName, shortValue);
        }
        return shortValue;
    }

    vm.resolveVertex = function(value) {
        return types.getShortValue(JSON.parse(value));
    }
}