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

'use strict';

angular.module('app').component('operation', operation());

function operation() {
    return {
        templateUrl: 'app/query/operation.html',
        controller: OperationController,
        controllerAs: 'ctrl',
        bindings: {
            model: '=',                 // an operation model
            timeConfig: '<',            // a time config common to each operation
            first: '<',                 // a flag stating whether this operation is first in a chain
            onExecute: '&'              // a function to execute when running the query
        }
    }
}

function OperationController(types, events, query, loading, operationService, settings, error, $mdDialog, navigation, results, $location, $routeParams, graph) {
    var vm = this;
    vm.showOperationOptionsForm;

    vm.$onInit = function() {
        settings.getOpOptionKeys().then(function(keys) {
            vm.showOperationOptionsForm = (keys && Object.keys(keys).length > 0);
        });

        if (!vm.model) {
            throw 'Operation has been created without a model to bind to'
        }
        
    }
    
    /**
     * Checks all subforms are valid and another operation is not in progress
     */
    vm.canExecute = function() {
        return vm.operationForm.$valid && !loading.isLoading();
    }

    vm.resetQuery = function() {
        // input.reset();
        // view.reset();
        // dateRange.resetDateRange();
        // edgeDirection.reset();
    }

    vm.execute = function() {
        vm.onExecute({op: vm.model});
    }
    
}