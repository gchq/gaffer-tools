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

'use strict';

angular.module('app').factory('view', function() {
    var service = {}

    var viewEntities = [];
    var viewEdges = [];
    var entityFilters = {};
    var edgeFilters = {};

    service.getViewEntities = function() {
        return viewEntities;
    }

    service.getViewEdges = function() {
        return viewEdges;
    }

    service.getEntityFilters = function() {
        return entityFilters;
    }

    service.getEdgeFilters = function() {
        return edgeFilters;
    }

    service.setViewEntities = function(entities) {
        viewEntities = entities;
    }

    service.setViewEdges = function(edges) {
        viewEdges = edges;
    }

    service.setEntityFilters = function(filters) {
        entityFilters = filters;
    }

    service.setEdgeFilters = function(filters) {
        edgeFilters = filters;
    }

    service.reset = function() {
        viewEntities = [];
        viewEdges = [];
        entityFilters = {};
        edgeFilters = {};
    }

    return service;
});