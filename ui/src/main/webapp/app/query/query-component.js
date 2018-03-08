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

/**
 * The Query page component
 */
angular.module('app').component('query', query());

function query() {

    return {
        templateUrl: 'app/query/query.html',
        controller: QueryController,
        controllerAs: 'ctrl'
    };
}
/**
 * The controller for the whole query page. Needs to access all services relating to the query and executes it.
 * @param {*} queryPage For access to edge directions and operation options
 * @param {*} operationService For creating operations
 * @param {*} types For converting between Java and javascript types
 * @param {*} graph For accessing the currently selected seeds
 * @param {*} config For getting timeconfig
 * @param {*} settings For accessing the result limit
 * @param {*} query For executing and adding operations
 * @param {*} results For parsing the results
 * @param {*} navigation For moving to the graph page on successful operation
 * @param {*} $mdDialog For warning the user when they hit the result limit
 * @param {*} loading For starting and finishing the loading circle
 * @param {*} dateRange For adding date ranges to queries
 * @param {*} view For accessing the view that the user configured
 * @param {*} error For displaying error messages
 * @param {*} input For getting access to the operation seeds
 */
function QueryController(queryPage, operationService, types, graph, config, settings, query, results, navigation, $mdDialog, loading, dateRange, view, error, input) {
    var namedViewClass = "uk.gov.gchq.gaffer.data.elementdefinition.view.NamedView";
    var vm = this;
    vm.timeConfig;

    /**
     * initialises the time config and default operation options
     */
    vm.$onInit = function() {
        config.get().then(function(conf) {
            vm.timeConfig = conf.time;
        });

        settings.getOpOptionKeys().then(function(keys) {
            opOptionKeys = keys;
        });
    }
    var opOptionKeys;

    /**
     * Gets the selected operation that the user chose
     */
    vm.getSelectedOp = function() {
        return queryPage.getSelectedOperation();
    }

    /**
     * Checks all subforms are valid and another operation is not in progress
     */
    vm.canExecute = function() {
        return vm.queryForm.$valid && !loading.isLoading();
    }

    /**
     * Checks whether there are any operation options.
     */
    vm.hasOpOptions = function() {
        return opOptionKeys && Object.keys(opOptionKeys).length > 0;
    }

    /**
     * Executes an operation
     */
    vm.execute = function() {
        var operation = createOperation();
        query.addOperation(operation);
        loading.load()
        query.execute(JSON.stringify({
            class: "uk.gov.gchq.gaffer.operation.OperationChain",
            operations: [operation, operationService.createLimitOperation(operation['options']), operationService.createDeduplicateOperation(operation['options'])],
            options: operation['options']
        }), function(data) {
            loading.finish()
            if (data.length === settings.getResultLimit()) {
                prompt(data);
            } else {
                submitResults(data);
            }
        }, function(err) {
            loading.finish();
            error.handle('Error executing operation', err);
        });
    }


    /**
     * Alerts the user if they hit the result limit
     * @param {Array} data The data returned by the Gaffer REST service 
     */
    var prompt = function(data) {
        $mdDialog.show({
            template: '<result-count-warning aria-label="Result Count Warning"></result-count-warning>',
            parent: angular.element(document.body),
            clickOutsideToClose: false
        })
        .then(function(command) {
            if(command === 'results') {
                submitResults(data);
            }
        });
    }

    /**
     * Deselects all elements in the graph, updates the result service and resets all query related services
     * @param {Array} data the data returned by the rest service 
     */
    var submitResults = function(data) {
        graph.deselectAll();
        results.update(data);
        navigation.goTo('graph');
        queryPage.reset();
        dateRange.resetDateRange();
        view.reset();
        input.reset();
    }

    /**
     * Uses the selected entities in the graph and seeds uploaded to the input service to build an input array to the query.
     */
    var createOpInput = function() {
        var opInput = [];
        var jsonVertex;
        for(var vertex in graph.getSelectedEntities()) {
            try {
               jsonVertex = JSON.parse(vertex);
            } catch(err) {
               jsonVertex = vertex;
            }
            opInput.push({
              "class": "uk.gov.gchq.gaffer.operation.data.EntitySeed",
              "vertex": jsonVertex
            });
        }

        var seeds = input.getInput();

        for (var i in seeds) {
            opInput.push({
                "class": "uk.gov.gchq.gaffer.operation.data.EntitySeed",
                "vertex": seeds[i]
            });
        }

        return opInput;
    }

    /**
     * Builds an operation using views, inputs and other options
     */
    var createOperation = function() {
        var selectedOp = vm.getSelectedOp()
        var op = {
             class: selectedOp.class
        };

        if(selectedOp.namedOp) {
            op.operationName = selectedOp.name;
        }

        if (selectedOp.input) {
            op.input = createOpInput();
        }

        if (selectedOp.parameters) {
            var opParams = {};
            for(name in selectedOp.parameters) {
                var valueClass = selectedOp.parameters[name].valueClass;
                var value = types.createValue(valueClass, selectedOp.parameters[name].parts);
                if (selectedOp.parameters[name].required || (value !== "" && value !== null)) {
                    opParams[name] = value;
                }
            }
            op.parameters = opParams;
        }

        if (selectedOp.view) {
            var namedViews = view.getNamedViews();
            var viewEdges = view.getViewEdges();
            var viewEntities = view.getViewEntities();
            var edgeFilters = view.getEdgeFilters();
            var entityFilters = view.getEntityFilters();

            op.view = {
                globalElements: [{
                    groupBy: []
                }],
                entities: {},
                edges: {}
            };


            for(var i in viewEntities) {
                var entity = viewEntities[i];
                op.view.entities[entity] = {};

                var filterFunctions = entityFilters[entity];
                if (filterFunctions) {
                    op.view.entities[entity] = filterFunctions;
                }
            }

            for(var i in viewEdges) {
                var edge = viewEdges[i];
                op.view.edges[edge] = {};

                var filterFunctions = edgeFilters[edge];
                if (filterFunctions) {
                    op.view.edges[edge] = filterFunctions;
                }
            }

            if (dateRange.getStartDate() !== undefined && dateRange.getStartDate() !== null) {
                op.view.globalElements.push({
                    "preAggregationFilterFunctions": [ {
                        "predicate": {
                            "class": "uk.gov.gchq.koryphe.impl.predicate.IsMoreThan",
                            "orEqualTo": true,
                            "value": types.createJsonValue(vm.timeConfig.filter.class, dateRange.getStartDate())
                        },
                        "selection": [ vm.timeConfig.filter.startProperty ]
                    }]
                });
            }

            if (dateRange.getEndDate() !== undefined && dateRange.getEndDate() !== null) {
                op.view.globalElements.push({
                    "preAggregationFilterFunctions": [ {
                        "predicate": {
                            "class": "uk.gov.gchq.koryphe.impl.predicate.IsLessThan",
                            "orEqualTo": true,
                            "value": types.createJsonValue(vm.timeConfig.filter.class, dateRange.getEndDate())
                        },
                        "selection": [ vm.timeConfig.filter.endProperty ]
                    }]
                });
            }
        }

        if(namedViews && namedViews.length > 0){
            op.views = [];
            for(i in namedViews) {
                var viewParams = {};
                for(name in namedViews[i].parameters) {
                    var valueClass = namedViews[i].parameters[name].valueClass;
                    var value = types.createValue(valueClass, namedViews[i].parameters[name].parts);
                    if (namedViews[i].parameters[name].required || (value !== "" && value !== null)) {
                        viewParams[name] = value;
                    }
                }
                op.views.push({
                    class: namedViewClass,
                    name: namedViews[i].name,
                    parameters: viewParams
                });
            }
            if(op.view) {
                op.views.push(op.view);
                delete op['view'];
            }
        }

        if (selectedOp.inOutFlag) {
            op.includeIncomingOutGoing = queryPage.getInOutFlag();
        }

        if(queryPage.getOpOptions()) {
            op.options = queryPage.getOpOptions();
        }

        return op;
    }
}
