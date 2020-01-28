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

'use strict'

angular.module('app').component('resultsTable', resultsTable());

function resultsTable() {
    return {
        templateUrl: 'app/table/table.html',
        controller: TableController,
        controllerAs: 'ctrl'
    };
}

/**
 * The controller for the table page.
 * @param {*} schema For looking up information about the different groups and types.
 * @param {*} results For retrieving the results
 * @param {*} table For caching user table view preferences
 * @param {*} events For subscribing to resultsUpdated events
 * @param {*} common For common methods
 * @param {*} types For converting objects based on their types
 * @param {*} time For converting time objects
 * @param {*} csv For downloading results
 * @param {*} $mdDialog For creating chart visualisations
 */
function TableController(schema, results, table, events, common, types, time, csv, $mdDialog, config) {
    var vm = this;
    var truncation = {
        maxLength: 500,
        text: "..."
    };
    var resultsByType = [];
    vm.filteredResults = [];
    vm.data = {results:[], columns:[]};
    vm.searchTerm = '';

    vm.pagination = {limit: 50, page: 1};
    vm.sortType = undefined;
    vm.schema = {edges:{}, entities:{}, types:{}};

    vm.groupColumnName = 'GROUP';
    vm.typeColumnName = 'result type';

    /**
     * Initialises the controller.
     * Fetches the schema. Fetches the results and processes them.
     * Loads any cached table preferences and subscribes to resultsUpdated events.
     */
    vm.$onInit = function() {
        schema.get().then(function(gafferSchema) {
            vm.schema = gafferSchema;
            loadFromCache();
            processResults(results.get());
        }, function(err) {
            vm.schema = {types: {}, edges: {}, entities: {}};
            loadFromCache();
            processResults(results.get());
        });

        config.get().then(function(conf) {
            if(conf && conf.table && conf.table.truncation && conf.table.truncation) {
                truncation = conf.table.truncation;
            }
        });

        events.subscribe('resultsUpdated', onResultsUpdated);
    }

    /**
     * Cleans up the controller. Unsubscribes from resultsUpdated events and
     * caches table preferences.
     */
    vm.$onDestroy = function() {
        events.unsubscribe('resultsUpdated', onResultsUpdated);
        cacheValues();
    }

    vm.createVisualisation = function(ev) {
        $mdDialog.show({
            controller: 'VisualisationDialogController',
            templateUrl: 'app/table/visualisation-dialog/visualisation-dialog.html',
            targetEvent: ev,
            clickOutsideToClose: true,
            parent: angular.element(document.body),
            locals: {
                columns: vm.data.columns,
                data: vm.filteredResults
            },
            bindToController: true,
        }).then(function(chart) {
            vm.chart = chart;
            vm.showVisualisation = true;
        }, function() {});
    }

    vm.hideVisualisation = function() {
        vm.showVisualisation = false;
    }

    vm.hideColumn = function(column) {
        var index = vm.data.columns.indexOf(column);
        if (index > -1) {
            vm.data.columns.splice(index, 1);
        }
    }

    vm.updateFilteredResults = function() {
        vm.data.results = [];
        for(var t in vm.data.types) {
            if(vm.data.types[t] in resultsByType) {
                for(var g in vm.data.groups) {
                    if(vm.data.groups[g] in resultsByType[vm.data.types[t]]) {
                        vm.data.results = vm.data.results.concat(resultsByType[vm.data.types[t]][vm.data.groups[g]]);
                    }
                }
            }
        }
    }

    /*
     * Text for the select columns component.
     * 'Choose columns' and conditionally shows 'X more' if there are hidden columns.
     */
    vm.selectedColumnsText = function() {
        if(vm.data.columns && vm.data.allColumns && vm.data.allColumns.length > vm.data.columns.length) {
            return "Choose columns (" + (vm.data.allColumns.length - vm.data.columns.length) + " hidden)";
    }
        return "Choose columns";
    }

    var onResultsUpdated = function(res) {
        // forcing a cache reload ensures columns are recalculated if they need to be
        cacheValues();
        loadFromCache();
        processResults(res);
    }

    var processResults = function(resultsData) {
        var ids = [];
        var groupByProperties = [];
        var properties = [];
        resultsByType = {};
        vm.data.tooltips = {};

        processElements("Edge", "edges", ["result type", "GROUP", "SOURCE", "DESTINATION", "DIRECTED"], ids, groupByProperties, properties, resultsData);
        processElements("Entity", "entities", ["result type", "GROUP", "SOURCE"], ids, groupByProperties, properties, resultsData);
        processOtherTypes(ids, properties, resultsData);

        vm.data.allColumns = common.concatUniqueValues(common.concatUniqueValues(ids, groupByProperties), properties);

        if (!vm.data.columns || vm.data.columns.length === 0) {
            vm.data.columns = angular.copy(vm.data.allColumns);
        }
        vm.data.allTypes = [];
        vm.data.allGroups = [];
        for(var type in resultsByType) {
            vm.data.allTypes.push(type);
            for(var group in resultsByType[type]) {
                common.pushValueIfUnique(group, vm.data.allGroups);
            }
        }

        if (!vm.data.types || vm.data.types.length === 0) {
            vm.data.types = angular.copy(vm.data.allTypes);
        }
        if (!vm.data.groups || vm.data.groups.length === 0) {
            vm.data.groups = angular.copy(vm.data.allGroups);
        }

        vm.updateFilteredResults();
    }

    var processElements = function(type, typePlural, idKeys, ids, groupByProperties, properties, resultsData) {
        if(resultsData[typePlural] && Object.keys(resultsData[typePlural]).length > 0) {
            resultsByType[type] = [];
            common.pushValuesIfUnique(idKeys, ids);
            for(var i in resultsData[typePlural]) {
                var element = resultsData[typePlural][i];
                if(element) {
                    var result = {};
                    for(var idIndex in idKeys) {
                        var id = idKeys[idIndex];
                        if('SOURCE' === id && element.source === undefined) {
                            result[id] = convertValue(id, element.vertex);
                        } else {
                            result[id] = convertValue(id, element[id.toLowerCase()]);
                        }
                    }
                    result['result type'] = type;

                    if(element.properties) {
                        if(!(element.group in resultsByType[type])) {
                            resultsByType[type][element.group] = [];

                            var elementDef = vm.schema[typePlural][element.group];
                            if(elementDef && elementDef.properties) {
                                if(elementDef.groupBy) {
                                    for(var j in elementDef.groupBy) {
                                        var propName = elementDef.groupBy[j];
                                        var typeDef = vm.schema.types[elementDef.properties[propName]];
                                        if(typeDef && typeDef.description && !(propName in vm.data.tooltips)) {
                                            vm.data.tooltips[propName] = typeDef.description;
                                        }
                                        common.pushValueIfUnique(propName, groupByProperties);
                                     }
                                 }
                                 for(var propName in elementDef.properties) {
                                    var typeDef = vm.schema.types[elementDef.properties[propName]];
                                    if(typeDef && typeDef.description && !(propName in vm.data.tooltips)) {
                                        vm.data.tooltips[propName] = typeDef.description;
                                    }
                                    common.pushValueIfUnique(propName, properties);
                                 }
                            }
                        }
                        for(var prop in element.properties) {
                            common.pushValueIfUnique(prop, properties);
                            result[prop] = convertValue(prop, element.properties[prop]);
                        }
                    }
                    if(!(element.group in resultsByType[type])) {
                        resultsByType[type][element.group] = [];
                    }
                    resultsByType[type][element.group].push(result);
                }
            }
        }
    }

    var processOtherTypes = function(ids, properties, resultsData) {
        for (var i in resultsData.other) {
            var item = resultsData.other[i];
            if(item) {
                var result = {GROUP: ''};
                for(var key in item) {
                    var value = convertValue(key, item[key]);
                    if("class" === key) {
                        result["result type"] = item[key].split(".").pop();
                        common.pushValueIfUnique("result type", ids);
                    } else if("vertex" === key) {
                        result["SOURCE"] = value;
                        common.pushValueIfUnique("SOURCE", ids);
                    } else if("source" === key || 'destination' === key || 'directed' === key || 'group' === key) {
                        var parsedKey = key.toUpperCase();
                        result[parsedKey] = value;
                        common.pushValueIfUnique(parsedKey, ids);
                    } else if("value" === key) {
                        result[key] = value;
                        common.pushValueIfUnique(key, ids);
                    } else {
                        result[key] = value;
                        common.pushValueIfUnique(key, properties);
                    }
                }
                if(!(result['result type'] in resultsByType)) {
                    resultsByType[result['result type']] = {};
                }
                if(!(result.GROUP in resultsByType[result['result type']])) {
                    resultsByType[result['result type']][result.GROUP] = [];
                }
                resultsByType[result['result type']][result.GROUP].push(result);
            }
        }
    }

    var convertValue = function(name, value) {
        var parsedValue = value;
        if(parsedValue) {
            parsedValue = types.getShortValue(parsedValue);
            if(time.isTimeProperty(name)) {
                parsedValue = time.getDateString(name, parsedValue);
            }
        }
        return parsedValue;
    }

    vm.download = function() {
        var mimeType = 'data:text/csv;charset=utf-8';
        var data = csv.generate(vm.filteredResults, vm.data.columns);
        var fileName = 'gaffer_results_' + Date.now() + '.csv'
        downloadData(fileName, data, mimeType);
    }

    var downloadData = function(fileName, data, mimeType) {
        var downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(new Blob([data], {type: mimeType}));
        downloadLink.download = fileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(downloadLink.href);
    }

    vm.getValue = function() {
        if (!vm.sortType) {
            return "";
        }

        if (common.startsWith(vm.sortType, '-')) {
            return '-"' + vm.sortType.substring(1) + '"'
        }

        return '"' + vm.sortType + '"';
    }

    vm.shouldShowTruncation = function(value) {
        return truncation.maxLength > 0 && value && typeof value === 'string' && value.length > truncation.maxLength;
    }

    vm.getTruncatedValue = function(value) {
        if(vm.shouldShowTruncation(value)) {
            return value.substring(0, truncation.maxLength - truncation.text.length);
        }
        return value;
    }

    vm.getTruncationText = function() {
        return truncation.text;
    }

    vm.showValueDialog = function(name, value) {
        $mdDialog.show($mdDialog.confirm()
                .title('Full ' + name + ' value')
                .textContent(value)
                .ok('Ok'));
    }

    var loadFromCache = function() {
        var cachedValues = table.getCachedValues();
        vm.searchTerm = cachedValues.searchTerm;
        vm.sortType =  cachedValues.sortType;
        vm.chart = cachedValues.chart;
        vm.showVisualisation = cachedValues.showVisualisation;
        vm.data.columns = cachedValues.columns;
        vm.data.types = cachedValues.types;
        vm.data.groups = cachedValues.groups;

        if (cachedValues.pagination) {
            vm.pagination = cachedValues.pagination;
        }
    }

    var cacheValues = function() {
        var cachedValues = {
            searchTerm: vm.searchTerm,
            sortType: vm.sortType,
            pagination: vm.pagination,
            chart: vm.chart,
            showVisualisation: vm.showVisualisation
        };

        if(vm.data.columns && vm.data.allColumns && vm.data.columns.length < vm.data.allColumns.length) {
            cachedValues.columns = vm.data.columns;
        }

        if(vm.data.types && vm.data.allTypes && vm.data.types.length < vm.data.allTypes.length) {
            cachedValues.types = vm.data.types;
        }

        if(vm.data.groups && vm.data.allGroups && vm.data.groups.length < vm.data.allGroups.length) {
            cachedValues.groups = vm.data.groups;
        }

        table.setCachedValues(cachedValues);
    }
}
