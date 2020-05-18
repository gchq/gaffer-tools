/*
 * Copyright 2018-2019 Crown Copyright
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

angular.module('app').component('myQuery', myQuery())

function myQuery() {
    return {
        templateUrl: 'app/previous-queries/my-query/my-query.html',
        controller: MyQueryController,
        controllerAs: 'ctrl',
        bindings: {
            model: '=',
            chain: '='
        },
        require: {
            parent: '?^^myQueries'
        }
    }
}

function MyQueryController(operationChain, navigation, previousQueries, $mdSidenav) {
    var vm = this;

    /**
     * Loads the operation into the operation chain builder
     */
    vm.load = function() {
        operationChain.setOperationChain(vm.model.operations);
        navigation.goToQuery();
    }
     /**
     * Open edit sidenav for my queries 
     */
    vm.openSideNav = function (operationIndex, operation) {
        if(!$mdSidenav('right').isOpen()) {
            $mdSidenav('right').toggle();
            previousQueries.setCurrentChain(vm.chain, operationIndex);
        }
        vm.parent.getUpdatedOperations(operation);
    } 
}
