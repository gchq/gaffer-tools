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

angular.module('app').component('viewBuilder', viewBuilder());

function viewBuilder() {
    return {
        templateUrl: 'app/query/view-builder/view-builder.html',
        controller: ViewBuilderController,
        controllerAs: 'ctrl'
    }
}

function ViewBuilderController(view, graph, common, schema, functions, events, $mdDialog) {
    var vm = this;

    vm.schemaEntities;
    vm.schemaEdges;
    vm.viewEdges = view.getViewEdges();
    vm.viewEntities = view.getViewEntities();
    vm.edgeFilters = view.getEdgeFilters();
    vm.entityFilters = view.getEntityFilters();

    vm.$onInit = function() {
        schema.get().then(function(gafferSchema) {
            vm.schemaEdges = Object.keys(gafferSchema.edges);
            vm.schemaEntities = Object.keys(gafferSchema.entities);
        });
    }

    vm.addFilters = function(ev, group, elementType) {
        $mdDialog.show({
            templateUrl: 'app/query/view-builder/custom-filter-dialog/custom-filter-dialog.html',
            controller: 'CustomFilterDialogController',
            controllerAs: 'ctrl',
            bindToController: true,
            locals: {
                group: group,
                elementType: elementType,
                onSubmit: addFilterFunction
            },
            clickOutsideToClose: false,
            fullscreen: true,
            targetEvent: ev
        }).then(function() {
            if (elementType === 'edge') {
                view.setEdgeFilters(vm.edgeFilters);
            } else {
                view.setEntityFilters(vm.entityFilters);
            }
        });
    }

    vm.getEntityProperties = schema.getEntityProperties;
    vm.getEdgeProperties = schema.getEdgeProperties;

    vm.onElementGroupChange = function() {
        view.setViewEdges(vm.viewEdges);
        view.setViewEntities(vm.viewEntities);
    }

    var generateFilterFunction = function(filter) {
        var functionJson = {
            "predicate": {
                class: filter.predicate
            },
            "selection": [ filter.property ]
        }

        for(var i in filter.availableFunctionParameters) {
            if(filter.parameters[i] !== undefined) {
                var param;
                try {
                    param = JSON.parse(filter.parameters[i]);
                } catch(e) {
                    param = filter.parameters[i];
                }
                functionJson["predicate"][filter.availableFunctionParameters[i]] = param;
            }
        }

        return functionJson;
    }


    var addFilterFunction = function(filter, group, elementType) {

        if (!filter.predicate || !filter.property) {
            return;
        }

        var functionsToAddTo;
        if (elementType === 'edge') {
            if (!vm.edgeFilters[group]) {
                vm.edgeFilters[group] = {}
            }
            if (filter.preAggregation) {
                if (!vm.edgeFilters[group].preAggregationFilterFunctions) {
                    vm.edgeFilters[group].preAggregationFilterFunctions = [];
                }

                functionsToAddTo = vm.edgeFilters[group].preAggregationFilterFunctions;
            } else {
                if (!vm.edgeFilters[group].postAggregationFilterFunctions) {
                    vm.edgeFilters[group].postAggregationFilterFunctions = [];
                }

                functionsToAddTo = vm.edgeFilters[group].postAggregationFilterFunctions;
            }

        } else {
            if (!vm.entityFilters[group]) {
                vm.entityFilters[group] = {}
            }
            if (filter.preAggregation) {
                if (!vm.entityFilters[group].preAggregationFilterFunctions) {
                    vm.entityFilters[group].preAggregationFilterFunctions = [];
                }

                functionsToAddTo = vm.entityFilters[group].preAggregationFilterFunctions;
            } else {
                if (!vm.entityFilters[group].postAggregationFilterFunctions) {
                    vm.entityFilters[group].postAggregationFilterFunctions = [];
                }

                functionsToAddTo = vm.entityFilters[group].postAggregationFilterFunctions;
            }
        }

        var filterFunction = generateFilterFunction(filter);

        functionsToAddTo.push(filterFunction);
    }

}