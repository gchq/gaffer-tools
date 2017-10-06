/*
 * Copyright 2016 Crown Copyright
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

angular.module('app').component('resultsTable', resultsTable())

function resultsTable() {
    return {
        templateUrl: 'app/table/table.html',
        controller: TableController,
        controllerAs: 'ctrl'
    }
}

function TableController($scope, results, schema, table) {
    var vm = this

    table.update(results.results)

    vm.data = table.data
    vm.selectedTab = 0
    vm.searchTerm = ''
    vm.schema = schema.getSchema()

    results.observeResults().then(null, null, function(results) {
        table.update(results)
        vm.data = table.data
    })

    schema.observeSchema().then(null, null, function(schema) {
        vm.schema = schema
    })
}