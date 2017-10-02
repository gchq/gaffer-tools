(function() {

    'use strict'

    angular.module('app').component('queryBuilder', queryBuilder)

    function queryBuilder() {

        return {
            templateUrl: 'app/query-builder/query-builder.html',
            controller: QueryBuilderController,
            controllerAs: ctrl
        }

        function QueryBuilderController($scope, operationService, typeService, graphService, settingsService, functionService, $window, $mdDialog) {

            var vm = this

            // variables
            vm.relatedEntities = []
            vm.relatedEdges = []
            vm.expandEntities = []
            vm.expandEdges = []
            vm.expandEntitiesContent = {}
            vm.expandEdgesContent = {}
            vm.selectedEntities = graphService.getSelectedEntities()
            vm.selectedEdges = graphService.getSelectedEdges()
            vm.inOutFlag = "EITHER"
            vm.step = 0
            vm.selectedOp = operationService.getAvailableOperations()[0] // TODO should this be the default operation in the settings?

            // watches
            $scope.$watch(graphService.getSelectedEntities, function(oldValue, newValue) {
                if (oldValue !== newValue) {
                    vm.selectedEntities = newValue
                }
            })

            $scope.$watch(graphService.getSelectedEdges, function(oldValue, newValue) {
                if (oldValue !== newValue) {
                    vm.selectedEdges = newValue
                }
            })
            $scope.$watch(graphService.getRelatedEntities, function (oldValue, newValue) {
                if (oldValue !== newValue) {
                    vm.relatedEntities = newValue
                }
            })
            $scope.$watch(graphService.getRelatedEdges, function (oldValue, newValue) {
                if (oldValue !== newValue) {
                    vm.relatedEdges = newValue
                }
            })


            // functions
            vm.onSelectedOpChange = onSelectedOpChange
            vm.goToNextStep = goToNextStep
            vm.goToPrevStep = goToPrevStep
            vm.getAvailableOperations = operationService.getAvailableOperations
            vm.getAllSeeds = graphService.selectAllNodes
            vm.showOperations = vm.showOperations
            vm.cancel = $mdDialog.cancel
            vm.getTypes = getTypes
            vm.toggle = toggle
            vm.exists = exists
            vm.getEdgeProperties = schemaService.getEdgeProperties
            vm.getEntityProperties = schemaService.getEntityProperties
            vm.onSelectedPropertyChange = onSelectedPropertyChange
            vm.onSelectedFunctionChange = onSelectedFunctionChange
            vm.addFilterFunction = addFilterFunction


            function onSelectedOpChange(op){
                vm.selectedOp = op;
                vm.goToNextStep();
            }

            function goToNextStep() {
                vm.step = vm.step + 1;
                if(vm.step == 2 && vm.selectedOp.arrayOutput) {
                    vm.executeBuildQueryCounts();
                }
            }

            function goToPrevStep() {
               vm.step = vm.step - 1;
            }

            function showOperations(operations) {
                var newWindow = $window.open('about:blank', '', '_blank');
                var prettyOps;
                try {
                    prettyOps = JSON.stringify(JSON.parse(operations), null, 2);
                } catch(e) {
                    prettyOps = operations;
                }
                newWindow.document.write("<pre>" + prettyOps + "</pre>");
            }

            function getTypes(clazz) {
                return typeService.getType(clazz).types
            }

            function toggle(item, list) {
                var idx = list.indexOf(item)
                if(idx > -1) {
                    list.splice(idx, 1)
                } else {
                    list.push(item)
                }
            }

            function exists(item, list) {
                return list && list.indexOf(item) > -1
            }

            function getEntityProperties(entity) {
                return schemaService.getEntityProperties(entity)
            }

            function getEdgeProperties(edge) {
                return schemaService.getEdgeProperties(edge)
            }

            function onSelectedPropertyChange(group, selectedElement) {
                functionService.getFunctions(group, selectedElement.property, function(data) {
                    selectedElement.availableFunctions = data
                    $scope.$apply()
                });
                selectedElement.predicate = '';
            }

            function onSelectedFunctionChange(group, selectedElement) {
                functionService.getFunctionParameters(selectedElement.predicate, function(data) {
                    selectedElement.availableFunctionParameters = data
                    $scope.$apply()
                });

                var elementDef = raw.schema.entities[group];
                if(!elementDef) {
                     elementDef = raw.schema.edges[group];
                }
                var propertyClass = raw.schema.types[elementDef.properties[selectedElement.property]].class;
                if("java.lang.String" !== propertyClass
                    && "java.lang.Boolean" !== propertyClass
                    && "java.lang.Integer" !== propertyClass) {
                    selectedElement.propertyClass = propertyClass;
                }

                selectedElement.parameters = {};
            }

            function addFilterFunction(expandElementContent, element) {
                if(!expandElementContent[element]) {
                    expandElementContent[element] = {};
                }

                if(!expandElementContent[element].filters) {
                    expandElementContent[element].filters = [];
                }

                expandElementContent[element].filters.push({});
            }

            function onInOutFlagChange(newInOutFlag) {
                vm.inOutFlag = newInOutFlag;
            }

            function execute() {
                var operation = createOperation();
                resetQueryBuilder();
                $mdDialog.hide(operation);
            }

            function executeBuildQueryCounts() {
                var operations = {
                    class: "uk.gov.gchq.gaffer.operation.OperationChain",
                    operations: [createOperation(), createLimitOperation(), createCountOperation()]
                };
                var onSuccess = function(data) {
                    vm.expandQueryCounts = {
                        count: data,
                        limitHit: (data == settingsService.getResultLimit())
                    }
                }
                vm.expandQueryCounts = undefined;
                operationService.execute(JSON.stringify(operations), onSuccess);
            }

            function createOpInput() {
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

            function convertFilterFunctions(expandElementContent, elementDefinition) {
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


            function clone(obj) {
                return JSON.parse(JSON.stringify(obj));
            }

            function createOperation() {
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
                        opParams[name] = typeService.getType(valueClass).createValue(valueClass, vm.selectedOp.parameters[name].parts);
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

                        var filterFunctions = convertFilterFunctions(vm.expandEntitiesContent[entity], raw.schema.entities[entity]);
                        if(filterFunctions.length > 0) {
                            op.view.entities[entity].preAggregationFilterFunctions = filterFunctions;
                        }
                    }

                    for(var i in vm.expandEdges) {
                        var edge = vm.expandEdges[i];
                        op.view.edges[edge] = {};

                        var filterFunctions = convertFilterFunctions(vm.expandEdgesContent[edge], schemaService.getSchema().edges[edge]);
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

            function resetQueryBuilder() {
                vm.step = 0;
                vm.expandEdges = [];
                vm.expandEntities = [];
                vm.expandQueryCounts = undefined;
                vm.expandEntitiesContent = {};
                vm.expandEdgesContent = {};
            }

            function createLimitOperation() {
                return {
                    class: "uk.gov.gchq.gaffer.operation.impl.Limit",
                    resultLimit: settingsService.getResultLimit
                }
            }

            function createCountOperation() {
                return {
                    class: "uk.gov.gchq.gaffer.operation.impl.Count"
                }
            }
        }
    }
})()