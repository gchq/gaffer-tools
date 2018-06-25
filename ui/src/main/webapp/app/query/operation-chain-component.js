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

angular.module('app').component('operationChain', operationChainBuilder());

function operationChainBuilder() {
    return {
        templateUrl: 'app/query/operation-chain.html',
        controller: OperationChainController,
        controllerAs: 'ctrl'
    }
}

function OperationChainController(operationChain, config, loading, query, error, events, $mdDialog, navigation, $location, $routeParams, operationService, settings, graph, results, types) {
    var vm = this;
    vm.timeConfig;
    vm.operations = operationChain.getOperationChain();

    var NAMED_VIEW_CLASS = "uk.gov.gchq.gaffer.data.elementdefinition.view.NamedView";
    var OPERATION_CHAIN_CLASS = "uk.gov.gchq.gaffer.operation.OperationChain";
    var ENTITY_SEED_CLASS = "uk.gov.gchq.gaffer.operation.data.EntitySeed";
    var PAIR_CLASS = "uk.gov.gchq.gaffer.commonutil.pair.Pair";

    /**
     * initialises the time config and default operation options
     */
    vm.$onInit = function() {
        config.get().then(function(conf) {
            vm.timeConfig = conf.time;
        });
    }

    vm.addOperation = function() {
        for (var i in vm.operations) {
            vm.operations[i].expanded = false; // close all open tabs
        }
        operationChain.add(false);
    }

    vm.$onDestroy = function() {
        operationChain.setOperationChain(vm.operations);
    }

    vm.deleteOperation = function(index) {
        vm.operations.splice(index, 1);
        if (index === 0 && vm.operations[0].inputs.input === null) {
            vm.operations[0].inputs.input = [];
            vm.operations[0].inputs.inputPairs = [];
        }
        events.broadcast('onOperationUpdate', [])
    }

    vm.resetOperation = function(index) {
        var inputFlag = index === 0;
        vm.operations[index] = operationChain.createBlankOperation(inputFlag);
    }

    vm.isNotLast = function(index) {
        return index !== (vm.operations.length - 1); 
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
            chain.operations.push(operationService.createLimitOperation(finalOperation['opOptions']));
            chain.operations.push(operationService.createDeduplicateOperation(finalOperation['opOptions']));
        }

        runQuery(chain.operations, true);
    }

    vm.resetChain = function(ev) {
        var confirm = $mdDialog.confirm()
            .title('Are your sure you want to reset the chain?')
            .textContent('Once you reset the chain, all your progress will be lost')
            .ariaLabel('clear operations')
            .targetEvent(ev)
            .ok('Reset chain')
            .cancel('Cancel');

        $mdDialog.show(confirm).then(function() {
            operationChain.reset();
            vm.operations = operationChain.getOperationChain();
        }, function() {
            // do nothing if they don't want to reset
        });


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

        var iterableOutput = !(op.selectedOperation.iterableOutput === false)
        var operations = [operation];
        if(iterableOutput) {
            operations.push(operationService.createLimitOperation(operation['options']));
            operations.push(operationService.createDeduplicateOperation(operation['options']));
        }
        runQuery(operations, false);
        
    }

    var runQuery = function(operations, chainFlag) {
        loading.load()
        query.executeQuery(
            {
                class: OPERATION_CHAIN_CLASS,
                operations: operations,
                options: operations[0]['options']
            },
            function(data) {
                submitResults(data, chainFlag);
            }
        );
    }

    /**
     * Deselects all elements in the graph and resets all query related services
     * @param {Array} data the data returned by the rest service 
     */
    var submitResults = function(data, chainFlag) {
        graph.deselectAll();
        navigation.goTo('results');
        if (chainFlag) {
            vm.clearChain();
        }

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
            op.parameters['inputB'] = createOpInput(operation.inputs.inputB);
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

            if (operation.dates.startDate !== undefined && operation.dates.startDate !== null) {
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

            if (operation.dates.endDate !== undefined && operation.dates.endDate !== null) {
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