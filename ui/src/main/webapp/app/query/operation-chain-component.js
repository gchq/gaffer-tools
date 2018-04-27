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

angular.module('app').component('operationChainBuilder', operationChainBuilder());

function operationChainBuilder() {
    return {
        templateUrl: 'app/query/operation-chain-builder.html',
        controller: OperationChainBuilderController,
        controllerAs: 'ctrl'
    }
}

function OperationChainBuilderController(operationChain, config, loading, query, error, events, $mdDialog, navigation, $location, $routeParams, operationService, settings, graph, results, types) {
    var vm = this;
    vm.timeConfig;
    vm.operations = operationChain.getOperationChain();

    const NAMED_VIEW_CLASS = "uk.gov.gchq.gaffer.data.elementdefinition.view.NamedView";
    const OPERATION_CHAIN_CLASS = "uk.gov.gchq.gaffer.operation.OperationChain";
    const ENTITY_SEED_CLASS = "uk.gov.gchq.gaffer.operation.data.EntitySeed";
    const PAIR_CLASS = "uk.gov.gchq.gaffer.commonutil.pair.Pair";

    /**
     * initialises the time config and default operation options
     */
    vm.$onInit = function() {
        config.get().then(function(conf) {
            vm.timeConfig = conf.time;
        });
    }

    vm.addOperation = function() {
        var inputFlag = (vm.operations.length === 0)
        operationChain.add(inputFlag);
    }

    vm.$onDestroy = function() {
        operationChain.setOperationChain(vm.operations);
    }

    vm.isEmptyOperationChain = function() {
        return vm.operations.length === 0;
    }

    vm.canExecute = function() {
        return vm.operationChainForm.$valid && !loading.isLoading();
    }

    vm.executeChain = function() {
        events.broadcast('onPreExecute', []);
        if (!vm.canExecute()) {
            return;
        }

        if (vm.operations.length === 0) {
            error.handle("Unable to run operation chain with no operations");
            return;
        }

        var chain = {
            class: OPERATION_CHAIN_CLASS,
            operations: []
        }
        for (var i in vm.operations) {
            chain.operations.push(createOperationForQuery(vm.operations[i]))
        }

        query.addOperation(angular.copy(chain));

        var finalOperation = vm.operations[vm.operations.length - 1];
        if (finalOperation.selectedOperation.iterableOutput !== false) {
            chain.operations.push(operationService.createLimitOperation(finalOperation['options']));
            chain.operations.push(operationService.createDeduplicateOperation(finalOperation['options']));
        }

        runQuery(chain.operations);
    }

    vm.clearChain = function() {
        operationChain.reset();
        vm.operations = operationChain.getOperationChain();
    }

    /**
     * First checks fires an event so that all watchers may do last minute changes.
     * Once done, it does a final check to make sure the operation can execute. If so
     * it executes it.
     */
    vm.execute = function(op) {
        events.broadcast('onPreExecute', []);
        if (!vm.canExecute()) {
            return;
        }
        var operation = createOperationForQuery(op);
        query.addOperation(operation);
        loading.load()

        var iterableOutput = !(op.selectedOperation.iterableOutput === false)
        var operations = [operation];
        if(iterableOutput) {
            operations.push(operationService.createLimitOperation(operation['options']));
            operations.push(operationService.createDeduplicateOperation(operation['options']));
        }
        runQuery(operations);
        
    }

    var runQuery = function(operations) {
        query.execute(JSON.stringify({
            class: OPERATION_CHAIN_CLASS,
            operations: operations,
            options: operations[0]['options']
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
        navigation.goTo('results');

        // Remove the input query param
        delete $routeParams['input'];
        $location.search('input', null);
    }

    /**
     * Uses seeds uploaded to the input service to build an input array to the query.
     * @param seeds the input array
     */
    var createOpInput = function(seeds) {
        if (seeds === null || seeds === undefined) {
            return undefined;
        }
        var opInput = [];
        
        for (var i in seeds) {
            opInput.push({
                "class": ENTITY_SEED_CLASS,
                "vertex": types.createJsonValue(seeds[i].valueClass, seeds[i].parts)
            });
        }

        return opInput;
    }

    /**
     * Create an array of JSON serialisable Pair objects from the values created by the input component
     * @param {any[]} pairs 
     */
    var createPairInput = function(pairs) {
        if (pairs === null || pairs === undefined) {
            return undefined;
        }
        var opInput = [];

        for (var i in pairs) {
            opInput.push({
                "class": PAIR_CLASS,
                "first": {
                    "uk.gov.gchq.gaffer.operation.data.EntitySeed": {
                        "vertex": types.createJsonValue(pairs[i].first.valueClass, pairs[i].first.parts)
                    }
                },
                "second": {
                    "uk.gov.gchq.gaffer.operation.data.EntitySeed": {
                        "vertex": types.createJsonValue(pairs[i].second.valueClass, pairs[i].second.parts)
                    }
                }
            });
        }

        return opInput;

    }

    /**
     * Creates a Gaffer Filter based on parameters supplied by the user.
     * @param {Object} filter A filter created by the user
     */
    var generateFilterFunction = function(filter) {
        var functionJson = {
            "predicate": {
                class: filter.predicate
            },
            "selection": [ filter.property ]
        }

        for(var paramName in filter.availableFunctionParameters) {
            if(filter.parameters[paramName] !== undefined) {
                if (types.isKnown(filter.availableFunctionParameters[paramName])) {
                    functionJson['predicate'][paramName] = types.createValue(filter.parameters[paramName].valueClass, filter.parameters[paramName].parts);
                } else {
                    functionJson["predicate"][paramName] = types.createJsonValue(filter.parameters[paramName].valueClass, filter.parameters[paramName].parts);
                }
            }
        }

        return functionJson;
    }

    /**
     * Builds part of a gaffer view with an array of element groups to include, along with the filters to apply
     * @param {Array} groupArray The array of groups for a given element, included in the view 
     * @param {Object} filters A key value list of group -> array of filters
     * @param {Object} destination Where to add the filters
     */
    var createElementView = function(groupArray, filters, destination) {
        for(var i in groupArray) {
            var group = groupArray[i];
            destination[group] = {};

            for (var i in filters[group]) {
                var filter = filters[group][i];
                if (filter.preAggregation) {
                    if (!destination[group].preAggregationFilterFunctions) {
                        destination[group].preAggregationFilterFunctions = [];
                    }
                    destination[group].preAggregationFilterFunctions.push(generateFilterFunction(filter))
                } else {
                    if (!destination[group].postAggregationFilterFunctions) {
                        destination[group].postAggregationFilterFunctions = [];
                    }
                    destination[group].postAggregationFilterFunctions.push(generateFilterFunction(filter));
                }
            }
        }
    }

    /**
     * Builds a Gaffer operation based on the UI operation given to it
     * @param {object} operation The UI operation
     */
    var createOperationForQuery = function(operation) {
        var selectedOp = operation.selectedOperation;
        var op = {
             class: selectedOp.class
        };

        if(selectedOp.namedOp) {
            op.operationName = selectedOp.name;
        }
        
        if (selectedOp.input === PAIR_CLASS) {
            op.input = createPairInput(operation.inputs.inputPairs)
        } else if (selectedOp.input) {
            op.input = createOpInput(operation.inputs.input);
        }
        if (selectedOp.inputB && !selectedOp.namedOp) {
            op.inputB = createOpInput(operation.inputs.inputB);
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

        if (selectedOp.inputB && selectedOp.namedOp) {
            if (!op.parameters) {
                op.parameters = {};
            }
            op.parameters['inputB'] = createOpInput(operation.inputB);
        }

        if (selectedOp.view) {
            var namedViews = operation.view.namedViews;
            var viewEdges = operation.view.viewEdges;
            var viewEntities = operation.view.viewEntities;
            var edgeFilters = operation.view.edgeFilters;
            var entityFilters = operation.view.entityFilters;

            op.view = {
                globalElements: [{
                    groupBy: []
                }],
                entities: {},
                edges: {}
            };

            createElementView(viewEntities, entityFilters, op.view.entities);
            createElementView(viewEdges, edgeFilters, op.view.edges);

            if (operation.startDate !== undefined && operation.startDate !== null) {
                op.view.globalElements.push({
                    "preAggregationFilterFunctions": [ {
                        "predicate": {
                            "class": "uk.gov.gchq.koryphe.impl.predicate.IsMoreThan",
                            "orEqualTo": true,
                            "value": types.createJsonValue(vm.timeConfig.filter.class, operation.dates.startDate)
                        },
                        "selection": [ vm.timeConfig.filter.startProperty ]
                    }]
                });
            }

            if (operation.endDate !== undefined && operation.endDate !== null) {
                op.view.globalElements.push({
                    "preAggregationFilterFunctions": [ {
                        "predicate": {
                            "class": "uk.gov.gchq.koryphe.impl.predicate.IsLessThan",
                            "orEqualTo": true,
                            "value": types.createJsonValue(vm.timeConfig.filter.class, operation.dates.endDate)
                        },
                        "selection": [ vm.timeConfig.filter.endProperty ]
                    }]
                });
            }
        }

        if(namedViews && namedViews.length > 0){
            op.views = [];
            for(var i in namedViews) {
                var viewParams = {};
                for(name in namedViews[i].parameters) {
                    var valueClass = namedViews[i].parameters[name].valueClass;
                    var value = types.createValue(valueClass, namedViews[i].parameters[name].parts);
                    if (namedViews[i].parameters[name].required || (value !== "" && value !== null)) {
                        viewParams[name] = value;
                    }
                }
                op.views.push({
                    class: NAMED_VIEW_CLASS,
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
            op.includeIncomingOutGoing = operation.edgeDirection;
        }

        if(operation.opOptions) {
            op.options = operation.opOptions;
        }

        return op;
    }

    
}