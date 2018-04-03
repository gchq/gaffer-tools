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

function TableController(schema, results, table, events) {
    var vm = this;
    vm.searchTerm = undefined;
    vm.data = {};
    vm.searchTerm = '';
    vm.sortType = undefined;
    vm.schema = {edges:{}, entities:{}, types:{}};

    vm.$onInit = function() {
        table.setResults(results.get());
        events.subscribe('resultsUpdated', onResultsUpdated);
        schema.get().then(function(gafferSchema) {
            vm.schema = gafferSchema;
            table.processResults(vm.schema);
            vm.data = table.getData();
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
        table.updateResultTypes();
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
        table.setResults(res);
        table.processResults(vm.schema);
        vm.data = table.getData();
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
