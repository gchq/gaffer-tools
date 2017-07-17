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

angular.module('app').controller('AppController',
    [ '$scope', '$mdDialog', '$http', '$location', 'settings', 'graph', 'raw', 'table', 'buildQuery', 'nav',
    function($scope, $mdDialog, $http, $location, settings, graph, raw, table, buildQuery, nav){

    $scope.settings = settings;
    $scope.rawData = raw;
    $scope.graph = graph;
    $scope.table = table;
    $scope.buildQuery = buildQuery;
    $scope.nav = nav;

    $scope.operations = [];
    $scope.graphData = {entities: {}, edges: {}, entitySeeds: {}};
    $scope.selectedEntities = {};
    $scope.selectedEdges = {};
    $scope.selectedElementTabIndex = 0;
    $scope.editingOperations = false;

    $scope.addSeedVertex = '';
    $scope.addSeedVertexParts = {};

    $scope.onNamedOpSelect = function(op) {
       $scope.namedOp.onNamedOpSelect(op);
    }

    $scope.redraw = function() {
        if(nav.showGraph) {
            $scope.selectedEntities = {};
            $scope.selectedEdges = {};
            graph.redraw();
       }
    };

    $scope.initialise = function() {
        $scope.nav.openGraph();

        var updateResultsListener = function() {
            updateGraphData(raw.results);
            table.update(raw.results);
            if(!$scope.$$phase) {
               $scope.$apply();
            }
        }

        var updateScope = function() {
            if(!$scope.$$phase) {
               $scope.$apply();
            }
        }

        raw.initialise(updateResultsListener, updateScope);
    };

    function addSeedDialogController($scope, $mdDialog) {
        $scope.addSeedCancel = function() {
          $mdDialog.cancel();
        };

        $scope.addSeedAdd = function() {
          var vertexTypeClass = $scope.rawData.schema.types[$scope.addSeedVertexType].class;
          $scope.addSeedVertex = settings.getType(vertexTypeClass).createValueAsJsonWrapperObj(vertexTypeClass, $scope.addSeedVertexParts);

          var seed = {vertexType: $scope.addSeedVertexType, vertex: $scope.addSeedVertex};
          $scope.addSeedVertexType = '';
          $scope.addSeedVertex = '';
          $scope.addSeedVertexParts = {};
          $mdDialog.hide(seed);
        };
      }

    $scope.addSeedPrompt = function(ev) {
        $mdDialog.show({
              scope: $scope,
              preserveScope: true,
              controller: addSeedDialogController,
              templateUrl: 'app/graph/addSeedDialog.html',
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose: true,
              fullscreen: $scope.customFullscreen
            })
            .then(function(seed) {
              $scope.addSeed(seed.vertexType, seed.vertex);
              if(nav.showResultsTable) {
                table.selectedTab = 2;
              }
            });
      };

    $scope.openBuildQueryDialog = function(ev) {
        $scope.buildQuery.step = 0;

        $mdDialog.show({
          scope: $scope,
          preserveScope: true,
          controller: $scope.buildQuery.dialogController,
          templateUrl: 'app/graph/buildQueryDialog.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true,
          fullscreen: $scope.customFullscreen
        })
        .then(function(operation) {
            $scope.operations.push(operation);
            raw.execute(JSON.stringify({operations: [operation, createLimitOperation(), createDeduplicateOperation()]}));
        });
    }

    var getVertexTypeFromEntityGroup = function(group) {
        for(var entityGroup in raw.schema.entities) {
            if(entityGroup === group) {
                return raw.schema.entities[entityGroup].vertex;
            }
        }
    }

    var getVertexTypesFromEdgeGroup = function(group) {
        for(var edgeGroup in raw.schema.edges) {
            if(edgeGroup === group) {
               return [raw.schema.edges[edgeGroup].source, raw.schema.edges[edgeGroup].destination];
            }
        }
    }

    var updateRelatedEntities = function() {
        $scope.relatedEntities = [];
        for(id in $scope.selectedEntities) {
            var vertexType = $scope.selectedEntities[id][0].vertexType;
            for(var entityGroup in raw.schema.entities) {
                if(vertexType === "unknown") {
                     $scope.relatedEntities.push(entityGroup);
                } else {
                    var entity = raw.schema.entities[entityGroup];
                    if(entity.vertex === vertexType
                        && $scope.relatedEntities.indexOf(entityGroup) === -1) {
                        $scope.relatedEntities.push(entityGroup);
                    }
                }
            }
        }
    }

    var updateRelatedEdges = function() {
        $scope.relatedEdges = [];
        for(id in $scope.selectedEntities) {
            var vertexType = $scope.selectedEntities[id][0].vertexType;
            for(var edgeGroup in raw.schema.edges) {
                var edge = raw.schema.edges[edgeGroup];
                if((edge.source === vertexType || edge.destination === vertexType)
                    && $scope.relatedEdges.indexOf(edgeGroup) === -1) {
                    $scope.relatedEdges.push(edgeGroup);
                }
            }
        }
    }

    $scope.addSeed = function(vertex, value) {
        raw.updateResults([{
            "class": "uk.gov.gchq.gaffer.operation.data.EntitySeed",
            "vertex": value
        }]);
    }

    arrayContainsValue = function(arr, value) {
        var jsonValue = JSON.stringify(value);
        for(var i in arr) {
            if(JSON.stringify(arr[i]) === jsonValue) {
                return true;
            }
        }

        return false;
    }

    $scope.clearResults = function() {
        raw.clearResults();
        $scope.selectedEntities = {};
        $scope.selectedEdges = {};
        $scope.graphData = {entities: {}, edges: {}, entitySeeds: {}};
        table.clear();
        graph.clear();
    }

    $scope.updateGraph = function() {
        graph.update($scope.graphData);
    }

    var parseVertex = function(vertex) {
        if(typeof vertex === 'string' || vertex instanceof String) {
            vertex = "\"" + vertex + "\"";
        }

        try {
             JSON.parse(vertex);
        } catch(err) {
             // Try using stringify
             vertex = JSON.stringify(vertex);
        }

        return vertex;
    }

    var updateGraphData = function(results) {
        $scope.graphData = {entities: {}, edges: {}, entitySeeds: {}};
        for (var i in results.entities) {
            var entity = clone(results.entities[i]);
            entity.vertex = parseVertex(entity.vertex);
            var id = entity.vertex;
            entity.vertexType = getVertexTypeFromEntityGroup(entity.group);
            if(id in $scope.graphData.entities) {
                if(!arrayContainsValue($scope.graphData.entities[id], entity)) {
                    $scope.graphData.entities[id].push(entity);
                }
            } else {
                $scope.graphData.entities[id] = [entity];
            }
        }

        for (var i in results.edges) {
            var edge = clone(results.edges[i]);
            edge.source = parseVertex(edge.source);
            edge.destination = parseVertex(edge.destination);

            var vertexTypes = getVertexTypesFromEdgeGroup(edge.group);
            edge.sourceType = vertexTypes[0];
            edge.destinationType = vertexTypes[1];
            var id = edge.source + "|" + edge.destination + "|" + edge.directed + "|" + edge.group;
            if(id in $scope.graphData.edges) {
                if(!arrayContainsValue($scope.graphData.edges[id], edge)) {
                    $scope.graphData.edges[id].push(edge);
                }
            } else {
                $scope.graphData.edges[id] = [edge];
            }
        }

        for (var i in results.entitySeeds) {
            var entitySeed = {
               vertex: parseVertex(results.entitySeeds[i]),
               vertexType: "unknown"
            }
            var id = entitySeed.vertex;
            if(id in $scope.graphData.entitySeeds) {
                if(!arrayContainsValue($scope.graphData.entitySeeds[id], entitySeed)) {
                    $scope.graphData.entitySeeds[id].push(entitySeed);
                }
            } else {
                $scope.graphData.entitySeeds[id] = [entitySeed];
            }
        }
        $scope.updateGraph();
    }

    var clone = function(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    $scope.addOperation = function() {
        $scope.operations.push({
             class: settings.defaultOp
        });
    };

  var createLimitOperation = function() {
        return {
            class: "uk.gov.gchq.gaffer.operation.impl.Limit",
            resultLimit: settings.resultLimit
        };
    }

    var createDeduplicateOperation = function() {
        return {
            class: "uk.gov.gchq.gaffer.operation.impl.output.ToSet",
        };
    }

    $scope.executeAll = function() {
        $scope.clearResults();
        buildQuery.resetBuildQuery();
       for(var i in $scope.operations) {
           try {
              raw.execute(JSON.stringify({operations: [$scope.operations[i], createLimitOperation(), createDeduplicateOperation()]}));
           } catch(e) {
              // Try without the limit and deduplicate operations
              raw.execute(JSON.stringify({operations: [$scope.operations[i]]}));
           }
       }
    }

  graph.onGraphElementSelect(function(element){
     $scope.selectedElementTabIndex = 0;
      var _id = element.id();
      for (var id in $scope.graphData.entities) {
            if(_id == id) {
                table.onSeedSelect(id);
                $scope.selectedEntities[id] = $scope.graphData.entities[id];
                $scope.selectedEntitiesCount = Object.keys($scope.selectedEntities).length;
                updateRelatedEntities();
                updateRelatedEdges();
                if(!$scope.$$phase) {
                    $scope.$apply();
                  }
                return;
            }
        };
      for (var id in $scope.graphData.edges) {
          if(_id == id) {
              $scope.selectedEdges[id] = $scope.graphData.edges[id];
              $scope.selectedEdgesCount = Object.keys($scope.selectedEdges).length;
              if(!$scope.$$phase) {
                  $scope.$apply();
                }
              return;
          }
      };

//      table.onSeedSelect(_id);
      $scope.selectedEntities[_id] = [{vertexType: element.data().vertexType, vertex: _id}];
      $scope.selectedEntitiesCount = Object.keys($scope.selectedEntities).length;
      updateRelatedEntities();
      updateRelatedEdges();

      if(!$scope.$$phase) {
        $scope.$apply();
      }
  });

  graph.onGraphElementUnselect(function(element){
      $scope.selectedElementTabIndex = 0;
      if(element.id() in $scope.selectedEntities) {
        delete $scope.selectedEntities[element.id()];
//        table.onSeedDeselect(element.id());
        $scope.selectedEntitiesCount = Object.keys($scope.selectedEntities).length;
        updateRelatedEntities();
        updateRelatedEdges();
      } else if(element.id() in $scope.selectedEdges) {
        delete $scope.selectedEdges[element.id()];
        $scope.selectedEdgesCount = Object.keys($scope.selectedEdges).length;
      }

      $scope.$apply();
  });

  $scope.editOperations = function() {
    $scope.operationsForEdit = [];
    for(var i in $scope.operations) {
        $scope.operationsForEdit.push(JSON.stringify($scope.operations[i], null, 2));
    }
    $scope.editingOperations = true;
  }

  $scope.saveOperations = function() {
      $scope.operations = [];
      for(var i in $scope.operationsForEdit) {
          try {
            $scope.operations.push(JSON.parse($scope.operationsForEdit[i]));
          } catch(e) {
            console.log('Invalid json: ' + $scope.operationsForEdit[i]);
          }
      }
      $scope.editingOperations = false;
   }

   $scope.onInOutFlagChange = function(newInOutFlag) {
       $scope.inOutFlag = newInOutFlag;
   }

  $scope.initialise();
} ]);
