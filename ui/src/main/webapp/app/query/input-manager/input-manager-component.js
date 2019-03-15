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

angular.module('app').component('inputManager', inputManager());

function inputManager() {
    return {
        templateUrl: 'app/query/input-manager/input-manager.html',
        controller: InputManagerController,
        controllerAs: 'ctrl',
        bindings: {
            secondaryInput: '<',
            primaryInput: '<',
            model: '=',
            first: '<'
        }
    }
}

/**
 * Controller for the Input Manager
 * @param {*} graph The Graph service for selecting all seeds
 * @param {*} input The input service for injecting getters and setters into child components
 */
function InputManagerController(events, results, common, types, schema) {
    var vm = this;

    var EVENT_NAME = 'onOperationUpdate';
    var ENTITY_SEED_CLASS = "uk.gov.gchq.gaffer.operation.data.EntitySeed";
    vm.usePreviousOutput;

    var updatePreviousOutputFlag = function() {
        vm.usePreviousOutput = (vm.model.input === null);
    }

    vm.$onInit = function() {
        if (!vm.model) {
            throw 'Input manager must be initialised with a model.';
        }
        updatePreviousOutputFlag(); // respond to 'onOperationUpdate' event here
        events.subscribe(EVENT_NAME, updatePreviousOutputFlag);
    }

    vm.$onDestroy = function() {
        events.unsubscribe(EVENT_NAME, updatePreviousOutputFlag);
    }

    vm.onCheckboxChange = function() {
        if (vm.usePreviousOutput) {
            vm.model.input = null;
            vm.model.inputPairs = null;
        } else {
            vm.model.input = [];
            vm.model.inputPairs = [];
        }
    }

    /**
     * Selects all seeds on the graph which in turn triggers an update event - causing the query input to be updated
    */
    vm.useResults = function() {
        schema.get().then(function(gafferSchema) {
            var vertices = schema.getSchemaVertices();
            var vertexClass;
            if(vertices && vertices.length > 0 && undefined !== vertices[0]) {
                vertexClass = gafferSchema.types[vertices[0]].class;
            }

            var resultsData = results.get();
            var allSeeds = [];

            for (var i in resultsData.entities) {
                var vertex = { valueClass: vertexClass, parts: types.createParts(vertexClass, resultsData.entities[i].vertex) };
                common.pushObjectIfUnique(vertex, allSeeds);
            }

            for (var i in resultsData.edges) {
                var source = { valueClass: vertexClass, parts: types.createParts(vertexClass, resultsData.edges[i].source) };
                var destination = { valueClass: vertexClass, parts: types.createParts(vertexClass, resultsData.edges[i].destination) };
                common.pushObjectsIfUnique([source, destination], allSeeds);
            }

            for (var i in resultsData.other) {
                if (resultsData.other[i].class === ENTITY_SEED_CLASS) {
                    var vertex = { valueClass: vertexClass, parts: types.createParts(vertexClass, resultsData.other[i].vertex)}
                    common.pushObjectIfUnique(vertex, allSeeds);
                }
            }

            common.pushObjectsIfUnique(allSeeds, vm.model.input);

            events.broadcast(EVENT_NAME, []);
        });
    }
}
