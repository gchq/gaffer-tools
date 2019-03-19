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

angular.module('app').component('analytics', analytics())

function analytics() {
    return {
        templateUrl: 'app/analytics/analytics.html',
        controller: AnalyticsController,
        controllerAs: 'ctrl',
        bindings: {
            model: '=',
        }
    }   
}

function AnalyticsController(operationService) {

    var vm = this;
    //vm.analytics = ["Get Adjacent Ids","Get All Elements","frequent-vehicles-in-region"];
    vm.availableOperations;

    vm.$onInit = function() {
        //vm.analytics = analytics.getAnalytics();
        vm.reloadOperations();
    }

    var populateOperations = function(availableOperations) {
        vm.availableOperations = [];

        for(var i in availableOperations) {
            var operation = availableOperations[i];

            if(!vm.previous || !vm.previous.selectedOperation || !vm.previous.selectedOperation.next || vm.previous.selectedOperation.next.indexOf(operation.class) > -1) {
                operation.formattedName = operation.name !== undefined ? operation.name.toLowerCase().replace(/\s+/g, '') : '';
                operation.formattedDescription = operation.description !== undefined ? operation.description.toLowerCase().replace(/\s+/g, '') : '';

                if(operation.formattedName === "getelements") {
                    vm.placeholder = "Search for an operation (e.g Get Elements)";
                }
                vm.availableOperations.push(operation);
            }
        }

        vm.availableOperations.sort(function(a,b) {
            if(a.namedOp && !b.namedOp) {
                return -1;
            }
            if(!a.namedOp && b.namedOp) {
                return 1;
            }
            if(a.formattedName > b.formattedName) {
                return 1;
            }
            if(a.formattedName < b.formattedName) {
                return -1;
            }
            if(a.formattedDescription > b.formattedDescription) {
                return 1;
            }
            if(a.formattedDescription < b.formattedDescription) {
                return -1;
            }
            return 0
        });

        vm.analytics = vm.availableOperations;
    }

    vm.getOperations = function() {
        return operationService.getAvailableOperations(true).then(function(ops) {
            populateOperations(ops)
            return vm.availableOperations;
        });
    }

    vm.reloadOperations = function() {
        operationService.reloadOperations(true).then(populateOperations);
    }

}
