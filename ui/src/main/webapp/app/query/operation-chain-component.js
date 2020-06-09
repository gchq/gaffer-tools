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

angular.module('app').component('operationChain', operationChainBuilder());

function operationChainBuilder() {
    return {
        templateUrl: 'app/query/operation-chain.html',
        controller: OperationChainController,
        controllerAs: 'ctrl',
    }
}

function OperationChainController(operationChain, settings, config, loading, query, error, events, $mdDialog, $mdSidenav, navigation, $location, $routeParams, operationService, common, graph, types, previousQueries, operationOptions) {
    var vm = this;
    vm.timeConfig;
    vm.operations = operationChain.getOperationChain();
    vm.enableChainSaving;
    vm.namedOperation = {
        name: null,
        description: null
    }
    vm.updatedQuery = {
        name: null,
        description: null
    }

    var NAMED_VIEW_CLASS = "uk.gov.gchq.gaffer.data.elementdefinition.view.NamedView";
    var ADD_NAMED_OPERATION_CLASS = "uk.gov.gchq.gaffer.named.operation.AddNamedOperation";
    var OPERATION_CHAIN_CLASS = "uk.gov.gchq.gaffer.operation.OperationChain";
    var ENTITY_SEED_CLASS = "uk.gov.gchq.gaffer.operation.data.EntitySeed";
    var PAIR_ARRAY_CLASS = "uk.gov.gchq.gaffer.commonutil.pair.Pair<uk.gov.gchq.gaffer.data.element.id.ElementId,uk.gov.gchq.gaffer.data.element.id.ElementId>[]";
    var PAIR_CLASS = "uk.gov.gchq.gaffer.commonutil.pair.Pair";

    /**
     * initialises the time config and default operation options
     */
    vm.$onInit = function() {
        config.get().then(function(conf) {
            vm.timeConfig = conf.time;
            vm.enableChainSaving = conf.enableChainSaving;
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
        if (index === 0 && vm.operations[0].fields.input === null) {
            vm.operations[0].fields.input = [];
            vm.operations[0].fields.inputPairs = [];
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
            chain.operations.push(createOperationForQuery(vm.operations[i]));
        }

        query.addOperation(angular.copy(chain));

        var finalOperation = vm.operations[vm.operations.length - 1];
        if (common.arrayContainsValue(finalOperation.selectedOperation.next, 'uk.gov.gchq.gaffer.operation.impl.Limit')) {
            var options = finalOperation.fields ? operationOptions.extractOperationOptions(finalOperation.fields.options) : undefined;
            chain.operations.push(operationService.createLimitOperation(options));
            chain.operations.push(operationService.createDeduplicateOperation(options));
        }

        previousQueries.addQuery({
            name: "Operation Chain",
            lastRun: moment().format('HH:mm'),
            operations: vm.operations,
            description: vm.updatedQuery.description
        });

        runQuery(chain.operations);
    }

    var resetChainWithoutDialog = function() {
        operationChain.reset();
        vm.operations = operationChain.getOperationChain();
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
            resetChainWithoutDialog();
        }, function() {
            // do nothing if they don't want to reset
        });
    }

    /** Save the operation chain as a named operation. */
    vm.saveChain = function(ev) {

        if (!vm.canExecute()) {
            return;
        }

        if (vm.operations.length === 0) {
            error.handle("Unable to save operation chain with no operations");
            return;
        }

        var chain = {
            class: OPERATION_CHAIN_CLASS,
            operations: []
        }
        for (var i in vm.operations) {
            chain.operations.push(createOperationForQuery(vm.operations[i]));
        }

        var confirm = $mdDialog.confirm()
        .title('Operation chain saved as named operation!')
        .textContent('You can now see your saved operation in the list of operations')
        .ok('Ok')

        var invalidName = $mdDialog.confirm()
        .title('Operation chain name is invalid!')
        .textContent('You must provide a name for the operation')
        .ok('Ok')

        if (vm.namedOperation.name != null && vm.namedOperation.name != '') {
            query.executeQuery(
                {
                    class: ADD_NAMED_OPERATION_CLASS,
                    operationName: vm.namedOperation.name,
                    operationChain: chain,
                    description: vm.namedOperation.description,
                    options: {},
                    score: 1,
                    overwriteFlag: true,
                },
                function() {
                    // On success of saving operation chain
                    vm.toggleSideNav();
                    $mdDialog.show(confirm);
                    // Reload the operations
                    operationService.reloadOperations()
                }
            );
        } else {
            $mdDialog.show(invalidName);
        }
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

        var operations = [operation];
        if(op.selectedOperation.iterableOutput) {
            operations.push(operationService.createLimitOperation(operation['options']));
            operations.push(operationService.createDeduplicateOperation(operation['options']));
        }
        runQuery(operations);
    }

    vm.canAddOperation = function() {
        if(vm.operations.length == 0) {
            return true;
        }

        return vm.operations[vm.operations.length -1].selectedOperation !== undefined;
    }

    var runQuery = function(operations) {
        loading.load()
        query.executeQuery(
            {
                class: OPERATION_CHAIN_CLASS,
                operations: operations
            },
            function(data) {
                submitResults(data);
                if (settings.getClearChainAfterExecution() == true) {
                    resetChainWithoutDialog();
                }
            }
        );
    }

    /**
     * Deselects all elements in the graph and resets all query related services
     * @param {Array} data the data returned by the rest service
     */
    var submitResults = function(data) {
        graph.deselectAll();
        navigation.goTo('results');

        // Remove the input query param
        delete $routeParams['input'];
        $location.search('input', null);
    }

    /**
     * Uses seeds uploaded to the input service to build an input array to the query.
     * @param seeds the input array
     */
    var createOpInput = function(seeds, inputType) {
        if (seeds === null || seeds === undefined || !inputType) {
            return undefined;
        }

        var inputTypeName;
        if(typeof(inputType) === "object" && "className" in inputType) {
            inputTypeName = inputType.className;
        } else {
            inputTypeName = "java.lang.Object[]";
        }
        var isArray = common.endsWith(inputTypeName, "[]");
        var opInput;
        if(isArray) {
            opInput = [];
            var inputItemType = inputTypeName.substring(0, inputTypeName.length - 2);

            // Assume the input type is EntityId if it is just Object or unknown.
            if(inputItemType === "" || inputItemType === "java.lang.Object") {
                inputItemType = "uk.gov.gchq.gaffer.data.element.id.EntityId";
            }

            var seedToJson = function(seed) {
                return types.createJsonValue(seed.valueClass, seeds[i].parts);
            };
            var formatSeed;
            if(inputItemType === "uk.gov.gchq.gaffer.data.element.id.EntityId") {
                formatSeed = function(seed) {
                    return {
                        "class": ENTITY_SEED_CLASS,
                        "vertex": seedToJson(seed)
                    };
                }
            } else {
                formatSeed = function(seed) {
                    return seedToJson(seed);
                }
            }
            for (var i in seeds) {
                opInput.push(formatSeed(seeds[i]));
            }
        } else {
            opInput = seeds;
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

        for(var name in selectedOp.fields) {
           var field = operation.fields[name];
           if(field && field.parts && Object.keys(field.parts).length > 0) {
               op[name] = types.createJsonValue(field.valueClass, field.parts);
           }
        }

        if (selectedOp.fields.input) {
            if (selectedOp.fields.input.className === PAIR_ARRAY_CLASS) {
                op.input = createPairInput(operation.fields.inputPairs)
            } else {
                op.input = createOpInput(operation.fields.input, selectedOp.fields.input);
            }
        }
        
        if (selectedOp.fields.inputB && !selectedOp.namedOp) {
            op.inputB = createOpInput(operation.fields.inputB, selectedOp.fields.inputB);
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

        if (selectedOp.fields.inputB && selectedOp.namedOp) {
            if (!op.parameters) {
                op.parameters = {};
            }
            op.parameters['inputB'] = createOpInput(operation.fields.inputB, selectedOp.fields.inputB);
        }

        if (selectedOp.fields.view) {
            var namedViews = operation.fields.view.namedViews;
            var viewEdges = operation.fields.view.viewEdges;
            var viewEntities = operation.fields.view.viewEntities;
            var edgeFilters = operation.fields.view.edgeFilters;
            var entityFilters = operation.fields.view.entityFilters;

            op.view = {
                entities: {},
                edges: {},
                globalElements: []
            };

            if(operation.fields.view.summarise) {
                op.view.globalElements.push({
                    groupBy: []
                });
            }

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

        if (operation.fields && operation.fields.options) {
            op.options = operationOptions.extractOperationOptions(operation.fields.options);
        }

        return op;
    }

    vm.toggleSideNav  = function () {
        $mdSidenav('right')
            .toggle();
    }
}