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

angular.module('app').component('query', query());

function query() {

    return {
        templateUrl: 'app/query/query.html',
        controller: QueryController,
        controllerAs: 'ctrl'
    };
}

function QueryController(queryPage, operationService, types, graph, config, settings, query, functions, results, navigation, $mdDialog, loading, time) {

    var vm = this;
    vm.timeConfig;

    vm.$onInit = function() {
        config.get().then(function(conf) {
            vm.timeConfig = conf.time;
        });
    }

    vm.getSelectedOp = function() {
        return queryPage.getSelectedOperation();
    }

    vm.canExecute = function() {
        return vm.queryForm.$valid && !loading.isLoading();
    }

    vm.execute = function() {
        var operation = createOperation();
        query.addOperation(operation);
        loading.load()
        query.execute(JSON.stringify({
            class: "uk.gov.gchq.gaffer.operation.OperationChain",
            operations: [operation, operationService.createLimitOperation(), operationService.createDeduplicateOperation()]
        }), function(data) {
            loading.finish()
            if (data.length === settings.getResultLimit()) {
                prompt(data);
            } else {
                submitResults(data);
            }
        }, function(err) {
            loading.finish();
            var errorString = 'Error executing operation';
            if (err && err !== "") {
                alert(errorString  + ": " + err.simpleMessage);
                console.log(err);
            } else {
                alert(errorString);
            }
        });
    }

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

    var submitResults = function(data) {
        graph.deselectAll();
        results.update(data);
        navigation.goTo('graph');
        queryPage.reset();
        time.resetDateRange();
    }

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
        return opInput;
    }

    var generateFilterFunctions = function(filters) {
        var filterFunctions = [];

        for(var index in filters) {
            var filter = filters[index];
            if(filter.property && filter['predicate']) {
                var functionJson = {
                    "predicate": {
                        class: filter['predicate']
                    },
                    selection: [ filter.property ]
                };

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
                filterFunctions.push(functionJson);
            }
        }

        return filterFunctions;
    }

    var convertFilterFunctions = function(expandElementContent) {
        var filterFunctions = { preAggregation: [], postAggregation: [] };
        if(expandElementContent && expandElementContent.filters) {
            filterFunctions.preAggregation = generateFilterFunctions(expandElementContent.filters.preAggregation);
            filterFunctions.postAggregation = generateFilterFunctions(expandElementContent.filters.postAggregation);
        }
        return filterFunctions;
    }

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

        op.view = {
            globalElements: [{
                groupBy: []
            }],
            entities: {},
            edges: {}
        };

        if (selectedOp.view) {
            for(var i in queryPage.expandEntities) {
                var entity = queryPage.expandEntities[i];
                op.view.entities[entity] = {};

                var filterFunctions = convertFilterFunctions(queryPage.expandEntitiesContent[entity]);
                if(filterFunctions.preAggregation.length > 0) {
                    op.view.entities[entity].preAggregationFilterFunctions = filterFunctions.preAggregation;
                }
                if(filterFunctions.postAggregation.length > 0) {
                    op.view.entities[entity].postAggregationFilterFunctions = filterFunctions.postAggregation;
                }
            }

            for(var i in queryPage.expandEdges) {
                var edge = queryPage.expandEdges[i];
                op.view.edges[edge] = {};

                var filterFunctions = convertFilterFunctions(queryPage.expandEdgesContent[edge]);
                if(filterFunctions.preAggregation.length > 0) {
                    op.view.edges[edge].preAggregationFilterFunctions = filterFunctions.preAggregation;
                }
                if(filterFunctions.postAggregation.length > 0) {
                    op.view.edges[edge].postAggregationFilterFunctions = filterFunctions.postAggregation;
                }
            }
        }

        if (time.getStartDate()) {
            op.view.globalElements.push({
                "preAggregationFilterFunctions": [ {
                    "predicate": {
                        "class": "uk.gov.gchq.koryphe.impl.predicate.IsMoreThan",
                        "orEqualTo": true,
                        "value": types.createJsonValue(vm.timeConfig.start.class, time.getStartDate())
                    },
                    "selection": [ vm.timeConfig.start.property ]
                }]
            });
        }

        if (time.getEndDate()) {
            op.view.globalElements.push({
                "preAggregationFilterFunctions": [ {
                    "predicate": {
                        "class": "uk.gov.gchq.koryphe.impl.predicate.IsLessThan",
                        "orEqualTo": true,
                        "value": types.createJsonValue(vm.timeConfig.end.class, time.getEndDate())
                    },
                    "selection": [ vm.timeConfig.end.property ]
                }]
            });
        }

        if (selectedOp.inOutFlag) {
            op.includeIncomingOutGoing = queryPage.getInOutFlag();
        }

        return op;
    }
}
