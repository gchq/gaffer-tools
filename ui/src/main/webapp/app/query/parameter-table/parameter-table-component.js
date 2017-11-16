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

angular.module('app').component('parameterTable', parameterTable());

function parameterTable() {
    return {
        templateUrl: 'app/query/parameter-table/parameter-table.html',
        controller: ParameterTableController,
        controllerAs: 'ctrl'
    }
}

function ParameterTableController(queryPage, types) {
    var vm = this;

    vm.getSelectedOp = queryPage.getSelectedOperation;


    vm.getFields = types.getFields;
}