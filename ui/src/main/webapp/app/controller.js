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
    [ '$scope', '$mdDialog', '$http', '$location', 'settingsService', 'configService', 'graph', 'raw', 'table', 'buildQuery', 'nav',
    function($scope, $mdDialog, $http, $location, settings, graph, raw, table, buildQuery, nav){

    $scope.settings = settings;
    $scope.rawData = raw;
    $scope.graph = graph;
    $scope.table = table;
    $scope.buildQuery = buildQuery;
    $scope.nav = nav;

    $scope.operations = []
    $scope.selectedElementTabIndex = 0;
    $scope.editingOperations = false;



    $scope.onNamedOpSelect = function(op) {
       $scope.namedOp.onNamedOpSelect(op);
    }



    $scope.initialise = function() {
        $scope.nav.openGraph();







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
  $scope.initialise();
} ]);
