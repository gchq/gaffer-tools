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
    vm.data = {};
    vm.selectedTab = 0;
    vm.searchTerm = '';
    vm.schema = {edges:{}, entities:{}, types:{}};

    table.setResults(results.get());

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

    schema.get().then(function(gafferSchema) {
        vm.schema = gafferSchema;
        table.processResults(vm.schema);
        vm.data = table.getData();
    });

    events.subscribe('resultsUpdated', function(res) {
        table.setResults(res);
        table.processResults(vm.schema);
        vm.data = table.getData();
    });
}
