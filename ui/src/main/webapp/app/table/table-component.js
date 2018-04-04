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

angular.module('app').component('resultsTable', resultsTable());

function resultsTable() {
    return {
        templateUrl: 'app/table/table.html',
        controller: TableController,
        controllerAs: 'ctrl'
    };
}

function TableController(schema, results, table, events, common, types, time) {
    var initialNumberOfColumnsToShow = 8;
    var vm = this;
    vm.searchTerm = undefined;
    vm.data = {results:[], columns:[]};
    vm.searchTerm = '';
    vm.sortType = undefined;
    vm.schema = {edges:{}, entities:{}, types:{}};

    vm.$onInit = function() {
        events.subscribe('resultsUpdated', onResultsUpdated);
        schema.get().then(function(gafferSchema) {
            vm.schema = gafferSchema;
            processResults(results.get());
            loadFromCache();
        });
    }

    vm.$onDestroy = function() {
        events.unsubscribe('resultsUpdated', onResultsUpdated);
        cacheValues();
    }

    vm.hideColumn = function(column) {
        var index = vm.data.columns.indexOf(column);
        if (index > -1) {
            vm.data.columns.splice(index, 1);
        }
    }

    vm.updateSelectedTypes = function() {
        updateResultTypes();
    }

    vm.selectedTypesText = function() {
        return "type";
    }

    vm.selectedGroupsText = function() {
        return "group";
    }

    vm.selectedColumnsText = function() {
        if(vm.data.columns && vm.data.allColumns.length > vm.data.columns.length) {
            return "Choose columns (" + (vm.data.allColumns.length - vm.data.columns.length) + " more)";
    }
        return "Choose columns";
    }

    var onResultsUpdated = function(res) {
        table.setCachedValues({});
        processResults(res);
    }

    var processResults = function(resultsData) {
        var ids = [];
        var groupByProperties = [];
        var properties = [];
        vm.data.resultsByType = {};
        vm.data.tooltips = {};

        processElements("Edge", "edges", ["type", "group", "source", "destination", "directed"], ids, groupByProperties, properties, resultsData);
        processElements("Entity", "entities", ["type", "group", "vertex"], ids, groupByProperties, properties, resultsData);
        processOtherTypes(ids, properties, resultsData);

        vm.data.allColumns = common.dedupConcatValues(common.dedupConcatValues(ids, groupByProperties), properties);
        vm.data.columns = angular.copy(vm.data.allColumns).splice(0, initialNumberOfColumnsToShow);

        vm.data.allTypes = [];
        vm.data.allGroups = [];
        for(var type in vm.data.resultsByType) {
            vm.data.allTypes.push(type);
            for(var group in vm.data.resultsByType[type]) {
                common.dedupPushValue(group, vm.data.allGroups);
            }
        }
        vm.data.types = angular.copy(vm.data.allTypes);
        vm.data.groups = angular.copy(vm.data.allGroups);

        updateResultTypes();
    }

    var updateResultTypes = function() {
        vm.data.results = [];
        for(var t in vm.data.types) {
            if(vm.data.types[t] in vm.data.resultsByType) {
                for(var g in vm.data.groups) {
                    if(vm.data.groups[g] in vm.data.resultsByType[vm.data.types[t]]) {
                        vm.data.results = vm.data.results.concat(vm.data.resultsByType[vm.data.types[t]][vm.data.groups[g]]);
                    }
                }
            }
        }
        updateColumns();
    }

    var updateColumns = function() {
        var resultColumns = []
        for(var i in vm.data.results) {
            common.dedupPushAllValues(Object.keys(vm.data.results[i]), resultColumns);
        }
        var newColumns = [];
        for(var i in vm.data.columns) {
            if(resultColumns.indexOf(vm.data.columns[i]) > -1) {
                newColumns.push(vm.data.columns[i]);
            }
        }
        vm.data.columns = newColumns.splice(0, initialNumberOfColumnsToShow);
    }

    var processElements = function(type, typePlural, idKeys, ids, groupByProperties, properties, resultsData) {
        if(resultsData[typePlural] && Object.keys(resultsData[typePlural]).length > 0) {
            vm.data.resultsByType[type] = [];
            common.dedupPushAllValues(idKeys, ids);
            for(var i in resultsData[typePlural]) {
                var element = resultsData[typePlural][i];
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
                        if(!(element.group in vm.data.resultsByType[type])) {
                            vm.data.resultsByType[type][element.group] = [];

                            var elementDef = vm.schema[typePlural][element.group];
                            if(elementDef && elementDef.properties) {
                                if(elementDef.groupBy) {
                                    for(var j in elementDef.groupBy) {
                                        var propName = elementDef.groupBy[j];
                                        var typeDef = vm.schema.types[elementDef.properties[propName]];
                                        if(typeDef && typeDef.description && !(propName in vm.data.tooltips)) {
                                            vm.data.tooltips[propName] = typeDef.description;
                                        }
                                        common.dedupPushValue(propName, groupByProperties);
                                     }
                                 }
                                 for(var propName in elementDef.properties) {
                                    var typeDef = vm.schema.types[elementDef.properties[propName]];
                                    if(typeDef && typeDef.description && !(propName in vm.data.tooltips)) {
                                        vm.data.tooltips[propName] = typeDef.description;
                                    }
                                    common.dedupPushValue(propName, properties);
                                 }
                            }
                        }
                        for(var prop in element.properties) {
                            common.dedupPushValue(prop, properties);
                            result[prop] = convertValue(prop, element.properties[prop]);
                        }
                    }
                    if(!(element.group in vm.data.resultsByType[type])) {
                        vm.data.resultsByType[type][element.group] = [];
                    }
                    vm.data.resultsByType[type][element.group].push(result);
                }
            }
        }
    }

    var processOtherTypes = function(ids, properties, resultsData) {
        for (var i in resultsData.other) {
            var item = resultsData.other[i];
            if(item) {
                var result = {
                    group: ''
                };
                for(var key in item) {
                    var value = convertValue(key, item[key]);
                    if("class" === key) {
                        result["type"] = item[key].split(".").pop();
                        common.dedupPushValue("type", ids);
                    } else if("vertex" === key) {
                        result["source"] = value;
                        common.dedupPushValue("source", ids);
                    } else if("source" === key) {
                        result["source"] = value;
                        common.dedupPushValue("source", ids);
                    } else if("value" === key) {
                        result[key] = value;
                        common.dedupPushValue(key, ids);
                    } else {
                        result[key] = value;
                        common.dedupPushValue(key, properties);
                    }
                }
                if(!(result.type in vm.data.resultsByType)) {
                    vm.data.resultsByType[result.type] = {};
                }
                if(!(result.group in vm.data.resultsByType[result.type])) {
                    vm.data.resultsByType[result.type][result.group] = [];
                }
                vm.data.resultsByType[result.type][result.group].push(result);
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
            parsedValue = types.getShortValue(parsedValue);
            if(time.isTimeProperty(name)) {
                parsedValue = time.getDateString(name, parsedValue);
            }
        }
        return parsedValue;
    }

    var loadFromCache = function() {
        var cachedValues = table.getCachedValues();
        vm.searchTerm = cachedValues.searchTerm;
        vm.sortType =  cachedValues.sortType;
        if(cachedValues.columns && cachedValues.columns.length > 0) {
            vm.data.columns = cachedValues.columns;
        }
        if(cachedValues.types && cachedValues.types.length > 0) {
            vm.data.types = cachedValues.types;
        }
        if(cachedValues.groups && cachedValues.groups.length > 0) {
            vm.data.groups = cachedValues.groups;
        }
    }

    var cacheValues = function() {
        var cachedValues = {
            searchTerm: vm.searchTerm,
            sortType: vm.sortType
        };

        if(vm.data.columns && vm.data.allColumns && vm.data.columns.length < vm.data.allColumns.length) {
            cachedValues.columns = vm.data.columns;
        }

        if(vm.data.types && vm.data.allTypes && vm.data.types < vm.data.allTypes.length) {
            cachedValues.types = vm.data.types;
        }

        if(vm.data.groups && vm.data.allGroups && vm.data.groups < vm.data.allGroups.length) {
            cachedValues.groups = vm.data.groups;
        }

        table.setCachedValues(cachedValues);
    }
}
