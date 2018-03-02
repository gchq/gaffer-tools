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

angular.module('app').factory('table', ['common', 'events', 'types', 'time', function(common, events, types, time) {
    var table = {};
    var tableData = {entities: {}, edges: {}, entitySeeds: [], other: []};

    table.getData = function() {
        return tableData;
    }

    var parseEntity = function(entity) {
        var summarised = {};

        summarised.vertex = types.getShortValue(entity.vertex);
        summarised.group = entity.group;
        summarised.properties = parseElementProperties(entity.properties);

        return summarised;
    }

    var parseElementProperties = function(properties) {
        var summarisedProperties = {};

        var props = Object.keys(properties);
        for (var i in props) {
            var propName = props[i];
            var shortValue = types.getShortValue(properties[propName]);
            if(time.isTimeProperty(propName)) {
                shortValue = time.getDateString(propName, shortValue);
            }
            summarisedProperties[propName] = shortValue;
        }

        return summarisedProperties;
    }

    var parseEdge = function(edge) {
        var summarised = {};
        summarised.source = types.getShortValue(edge.source);
        summarised.destination = types.getShortValue(edge.destination);
        summarised.group = edge.group;
        summarised.directed = edge.directed;
        summarised.properties = parseElementProperties(edge.properties);

        return summarised;

    }

    table.update = function(results) {
        tableData = { entities: {}, edges: {}, entitySeeds: [], other: [] };
        for (var i in results.entities) {
            var entity = results.entities[i];
            if(!tableData.entities[entity.group]) {
                tableData.entities[entity.group] = [];
            }
            if (tableData.entities[entity.group].indexOf(angular.toJson(entity)) === -1) {
                tableData.entities[entity.group].push(angular.toJson(entity));
            }
        }

        for (var i in results.edges) {
            var edge = results.edges[i];
            if(!tableData.edges[edge.group]) {
                tableData.edges[edge.group] = [];
            }
            if (tableData.edges[edge.group].indexOf(angular.toJson(edge)) == -1) {
                tableData.edges[edge.group].push(angular.toJson(edge));
            }
        }

        for (var i in results.entitySeeds) {
            var es = common.parseVertex(results.entitySeeds[i]);
            if (tableData.entitySeeds.indexOf(es) == -1) {
                tableData.entitySeeds.push(es);
            }
        }

        for (var i in results.other) {
            if (tableData.other.indexOf(results.other[i]) === -1) {
                tableData.other.push(results.other[i]);
            }
        }

        convertElements();
    }

    var convertElements = function() {
        for (var i in tableData.entities) {
            for (var a in tableData.entities[i]) {
                tableData.entities[i][a] = parseEntity(JSON.parse(tableData.entities[i][a]));
            }
        }
        for (var i in tableData.edges) {
            for (var a in tableData.edges[i]) {
                tableData.edges[i][a] = parseEdge(JSON.parse(tableData.edges[i][a]));
            }
        }

    }

    return table;
}]);