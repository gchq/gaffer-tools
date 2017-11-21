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

angular.module('app').factory('queryPage', ['$q', function($q) {
    var service = {}
    var selectedOperation;
    var inOutFlag = 'EITHER';
    var view = {}

    service.expandEntities = [];
    service.expandEdges = [];
    service.expandEntitiesContent = {};
    service.expandEdgesContent = {};



    var defer = $q.defer();

    service.getSelectedOperation = function() {
        return selectedOperation;
    }

    service.setSelectedOperation = function(op) {
        selectedOperation = op;
    }

    service.waitUntilReady = function() {
        return defer.promise;
    }

    service.getInOutFlag = function() {
        return inOutFlag;
    }

    service.setInOutFlag = function(flag) {
        inOutFlag = flag;
    }

    service.initialise = function() {
        defer.resolve();
    }


    service.reset = function() {
        service.expandEntities = [];
        service.expandEdges = [];
        service.expandEntitiesContent = {};
        service.expandEdgesContent = {};
        selectedOperation = undefined;
        inOutFlag = 'EITHER';
    }

    return service;

}]);