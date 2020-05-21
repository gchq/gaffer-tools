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

angular.module('app').component('myQueries', myQueries())

function myQueries() {
    return {
        templateUrl: 'app/previous-queries/my-queries.html',
        controller: MyQueriesController,
        controllerAs: 'ctrl'
    }   
}

function MyQueriesController(previousQueries, navigation, operationChain, $mdSidenav, $mdDialog) {

    var vm = this;

    vm.queries = [];

    vm.updatedQuery = {
    	name: null,
    	description: null
    }

    var confirm = $mdDialog.confirm()
    .title('Are you sure you want to change the Name and Description?')
    .ok('Ok')
    .cancel('Cancel')

    var invalidName = $mdDialog.confirm()
    .title('Invalid Data!')
    .textContent('Please enter a valid Name and Description')
    .ok('Ok')
    .cancel('Cancel')
    
    /**
     * Sets the previously run queries on initialisation
     */
    vm.$onInit = function() {
        vm.queries = previousQueries.getQueries();
    }

    /**
     * Resets the operation chain builder and navigates to it
     */
    vm.createNew = function() {
        operationChain.reset();
        navigation.goToQuery();
    }

    vm.queriesList = function(){
        return vm.queries;
    }
    /**
     * Get updated operations for update vm edit sidenav
     */
    vm.getUpdatedOperations = function(operation) {
        vm.updatedQuery = {
            name: operation.selectedOperation.name,
            description: operation.selectedOperation.description
        }
    }
    /**
     * Change operations name and description
     */
    vm.saveUpdatedDetails = function() {

        var chainToUpdate = previousQueries.getCurrentChain();       
        previousQueries.updateQuery(chainToUpdate.chain, chainToUpdate.operationIndex, vm.updatedQuery);
        if (vm.updatedQuery.name != null && vm.updatedQuery.name != '') {
            $mdDialog.show(confirm).then(function() {
                //Update the local model to force the UI to update
                if (chainToUpdate.chain >= 0 && chainToUpdate.chain <= vm.queries.length) {
                    var query = vm.queries[chainToUpdate.chain];
                 
                    if (chainToUpdate.operationIndex >= 0 && chainToUpdate.operationIndex <= query.operations.length) {
                        var operationSelectedOperation = angular.extend({}, query.operations[chainToUpdate.operationIndex].selectedOperation);
                        operationSelectedOperation.name = vm.updatedQuery.name;
                        operationSelectedOperation.description = vm.updatedQuery.description;
                        query.operations[chainToUpdate.operationIndex] = angular.extend(query.operations[chainToUpdate.operationIndex], {selectedOperation: operationSelectedOperation});
                    }
                }
                
                $mdSidenav('right').toggle();
            });
        } else {
            // Name is mandatory
            $mdDialog.show(invalidName);
        }
    }

    vm.closeSideNav = function() {
        if($mdSidenav('right').isOpen()) {
            $mdSidenav('right').toggle();
        }
    }
}
