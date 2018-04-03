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
    var cachedValues = {};

    table.getData = function() {
        return tableData;
    }

    table.setResults = function(newResults) {
        results = newResults;
    }

    table.setCachedValues = function(newCachedValues) {
        cachedValues = newCachedValues;
    }

    table.getCachedValues = function() {
        return cachedValues;
    }

    table.processResults = function(schema) {
        var ids = [];
        var groupByProperties = [];
        var properties = [];
        tableData.resultsByType = {};

        processElements("Edge", "edges", ["type", "group", "source", "destination", "directed"], schema, ids, groupByProperties, properties);
        processElements("Entity", "entities", ["type", "group", "vertex"], schema, ids, groupByProperties, properties);
        processOtherTypes(ids, properties);

        tableData.allColumns = dedupConcat(dedupConcat(ids, groupByProperties), properties);
        tableData.columns = angular.copy(tableData.allColumns).splice(0, 8);

        tableData.allTypes = [];
        tableData.allGroups = [];
        for(var type in tableData.resultsByType) {
            tableData.allTypes.push(type);
            for(var group in tableData.resultsByType[type]) {
                dedupPush(group, tableData.allGroups);
            }
        }
        tableData.types = angular.copy(tableData.allTypes);
        tableData.groups = angular.copy(tableData.allGroups);

        table.updateResultTypes();
    }

    table.updateResultTypes = function() {
        tableData.results = [];
        for(var t in tableData.types) {
            if(tableData.types[t] in tableData.resultsByType) {
                for(var g in tableData.groups) {
                    if(tableData.groups[g] in tableData.resultsByType[tableData.types[t]]) {
                        tableData.results = tableData.results.concat(tableData.resultsByType[tableData.types[t]][tableData.groups[g]]);
                    }
                }
            }
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

    var processElements = function(type, typePlural, idKeys, schema, ids, groupByProperties, properties) {
        if(results[typePlural] && Object.keys(results[typePlural]).length > 0) {
            tableData.resultsByType[type] = [];
            dedupPushAll(idKeys, ids);
            for(var i in results[typePlural]) {
                var element = results[typePlural][i];
                if(element) {
                    var result = {};
                    for(var idIndex in idKeys) {
                        var id = idKeys[idIndex];
                        if("vertex" === id) {
                            result["source"] = element[id];
                        } else {
                            result[id] = element[id];
                        }
                    }
                    result.type = type;

                    if(element.properties) {
                        if(!(element.group in tableData.resultsByType[type])) {
                            tableData.resultsByType[type][element.group] = [];
                            if(schema.entities[element.group] && schema.entities[element.group].groupBy) {
                                dedupPushAll(schema.entities[element.group].groupBy, groupByProperties);
                            }
                            if(schema[typePlural][element.group] && schema[typePlural][element.group].properties) {
                                 dedupPushAll(Object.keys(schema[typePlural][element.group].properties), properties);
                            }
                        }
                        for(var prop in element.properties) {
                            dedupPush(prop, properties);
                            result[prop] = convertValue(prop, element.properties[prop]);
                        }
                    }
                    if(!(element.group in tableData.resultsByType[type])) {
                        tableData.resultsByType[type][element.group] = [];
                    }
                    tableData.resultsByType[type][element.group].push(result);
                }
            }
        }
    }

    var processOtherTypes = function(ids, properties) {
        for (var i in results.other) {
            var item = results.other[i];
            if(item) {
                var result = {
                    group: ''
                };
                for(var key in item) {
                    var value = convertValue(key, item[key]);
                    if("class" === key) {
                        result["type"] = item[key].split(".").pop();
                        dedupPush("type", ids);
                    } else if("vertex" === key) {
                        result["source"] = value;
                        dedupPush("source", ids);
                    } else if("source" === key) {
                        result["source"] = value;
                        dedupPush("source", ids);
                    } else if("value" === key) {
                        result[key] = value;
                        dedupPush(key, ids);
                    } else {
                        result[key] = value;
                        dedupPush(key, properties);
                    }
                }
                if(!(result.type in tableData.resultsByType)) {
                    tableData.resultsByType[result.type] = {};
                }
                if(!(result.group in tableData.resultsByType[result.type])) {
                    tableData.resultsByType[result.type][result.group] = [];
                }
                tableData.resultsByType[result.type][result.group].push(result);
            }
        }
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
