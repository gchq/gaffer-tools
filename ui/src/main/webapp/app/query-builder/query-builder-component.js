'use strict'

angular.module('app').component('queryBuilder', queryBuilder())

function queryBuilder() {

    return {
        templateUrl: 'app/query-builder/query-builder.html',
        controller: QueryBuilderController,
        controllerAs: 'ctrl'
    }
}

function QueryBuilderController($scope, operationService, types, graph, config, settings, query, functions, schema, $window, $mdDialog) {

    var vm = this

    // variables

    vm.relatedEntities = graph.getRelatedEntities()
    vm.relatedEdges = graph.getRelatedEdges()
    vm.expandEntities = []
    vm.expandEdges = []
    vm.expandEntitiesContent = {}
    vm.expandEdgesContent = {}
    vm.selectedEntities = graph.getSelectedEntities()
    vm.selectedEdges = graph.getSelectedEdges()
    vm.inOutFlag = "EITHER"
    vm.step = 0
    vm.availableOperations = operationService.getAvailableOperations()
    vm.selectedOp = vm.availableOperations[0] // TODO should this be the default operation in the settings?

    // watches

    graph.onSelectedElementsUpdate(function(selectedElements) {
        vm.selectedEntities = selectedElements['entities']
        vm.selectedEdges = selectedElements['edges']
    })

    graph.onRelatedEntitiesUpdate(function(relatedEntities) {
        vm.relatedEntities = relatedEntities
    })

    graph.onRelatedEdgesUpdate(function(relatedEdges) {
        vm.relatedEdges = relatedEdges
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

    vm.getTypes = function(clazz) {
        return types.getType(clazz).types
    }

    vm.selectAllSeeds = function() {
        graph.selectAllNodes()
    }

    vm.toggle = function(item, list) {
        var idx = list.indexOf(item)
        if(idx > -1) {
            list.splice(idx, 1)
        } else {
            list.push(item)
        }
    }

    vm.exists = function(item, list) {
        return list && list.indexOf(item) > -1
    }


    vm.onSelectedPropertyChange = function(group, selectedElement) {
        functions.getFunctions(group, selectedElement.property, function(data) {
            selectedElement.availableFunctions = data
            $scope.$apply()
        });
        selectedElement.predicate = '';
    }

    vm.onSelectedFunctionChange = function(group, selectedElement) {
        functions.getFunctionParameters(selectedElement.predicate, function(data) {
            selectedElement.availableFunctionParameters = data
            $scope.$apply()
        });

        var gafferSchema = schema.get()

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

    vm.addFilterFunction = function(expandElementContent, element) {
        if(!expandElementContent[element]) {
            expandElementContent[element] = {};
        }

        if(!expandElementContent[element].filters) {
            expandElementContent[element].filters = [];
        }

        expandElementContent[element].filters.push({});
    }

    vm.execute = function() {
        var operation = createOperation();
        resetQueryBuilder();
        $mdDialog.hide(operation);
    }

    vm.executeBuildQueryCounts = function() {
        var operations = {
            class: "uk.gov.gchq.gaffer.operation.OperationChain",
            operations: [createOperation(), createLimitOperation(), createCountOperation()]
        };
        var onSuccess = function(data) {
            vm.expandQueryCounts = {
                count: data,
                limitHit: (data == settings.getResultLimit())
            }
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

    var convertFilterFunctions = function(expandElementContent, elementDefinition) {
        var filterFunctions = [];
        if(expandElementContent && expandElementContent.filters) {
            for(var index in expandElementContent.filters) {
                var filter = expandElementContent.filters[index];
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
        }
        return filterFunctions;
    }


    var clone = function(obj) {
        return JSON.parse(JSON.stringify(obj));
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

                var filterFunctions = convertFilterFunctions(vm.expandEntitiesContent[entity], schema.get().entities[entity]);
                if(filterFunctions.length > 0) {
                    op.view.entities[entity].preAggregationFilterFunctions = filterFunctions;
                }
            }

            for(var i in vm.expandEdges) {
                var edge = vm.expandEdges[i];
                op.view.edges[edge] = {};

                var filterFunctions = convertFilterFunctions(vm.expandEdgesContent[edge], schema.get().edges[edge]);
                if(filterFunctions.length > 0) {
                    op.view.edges[edge].preAggregationFilterFunctions = filterFunctions;
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

    var createLimitOperation = function() {
        return {
            class: "uk.gov.gchq.gaffer.operation.impl.Limit",
            resultLimit: settings.getResultLimit()
        }
    }

    var createCountOperation = function() {
        return {
            class: "uk.gov.gchq.gaffer.operation.impl.Count"
        }
    }
}
