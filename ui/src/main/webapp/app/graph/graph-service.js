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

angular.module('app').factory('graph', function() {
    var service = {};

    var graphConfiguration = null;

    var selectedElements = {
        entities: {},
        edges: {}
    }

    var searchTerm = null;

    
    service.getGraphConfiguration = function() {
        return angular.copy(graphConfiguration);
    }

    service.setGraphConfiguration = function(graphConfig) {
        graphConfiguration = angular.copy(graphConfig);
    }

    service.getSelectedElements = function() {
        return angular.copy(selectedElements);
    }

    service.setSelectedElements = function(newSelectedElements) {
        selectedElements = angular.copy(newSelectedElements);
    }

    service.getSearchTerm = function() {
        return angular.copy(searchTerm);
    }

    service.setSearchTerm = function(search) {
        searchTerm = angular.copy(search);
    }

    service.deselectAll = function() {
        selectedElements = {
            entities: {},
            edges: {}
        }
    }

    return service;
});
