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

    table.update(results.get());
    vm.data = table.getData();
    vm.selectedTab = 0;
    vm.searchTerm = '';
    vm.schema = {};

    schema.get().then(function(gafferSchema) {
        vm.schema = gafferSchema;
    });

    events.subscribe('resultsUpdated', function(res) {
        table.update(res);
        vm.data = table.getData();
    });

}
