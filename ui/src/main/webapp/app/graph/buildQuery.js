/*
 * Copyright 2016 Crown Copyright
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

angular.module('app').factory('buildQuery', [ '$q', '$window', 'raw', 'settings', function( $q, $window, raw, settings ){
    var buildQuery = {};

    buildQuery.selectedEntities = {};
    buildQuery.selectedEdges = {};

    buildQuery.expandEntities = [];
    buildQuery.expandEdges = [];
    buildQuery.expandEntitiesContent = {};
    buildQuery.expandEdgesContent = {};
    buildQuery.inOutFlag = "EITHER";
    buildQuery.step = 0;
    buildQuery.selectedOp = raw.availableOps[0];

    buildQuery.onSelectedOpChange = function(op){
        buildQuery.selectedOp = op;
        buildQuery.goToNextStep();
    };

    buildQuery.goToNextStep = function() {
       buildQuery.step = buildQuery.step + 1;
       if(buildQuery.step == 2 && buildQuery.selectedOp.arrayOutput) {
           executeBuildQueryCounts();
       }
    };

    buildQuery.goToPrevStep = function() {
       buildQuery.step = buildQuery.step - 1;
    }

    buildQuery.redraw = function() {
        if(buildQuery.showGraph) {
            buildQuery.selectedEntities = {};
            buildQuery.selectedEdges = {};
            graph.redraw();
       }
    };

    buildQuery.dialogController = function($scope, $mdDialog) {
        buildQuery.selectedEntities = $scope.selectedEntities;
        buildQuery.selectedEdges = $scope.selectedEntities;

        $scope.buildQuery.cancel = function() {
          $mdDialog.cancel();
        };
        
        $scope.buildQuery.execute = function() {
          var operation = createOperation();
          $scope.buildQuery.resetBuildQuery();
          $mdDialog.hide(operation);
        };
    }

    buildQuery.addFilterFunction = function(expandElementContent, element) {
        if(!expandElementContent[element]) {
            expandElementContent[element] = {};
        }

        if(!expandElementContent[element].filters) {
            expandElementContent[element].filters = [];
        }

        expandElementContent[element].filters.push({});
    }

    createOpInput = function() {
        var opInput = [];
        var jsonVertex;
        for(var vertex in buildQuery.selectedEntities) {
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
             class: buildQuery.selectedOp.class
        };

        if(buildQuery.selectedOp.namedOp) {
            op.operationName = buildQuery.selectedOp.name;
        }

        if (buildQuery.selectedOp.input) {
           var jsonVertex;
           for(var vertex in buildQuery.selectedEntities) {
               try {
                  jsonVertex = JSON.parse(vertex);
               } catch(err) {
                  jsonVertex = vertex;
               }
               op.input = createOpInput();
           }
        }

        if (buildQuery.selectedOp.parameters) {
            var opParams = {};
            for(name in buildQuery.selectedOp.parameters) {
                var valueClass = buildQuery.selectedOp.parameters[name].valueClass;
                opParams[name] = settings.getType(valueClass).createValue(valueClass, buildQuery.selectedOp.parameters[name].parts);
            }
            op.parameters = opParams;
        }

       if (buildQuery.selectedOp.view) {
            op.view = {
                globalElements: [{
                    groupBy: []
                }],
                entities: {},
                edges: {}
            };

            for(var i in buildQuery.expandEntities) {
                var entity = buildQuery.expandEntities[i];
                op.view.entities[entity] = {};

                var filterFunctions = convertFilterFunctions(buildQuery.expandEntitiesContent[entity], raw.schema.entities[entity]);
                if(filterFunctions.length > 0) {
                    op.view.entities[entity].preAggregationFilterFunctions = filterFunctions;
                }
            }

            for(var i in buildQuery.expandEdges) {
                var edge = buildQuery.expandEdges[i];
                op.view.edges[edge] = {};

                var filterFunctions = convertFilterFunctions(buildQuery.expandEdgesContent[edge], raw.schema.edges[edge]);
                if(filterFunctions.length > 0) {
                    op.view.edges[edge].preAggregationFilterFunctions = filterFunctions;
                }
            }
        }

       if (buildQuery.selectedOp.inOutFlag) {
            op.includeIncomingOutGoing = buildQuery.inOutFlag;
        }

        return op;
    }

    buildQuery.resetBuildQuery = function() {
        buildQuery.step = 0;
        buildQuery.expandEdges = [];
        buildQuery.expandEntities = [];
        buildQuery.showBuildQuery = false;
        buildQuery.expandQueryCounts = undefined;
        buildQuery.expandEntitiesContent = {};
        buildQuery.expandEdgesContent = {};
    };

    var createLimitOperation = function() {
        return {
            class: "uk.gov.gchq.gaffer.operation.impl.Limit",
            resultLimit: settings.resultLimit
        };
    }

    var createCountOperation = function() {
        return {
            class: "uk.gov.gchq.gaffer.operation.impl.Count"
        };
    }

    var executeBuildQueryCounts = function() {
        var operations = {
            class: "uk.gov.gchq.gaffer.operation.OperationChain",
            operations: [createOperation(), createLimitOperation(), createCountOperation()]
        };
        var onSuccess = function(data) {
            buildQuery.expandQueryCounts = {
                count: data,
                limitHit: (data == settings.resultLimit)
            }
        }
        buildQuery.expandQueryCounts = undefined;
        raw.execute(JSON.stringify(operations), onSuccess);
    };


  buildQuery.onSelectedPropertyChange = function(group, selectedElement) {
    raw.functions(group, selectedElement.property, function(data) {
        selectedElement.availableFunctions = data;
    });
    selectedElement.predicate = '';
  }

  buildQuery.onSelectedFunctionChange = function(group, selectedElement) {
    raw.functionParameters(selectedElement.predicate, function(data) {
        console.log(data);
        selectedElement.availableFunctionParameters = data;
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

   buildQuery.toggle = function(item, list) {
      var idx = list.indexOf(item);
      if(idx > -1) {
          list.splice(idx, 1);
      } else {
          list.push(item);
      }
    }

    buildQuery.exists = function(item, list) {
      return list && list.indexOf(item) > -1;
    }

    buildQuery.showOperations = function(operations) {
        var newWindow = $window.open('about:blank', '', '_blank');
        var prettyOps;
        try {
            prettyOps = JSON.stringify(JSON.parse(operations), null, 2);
        } catch(e) {
            prettyOps = operations;
        }
        newWindow.document.write("<pre>" + prettyOps + "</pre>");
    }

  return buildQuery;
} ]);
