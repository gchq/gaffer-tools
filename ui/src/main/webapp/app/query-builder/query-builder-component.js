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

'use strict'

angular.module('app').component('queryBuilder', queryBuilder());

function queryBuilder() {

    return {
        templateUrl: 'app/query-builder/query-builder.html',
        controller: QueryBuilderController,
        controllerAs: 'ctrl'
    };
}

function QueryBuilderController($scope, operationService, types, graph, config, settings, query, functions, schema, common, $window, $mdDialog) {

    var vm = this;

    // variables

    vm.relatedEntities = graph.getRelatedEntities();
    vm.relatedEdges = graph.getRelatedEdges();
    vm.expandEntities = [];
    vm.expandEdges = [];
    vm.expandEntitiesContent = {};
    vm.expandEdgesContent = {};
    vm.selectedEntities = graph.getSelectedEntities();
    vm.selectedEdges = graph.getSelectedEdges();
    vm.inOutFlag = "EITHER";
    vm.step = 0;
    vm.availableOperations = operationService.getAvailableOperations();
    vm.selectedOp = vm.availableOperations[0] // TODO should this be the default operation in the settings?

    // watches

    graph.onSelectedElementsUpdate(function(selectedElements) {
        vm.selectedEntities = selectedElements['entities'];
        vm.selectedEdges = selectedElements['edges'];
    })

    graph.onRelatedEntitiesUpdate(function(relatedEntities) {
        vm.relatedEntities = relatedEntities;
    })

    graph.onRelatedEdgesUpdate(function(relatedEdges) {
        vm.relatedEdges = relatedEdges;
    })


    vm.onSelectedOpChange = function(op){
        vm.selectedOp = op;
        vm.goToNextStep();
    }


    vm.goToNextStep = function() {
        vm.step = vm.step + 1;
        if(vm.step == 2 && vm.selectedOp.arrayOutput) {
            vm.executeBuildQueryCounts();
        }
    }

    vm.goToPrevStep = function() {
       vm.step = vm.step - 1;
    }

    vm.refreshNamedOperations = function() {
        operationService.reloadNamedOperations(true).then(function(availableOps) {
            vm.availableOperations = availableOps;
        });
    }

    vm.showOperations = function(operations) {
        var newWindow = $window.open('about:blank', '', '_blank');
        var prettyOps;
        try {
            prettyOps = JSON.stringify(JSON.parse(operations), null, 2);
        } catch(e) {
            prettyOps = operations;
        }
        newWindow.document.write("<pre>" + prettyOps + "</pre>");
    }

    vm.getFields = function(clazz) {
        return types.getType(clazz).fields;
    }

    vm.selectAllSeeds = function() {
        graph.selectAllNodes();
    }

    vm.getEntityProperties = schema.getEntityProperties;
    vm.getEdgeProperties = schema.getEdgeProperties;
    vm.exists = common.arrayContainsValue;

    vm.cancel = function(event) {
        resetQueryBuilder();
        $mdDialog.cancel(event);
    }

    vm.toggle = function(item, list) {
        var idx = list.indexOf(item);
        if(idx > -1) {
            list.splice(idx, 1);
        } else {
            list.push(item);
        }
    }


    vm.onSelectedPropertyChange = function(group, selectedElement) {
        functions.getFunctions(group, selectedElement.property, function(data) {
            selectedElement.availableFunctions = data;
        });
        selectedElement.predicate = '';
    }

    vm.onSelectedFunctionChange = function(group, selectedElement) {
        functions.getFunctionParameters(selectedElement.predicate, function(data) {
            selectedElement.availableFunctionParameters = data;
        });

        var gafferSchema = schema.get();

        var elementDef = gafferSchema.entities[group];
        if(!elementDef) {
             elementDef = gafferSchema.edges[group];
        }
        var propertyClass = gafferSchema.types[elementDef.properties[selectedElement.property]].class;
        if("java.lang.String" !== propertyClass
            && "java.lang.Boolean" !== propertyClass
            && "java.lang.Integer" !== propertyClass) {
            selectedElement.propertyClass = propertyClass;
        }

        selectedElement.parameters = {};
    }

    vm.addFilterFunction = function(expandElementContent, element, isPreAggregation) {
        if(!expandElementContent[element]) {
            expandElementContent[element] = {};
        }

        if(!expandElementContent[element].filters) {
            expandElementContent[element].filters = {};
        }

        if (isPreAggregation) {
            if (!expandElementContent[element].filters.preAggregation) {
                expandElementContent[element].filters.preAggregation = [];
            }
            expandElementContent[element].filters.preAggregation.push({});

        } else {
            if (!expandElementContent[element].filters.postAggregation) {
                expandElementContent[element].filters.postAggregation = [];
            }
            expandElementContent[element].filters.postAggregation.push({});
        }

    }

    vm.execute = function() {
        var operation = createOperation();
        resetQueryBuilder();
        $mdDialog.hide(operation);
    }

    vm.executeBuildQueryCounts = function() {
        var operations = {
            class: "uk.gov.gchq.gaffer.operation.OperationChain",
            operations: [createOperation(), operationService.createLimitOperation(), operationService.createCountOperation()]
        };
        var onSuccess = function(data) {
            vm.expandQueryCounts = {
                count: data,
                limitHit: (data == settings.getResultLimit())
            };
        }
        vm.expandQueryCounts = undefined;
        query.execute(JSON.stringify(operations), onSuccess);
    }

    var createOpInput = function() {
        var opInput = [];
        var jsonVertex;
        for(var vertex in vm.selectedEntities) {
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
                    if(filter.parameters[i]) {
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
        var op = {
             class: vm.selectedOp.class
        };

        if(vm.selectedOp.namedOp) {
            op.operationName = vm.selectedOp.name;
        }

        if (vm.selectedOp.input) {
           var jsonVertex;
           for(var vertex in vm.selectedEntities) {
               try {
                  jsonVertex = JSON.parse(vertex);
               } catch(err) {
                  jsonVertex = vertex;
               }
               op.input = createOpInput();
           }
        }

        if (vm.selectedOp.parameters) {
            var opParams = {};
            for(name in vm.selectedOp.parameters) {
                var valueClass = vm.selectedOp.parameters[name].valueClass;
                opParams[name] = types.getType(valueClass).createValue(valueClass, vm.selectedOp.parameters[name].parts);
            }
            op.parameters = opParams;
        }

        if (vm.selectedOp.view) {
            op.view = {
                globalElements: [{
                    groupBy: []
                }],
                entities: {},
                edges: {}
            };

            for(var i in vm.expandEntities) {
                var entity = vm.expandEntities[i];
                op.view.entities[entity] = {};

                var filterFunctions = convertFilterFunctions(vm.expandEntitiesContent[entity]);
                if(filterFunctions.preAggregation.length > 0) {
                    op.view.entities[entity].preAggregationFilterFunctions = filterFunctions.preAggregation;
                }
                if(filterFunctions.postAggregation.length > 0) {
                    op.view.entities[entity].postAggregationFilterFunctions = filterFunctions.postAggregation;
                }

            }

            for(var i in vm.expandEdges) {
                var edge = vm.expandEdges[i];
                op.view.edges[edge] = {};

                var filterFunctions = convertFilterFunctions(vm.expandEdgesContent[edge]);
                if(filterFunctions.preAggregation.length > 0) {
                    op.view.edges[edge].preAggregationFilterFunctions = filterFunctions.preAggregation;
                }
                if(filterFunctions.postAggregation.length > 0) {
                    op.view.edges[edge].postAggregationFilterFunctions = filterFunctions.postAggregation;
                }
            }
        }

        if (vm.selectedOp.inOutFlag) {
            op.includeIncomingOutGoing = vm.inOutFlag;
        }

        return op;
    }

    var resetQueryBuilder = function() {
        vm.step = 0;
        vm.expandEdges = [];
        vm.expandEntities = [];
        vm.expandQueryCounts = undefined;
        vm.expandEntitiesContent = {};
        vm.expandEdgesContent = {};
    }
}
