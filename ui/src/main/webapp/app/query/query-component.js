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
 * @param {*} $routeParams the url query params
 * @param {*} $location for deleting url query params when they have been consumed
 * @param {*} events for broadcasting pre-execute event
 */
function QueryController(queryPage, operationService, types, graph, config, settings, query, results, navigation, $mdDialog, loading, dateRange, view, error, input, $routeParams, $location, events) {
    var namedViewClass = "uk.gov.gchq.gaffer.data.elementdefinition.view.NamedView";
    var operationChainClass = "uk.gov.gchq.gaffer.operation.OperationChain"
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
     * Test to see if an operation has already been added to the chain.
     */
    vm.isFirst = function() {
        return queryPage.getCurrentIndex() === 0;
    }

    /**
     * checks whether the current index is less than the size of the operations
     */
    vm.isEditing = function() {
        return queryPage.getCurrentIndex() < queryPage.getOperationChain().length;
    }

    /**
     * Index to remove
     * @param {number} index 
     */
    vm.removeOpFromChain = function(index) {
        queryPage.removeFromOperationChain(index);
    }

    /**
     * Sets up the services so that we can edit an existing operation
     * @param {number} index 
     */
    vm.editOperation = function(index) {
        var operation = queryPage.getCloneOf(index);
        if (operation === undefined) {
            return;
        }
        queryPage.setSelectedOperation(operation.selectedOperation);
        view.setViewEdges(operation.view.viewEdges);
        view.setViewEntities(operation.view.viewEntities);
        view.setEdgeFilters(operation.view.edgeFilters);
        view.setEntityFilters(operation.view.entityFilters);
        view.setNamedViews(operation.view.namedViews);
        queryPage.setInOutFlag(operation.inOutFlag);
        queryPage.setOpOptions(operation.opOptions);
        dateRange.setStartDate(operation.startDate);
        dateRange.setEndDate(operation.endDate);

        events.broadcast("onOperationUpdate", [operation]);
    }

    /**
     * Gets the operation chain being built
     */
    vm.getChain = function() {
        return queryPage.getOperationChain();
    }

    var createOperation = function() {
        var created =  {
            selectedOperation: queryPage.getSelectedOperation(),
            view: {
                viewEdges: view.getViewEdges(),
                edgeFilters: view.getEdgeFilters(),
                viewEntities: view.getViewEntities(),
                entityFilters: view.getEntityFilters(),
                namedViews: view.getNamedViews()
            },
            input: undefined,
            inputB: (vm.isFirst() && queryPage.getSelectedOperation().inputB) ? input.getInput() : undefined,
            inOutFlag: queryPage.getInOutFlag(),
            startDate: dateRange.getStartDate(),
            endDate: dateRange.getEndDate(),
            opOptions: queryPage.getOpOptions()
        }

        if (!vm.isFirst()) {
            return created;
        }
        if (created.selectedOperation.input === "uk.gov.gchq.gaffer.commonutil.pair.Pair") {
            created.input = input.getInputPairs();
        } else {
            created.input = input.getInput();
        }

        return created;
    }

    /**
     * Adds the current operation to the op chain
     */
    vm.addToOperationChain = function() {
        queryPage.addToOperationChain(createOperation());
        dateRange.resetDateRange();
        view.reset();
    }

    /**
     * Submits the current operation to the service
     */
    vm.save = function() {
        var operation = createOperation();
        queryPage.updateOperationInChain(operation, queryPage.getCurrentIndex())
        events.broadcast("onOperationUpdate", [operation])
    }

    /**
     * resets the current operation to how it was before beginning editing
     */
    vm.revert = function() {
        vm.editOperation(queryPage.getCurrentIndex())
        var oldOperation = queryPage.getCloneOf(queryPage.getCurrentIndex());
        events.broadcast("onOperationUpdate", [oldOperation]);
        if (oldOperation.input) {
            input.setInput(oldOperation.input)
            input.setInputB(oldOperation.inputB)
        }
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
     * First checks fires an event so that all watchers may do last minute changes.
     * Once done, it does a final check to make sure the operation can execute. If so
     * it executes it.
     * @param {boolean} addCurrent Whether to add current operation to the op chain
     */
    vm.execute = function(addCurrent) {
        events.broadcast('onPreExecute', []);
        if (!vm.canExecute()) {
            return;
        }
        var operation;
        if (queryPage.getOperationChain() === []) {
            operation = createOperationForQuery(createOperation());
        } else {
            operation = {
                class: operationChainClass,
                operations: []
            }
            if (addCurrent) {
                queryPage.addToOperationChain(createOperation());
            }
            var ops = queryPage.getOperationChain();
            for (var i in ops) {
                operation.operations.push(createOperationForQuery(ops[i]))
            }
        }
        
        query.addOperation(operation);
        loading.load()

        var iterableOutput = vm.getSelectedOp().iterableOutput === undefined || vm.getSelectedOp();
        var operations = [operation];
        if(vm.getSelectedOp().iterableOutput === undefined || vm.getSelectedOp().iterableOutput) {
            operations.push(operationService.createLimitOperation(operation['options']));
            operations.push(operationService.createDeduplicateOperation(operation['options']));
        }
        query.execute(JSON.stringify({
            class: "uk.gov.gchq.gaffer.operation.OperationChain",
            operations: operations,
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
        navigation.goTo('results');
        queryPage.reset();
        dateRange.resetDateRange();
        view.reset();
        input.reset();

        // Remove the input query param
        delete $routeParams['input'];
        $location.search('input', null);
    }

    /**
     * Uses seeds uploaded to the input service to build an input array to the query.
     * @param seeds the input array
     */
    var createOpInput = function(seeds) {
        var opInput = [];
        
        for (var i in seeds) {
            opInput.push({
                "class": "uk.gov.gchq.gaffer.operation.data.EntitySeed",
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
        var opInput = [];

        for (var i in pairs) {
            opInput.push({
                "class": "uk.gov.gchq.gaffer.commonutil.pair.Pair",
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

        if (operation.input !== undefined) {
            if (selectedOp.input === "uk.gov.gchq.gaffer.commonutil.pair.Pair") {
                op.input = createPairInput(operation.input)
            } else if (selectedOp.input) {
                op.input = createOpInput(operation.input);
            }
            if (selectedOp.inputB && !selectedOp.namedOp) {
                op.inputB = createOpInput(operation.inputB);
            }
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
            var namedViews = operation.namedViews;
            var viewEdges = operation.viewEdges;
            var viewEntities = operation.viewEntities;
            var edgeFilters = operation.edgeFilters;
            var entityFilters = operation.entityFilters;

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
                            "value": types.createJsonValue(vm.timeConfig.filter.class, operation.startDate)
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
                            "value": types.createJsonValue(vm.timeConfig.filter.class, operation.endDate)
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
            op.includeIncomingOutGoing = operation.inOutFlag;
        }

        if(operation.opOptions) {
            op.options = operation.opOptions;
        }

        return op;
    }
}
