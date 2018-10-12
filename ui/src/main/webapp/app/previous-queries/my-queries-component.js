/*
 * Copyright 2018 Crown Copyright
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

angular.module('app').component('myQueries', myQueries())

function myQueries() {
    return {
        templateUrl: 'app/previous-queries/my-queries.html',
        controller: MyQueriesController,
        controllerAs: 'ctrl'
    }   
}

function MyQueriesController(previousQueries, navigation, operationChain) {

    var vm = this;
    vm.queries = [];

    vm.$onInit = function() {
        vm.queries = previousQueries.getQueries();
    }

    vm.$onDestroy = function() {
        previousQueries.setQueries(vm.queries);
    }

    vm.createNew = function() {
        operationChain.reset();
        navigation.goToQuery();
    }
}