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

/**
 * Simple service for storing variables and configuration relevant to the graph.
 */
angular.module('app').factory('graph', function() {
    var service = {};

    var graphConfiguration = null;

    var selectedElements = {
        entities: [],
        edges: []
    }

    var searchTerm = null;

    /**
     * Gets the graph configuration
     */
    service.getGraphConfiguration = function() {
        return angular.copy(graphConfiguration);
    }

    /**
     * Sets the graph configuration
     * @param {Object} graphConfig 
     */
    service.setGraphConfiguration = function(graphConfig) {
        graphConfiguration = angular.copy(graphConfig);
    }

    /**
     * Gets the selected elements
     */
    service.getSelectedElements = function() {
        return angular.copy(selectedElements);
    }

    /**
     * Sets the selected elements
     * @param {Object} newSelectedElements 
     */
    service.setSelectedElements = function(newSelectedElements) {
        selectedElements = angular.copy(newSelectedElements);
    }

    /**
     * Gets the search term
     */
    service.getSearchTerm = function() {
        return angular.copy(searchTerm);
    }

    /**
     * Sets the search term
     * @param {string} search 
     */
    service.setSearchTerm = function(search) {
        searchTerm = angular.copy(search);
    }

    /**
     * Resets the value of the selected elements
     */
    service.deselectAll = function() {
        selectedElements = {
            entities: [],
            edges: []
        }
    }

    return service;
});
