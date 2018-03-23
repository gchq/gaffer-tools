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

'use strict'

angular.module('app').factory('table', ['common', 'types', 'time', 'events', function(common, types, time, events) {
    var table = {};
    var tableData = {results:[], columns:[]};
    var results = {};

    table.getData = function() {
        return tableData;
    }

    table.setResults = function(newResults) {
        results = newResults;
    }

    table.processResults = function(schema) {
        tableData.ids = [];
        tableData.groupByProperties = [];
        tableData.properties = [];
        tableData.resultsByGroup = {};
        if(results.edges && Object.keys(results.edges).length > 0) {
            tableData.ids.push("group");
            tableData.ids.push("source");
            tableData.ids.push("destination");
            tableData.ids.push("directed");
            for(var i in results.edges) {
                var edge = results.edges[i];
                if(edge) {
                    var result = {
                        group: edge.group,
                        source: convertValue("source", edge.source),
                        destination: convertValue("destination", edge.destination),
                        directed: convertValue("directed", edge.directed)
                    };
                    if(edge.properties) {
                        if(!(edge.group in tableData.resultsByGroup)) {
                            tableData.resultsByGroup[edge.group] = [];
                            if(schema.entities[edge.group] && schema.entities[edge.group].groupBy) {
                                dedupPushAll(schema.entities[edge.group].groupBy, tableData.groupByProperties);
                            }
                            if(schema.edges[edge.group] && schema.edges[edge.group].properties) {
                                 dedupPushAll(Object.keys(schema.edges[edge.group].properties), tableData.properties);
                            }
                        }
                        for(var prop in edge.properties) {
                            dedupPush(prop, tableData.properties);
                            result[prop] = convertValue(prop, edge.properties[prop]);
                        }
                    }
                    if(!(edge.group in tableData.resultsByGroup)) {
                        tableData.resultsByGroup[edge.group] = [];
                    }
                    tableData.resultsByGroup[edge.group].push(result);
                }
            }
        }
        if(results.entities && Object.keys(results.edges).length > 0) {
            dedupPush("group", tableData.ids);
            dedupPush("source", tableData.ids);
            for(var i in results.entities) {
                var entity = results.entities[i];
                if(entity) {
                    if(!(entity.group in tableData.resultsByGroup)) {
                        tableData.resultsByGroup[entity.group] = [];
                        if(schema.entities[entity.group] && schema.entities[entity.group].groupBy) {
                            dedupPushAll(schema.entities[entity.group].groupBy, tableData.groupByProperties);
                        }
                        if(schema.entities[entity.group] && schema.entities[entity.group].properties) {
                             dedupPushAll(Object.keys(schema.entities[entity.group].properties), tableData.properties);
                        }
                    }
                    var result = {
                        group: entity.group,
                        source: convertValue("vertex", entity.vertex)
                    };
                    if(entity.properties) {
                        for(var prop in entity.properties) {
                            dedupPush(prop, tableData.properties);
                            result[prop] = convertValue(prop, entity.properties[prop]);
                        }
                    }
                    tableData.resultsByGroup[entity.group].push(result);
                }
            }
        }

        for (var i in results.other) {
            var item = results.other[i];
            if(item) {
                var result = {};
                for(var key in item) {
                    if("class" === key) {
                        result["group"] = item[key].split(".").pop();
                        dedupPush("group", tableData.ids);
                    } else if("vertex" === key) {
                        result["source"] = convertValue("vertex", item[key]);
                        dedupPush("source", tableData.ids);
                    } else if("value" === key) {
                        result[key] = convertValue(key, item[key]);
                        dedupPush(key, tableData.ids);
                    } else {
                        result[key] = convertValue(key, item[key]);
                        dedupPush(key, tableData.properties);
                    }
                }
                if(!(result.group in tableData.resultsByGroup)) {
                    tableData.resultsByGroup[result.group] = [];
                }
                tableData.resultsByGroup[result.group].push(result);
            }
        }

        tableData.allColumns = dedupConcat(dedupConcat(tableData.ids, tableData.groupByProperties), tableData.properties);
        tableData.columns = angular.copy(tableData.allColumns).splice(0, 8);

        tableData.allGroups = [];
        for(var group in tableData.resultsByGroup) {
            tableData.allGroups.push(group);
        }
        tableData.groups = angular.copy(tableData.allGroups);
    }

    table.updateResultGroups = function() {
        tableData.results = [];
        for(var i in tableData.groups) {
            tableData.results = tableData.results.concat(tableData.resultsByGroup[tableData.groups[i]]);
        }

        var resultColumns = []
        for(var i in tableData.results) {
            dedupPushAll(Object.keys(tableData.results[i]), resultColumns);
        }

        var newColumns = [];
        for(var i in tableData.columns) {
            if(resultColumns.indexOf(tableData.columns[i]) > -1) {
                newColumns.push(tableData.columns[i]);
            }
        }
        tableData.columns = newColumns.splice(0, 8);
    }

    var convertValue = function(name, value) {
        var parsedValue = value;
        if(parsedValue) {
            try {
                parsedValue = JSON.parse(value);
            } catch(e) {
                parsedValue = value;
            }
            parsedValue = parseValue(name, parsedValue);
        }
        return parsedValue;
    }

    var parseValue = function(name, value) {
        var shortValue = types.getShortValue(value);
        if(time.isTimeProperty(name)) {
            shortValue = time.getDateString(name, shortValue);
        }
        return shortValue;
    }

    var dedupPush = function(item, list) {
        if(list && list.indexOf(item) === -1) {
            list.push(item);
        }
    }

    var dedupPushAll = function(items, list) {
        if(list && items) {
            for(var i in items) {
                dedupPush(items[i], list);
            }
        }
    }

    var dedupConcat = function(list1, list2) {
        if(!list1) {
            return angular.copy(list2);
        }

        if(!list2) {
            return angular.copy(list1);
        }

        var concatList = angular.copy(list1);
        for(var i in list2) {
            dedupPush(list2[i], concatList);
        }
        return concatList
    }

    return table;
}]);
