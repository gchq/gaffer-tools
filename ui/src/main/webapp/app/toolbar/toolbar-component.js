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

angular.module('app').component('toolbar', toolbar());

function toolbar() {
    return {
        templateUrl: 'app/toolbar/toolbar.html',
        controller: ToolbarController,
        controllerAs: 'ctrl'
    };
}

function ToolbarController($rootScope, $mdDialog, operationService, results, query, config, loading, events, properties, error) {
    var vm = this;
    vm.addMultipleSeeds = false;
    vm.appTitle;

    var defaultTitle = "Gaffer";
    vm.$onInit = function() {
        config.get().then(function(conf) {
            if (conf.title) {
                vm.appTitle = conf.title;
                return;
            }
            properties.get().then(function(props) {
                if (props) {
                    var configuredTitle = props["gaffer.properties.app.title"]
                    if (configuredTitle) {
                        vm.appTitle = configuredTitle;
                        return;
                    }
                }
                vm.appTitle = defaultTitle;
            },
            function(err) {
                vm.appTitle = defaultTitle;
            });
        });
    }

    var recursivelyExecuteOperations = function(opIndex, ops) {
        query.execute(
            {
                class: "uk.gov.gchq.gaffer.operation.OperationChain",
                operations: [
                    ops[opIndex],
                    operationService.createLimitOperation(ops[opIndex]['options']),
                    operationService.createDeduplicateOperation(ops[opIndex]['options'])
                ]
            },
            function(data) {
                results.update(data);
                if((opIndex + 1) < ops.length) {
                    recursivelyExecuteOperations(opIndex + 1, ops);
                } else {
                    loading.finish();
                }
            },
            function(err) {
                // Try without the limit and deduplicate operations
                query.execute(JSON.stringify({
                    class: "uk.gov.gchq.gaffer.operation.OperationChain",
                    operations: [ops[opIndex]]
                }), function(data) {
                    results.update(data);
                    if((opIndex + 1) < ops.length) {
                        recursivelyExecuteOperations(opIndex + 1, ops);
                    } else {
                        loading.finish();
                    }
                },  function(err) {
                    loading.finish();
                    error.handle('Error executing operation', err);
                });
            }
        );
    }

    vm.executeAll = function() {
        var ops = query.getOperations();
        if (ops.length > 0) {
            results.clear(false);
            loading.load();
            recursivelyExecuteOperations(0, ops);
        } else {
            results.clear(true);
        }
    }

    vm.clearResults = function() {
        results.clear();
    }
}
