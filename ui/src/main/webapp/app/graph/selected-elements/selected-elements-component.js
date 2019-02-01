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

angular.module('app').component('selectedElements', selectedElements());

function selectedElements() {
    return {
        templateUrl: 'app/graph/selected-elements/selected-elements.html',
        controller: SelectedElementsController,
        controllerAs: 'ctrl',
        bindings: {
            model: '='
        }
    }
}

/**
 * The selected elements component shows the user which elements they have selected in the graph.
 * @param {*} types The types service
 * @param {*} time The time service
 */
function SelectedElementsController(results, types, time, common, events) {
    var vm = this;
    
    vm.processedResults = {
        entities: {},
        edges: {}
    };


    /**
     * Initialisation method which checks a model is injected into the component and retrieves a copy of the schema.
     */
    vm.$onInit = function() {
        if (!vm.model) {
            throw "Selected elements must be injected via the model binding";
        }

        processElements(results.get());

        events.subscribe('incomingResults', processElements);
    }

    vm.$onDestroy = function() {
        events.unsubscribe('incomingResults', processElements);
    }

    var processElements = function(results) {
        for (var i in results.entities) {
            var entity = results.entities[i];

            var summarisedEntity = angular.copy(entity);
            for (var prop in entity.properties) {
                summarisedEntity.properties[prop] = resolve(prop, entity.properties[prop])
            }

            var vertex = common.parseVertex(summarisedEntity.vertex);
            if (!vm.processedResults.entities[vertex]) {
                vm.processedResults.entities[vertex] = [ summarisedEntity ]
            } else {
                common.pushObjectIfUnique(summarisedEntity, vm.processedResults.entities[vertex])
            }
        }

        for (var i in results.edges) {
            var edge = results.edges[i];
            var summarisedEdge = angular.copy(edge);

            for (var prop in edge.properties) {
                summarisedEdge.properties[prop] = resolve(prop, edge.properties[prop]);
            }

            var source = common.parseVertex(summarisedEdge.source);
            var destination = common.parseVertex(summarisedEdge.destination);

            var edgeId = [ source, destination, summarisedEdge.directed, summarisedEdge.group].join('\0');

            if (!vm.processedResults.edges[edgeId]) {
                vm.processedResults.edges[edgeId] = [ summarisedEdge ]
            } else {
                common.pushObjectIfUnique(summarisedEdge, vm.processedResults.edges[edgeId])
            }
        }

    }

    /**
     * Method which resolves a value including dates.
     * 
     * @param {string} propName The property name
     * @param {*} value the property value
     */
    var resolve = function(propName, value) {
        var shortValue = types.getShortValue(value);
        if(time.isTimeProperty(propName)) {
            shortValue = time.getDateString(propName, shortValue);
        }
        return shortValue;
    }

    /**
     * Resolves a stringified vertex.
     * @param {*} value 
     */
    vm.resolveVertex = function(value) {
        var vertex = value;
        if (typeof value === 'string') {
            vertex = JSON.parse(value)
        }

        return types.getShortValue(vertex);
    }

    vm.resolveEdge = function(value) {
        var edgeIds = value.split('\0');

        var source = JSON.parse(edgeIds[0]);
        var destination = JSON.parse(edgeIds[1]);

        return types.getShortValue(source) + ' to ' + types.getShortValue(destination);
    }
}
