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

angular.module('app').controller('CustomiseVertexDialogController', ['$scope', '$mdDialog', 'settings', function($scope, $mdDialog, settings) {
    $scope.vertexColours = settings.vertexColours;
    $scope.vertexShapes = settings.vertexShapes;
    $scope.vertex = this.vertex;
    $scope.label = this.label;
    $scope.shape = this.shape;
    $scope.colour = this.colour;
    $scope.onSave = this.onSave;

    var ttl = settings.getTimeToLiveInDays();
    if(ttl > 0) {
        var msg = "These customisations will be cached for ";
        if(ttl > 1) {
            $scope.cacheTtlMessage = msg + ttl + " days.";
        } else {
            $scope.cacheTtlMessage = msg + "1 day.";
        }
    } else {
        $scope.cacheTtlMessage =  "";
    }

    $scope.cancel = function() {
        $mdDialog.cancel();
    }

    $scope.save = function() {
        var customVertex = null;
        var customVertices = settings.getCustomVertexLabels();
        for(var i in customVertices) {
            if(customVertices[i].vertex == $scope.vertex) {
                customVertex = customVertices[i];
                break;
            }
        }
        var exists = customVertex != null;
        if(!exists) {
            customVertex = {
               "vertex": $scope.vertex,
               "id": String(new Date().getTime()) + Math.random(),
               "edit": false
           };
        }

        customVertex.label = $scope.label;
        customVertex.shape = $scope.shape;
        customVertex.colour = $scope.colour;
        customVertex.timestamp = String(new Date().getTime());
        if(!exists) {
            customVertices.unshift(customVertex);
        }
        settings.setCustomVertexLabels(customVertices);
        $scope.onSave();
        $mdDialog.hide()
    }
}]);
