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

angular.module('app').component('options', options());

function options() {
    return {
        templateUrl: 'app/options/options.html',
        controller: OptionsController,
        controllerAs: 'ctrl',
        bindings: {
            master: '<?',
            model: '=?'
        }
    }
}

function OptionsController(operationOptions, config, events, $q, query, error) {
    var vm = this;

    /**
     * A key value map containing operation option keys and searchterms used in the event that an admin want's to use
     * the autocomplete functionality.
     */
    vm.searchTerms = {};

    /**
     * A key value map containing operation option keys and associated preset options. Used by the md-select
     * component when using remote options.
     */
    vm.presets = {};

    /**
     * Initialisation method. Subscribes to the "onPreExecute" event so that the master can update operation options before
     * an operation is executed. Then if no model is defined, it retrieves the default from the operationOptions service.
     * If not yet defined, it looks to the UI config to determine the defaults.
     */
    vm.$onInit = function() {
        events.subscribe('onPreExecute', saveToService);
        if (!vm.model) {    // If the model is not yet defined, it must get the default from somewhere.
            var currentDefaults = operationOptions.getDefaultConfiguration();
            if (currentDefaults !== null) { // null implies not set.
                vm.model = currentDefaults;
                return;
            }
            // If the defaults are not yet set by the user, the component looks to the config to get the default operation options 
            config.get().then(function(conf) {
                vm.model = angular.copy(conf.operationOptions);
                if (vm.model) {
                    if (vm.model.visible === undefined) {
                        vm.model.visible = [];
                    } 
                    if (vm.model.hidden === undefined) {
                        vm.model.hidden = [];
                    }

                    for (var visibleOrHidden in vm.model) {
                        for (var i in vm.model[visibleOrHidden]) {
                            var option = vm.model[visibleOrHidden][i];
                            if (option.value) {
                                if (option.multiple && !Array.isArray(option.value)) {
                                    option.value = [ option.value ]
                                }
                                vm.presets[option.key] = option.value;
                            } else if (option.multiple) {
                                option.value = [];
                            }
                        }
                    }
                } else if (conf.operationOptionKeys) {
                    console.warn('UI "operationOptionKeys" config is deprecated. See the docs for the new options configuration.');

                    vm.model = {
                        visible: [],
                        hidden: []
                    };

                    for (var label in conf.operationOptionKeys) {
                        var option = {
                            'key': conf.operationOptionKeys[label],
                            'label': label
                        };

                        vm.model.visible.push(option);
                    }
                }
            });
        }
    }

    /**
     * Unsubscribes from the event service to avoid too many event subscriptions.
     */
    vm.$onDestroy = function() {
        events.unsubscribe('onPreExecute', saveToService);
        saveToService()
    }

    var saveToService = function() {
        if (vm.master) {        // If master is being destroyed, for example when the user navigates away, the service is updated
            operationOptions.setDefaultConfiguration(vm.model);
        }
    }

    /**
     * Sets the value of an operation option to undefined if it is a string or empty array if already an array.
     * @param {Number} index The index of the option in the visible array
     */
    vm.clearValue = function(index) {
        var currentValue = vm.model.visible[index].value
        vm.model.visible[index].value = Array.isArray(currentValue) ? [] : undefined;
    }

    /**
     * Moves the operation option to the hidden array.
     * @param {Number} index The index of the option in the visible array
     */
    vm.hideOption = function(index) {
        var optionCopy = angular.copy(vm.model.visible[index]);
        vm.model.hidden.push(optionCopy);
        vm.model.visible.splice(index, 1);
    }

    /**
     * Moves the selected operation (created by the md-autocomplete component) from the hidden array to the visible array.
     */
    vm.addOption = function() {
        if (vm.selectedOption === undefined || vm.selectedOption === null) {
            return;
        }
        if (!vm.model.visible) {
            vm.model.visible = [];
        }

        vm.model.visible.push(angular.copy(vm.selectedOption));

        vm.model.hidden = vm.model.hidden.filter(function(hiddenOption) {
            if (hiddenOption.key !== vm.selectedOption.key) {
                return hiddenOption;
            }
        });

        vm.selectedOption = undefined;
        vm.search = "";
    }

    /**
     * Gets the available operation options. Used when operation options have preset values. It returns either a
     * promise of an array or an actual array (if they are static values set in the config).
     * 
     * The values may be filtered using the searchTerm model.
     */
    vm.getValues = function(option) {
        var searchTerm = vm.searchTerms[option.key] ? vm.searchTerms[option.key].toLowerCase() : vm.searchTerms[option.key];

        if (option.autocomplete.options) {
            if (!searchTerm || searchTerm === "") {
                return option.autocomplete.options;
            } else {
                return option.autocomplete.options.filter(function(option) {
                    if (option.toLowerCase().indexOf(searchTerm) !== -1) {
                        return option;
                    }
                })
            }
        } else if (option.autocomplete.asyncOptions) {
            var operation = option.autocomplete.asyncOptions;
            var deferredValues = $q.defer()

            query.execute(operation, function(values) {
                if (!searchTerm || searchTerm == "") {
                    deferredValues.resolve(values);
                    return;
                }
                var filteredValues = values.filter(function(value) {
                    if (value.toLowerCase().indexOf(searchTerm) !== -1) {
                        return value;
                    }
                });
                deferredValues.resolve(filteredValues);
            }, function(err) {
                error.handle("Failed to retrieve prepopulated options", err);
                deferredValues.resolve([]);
            });

            return  deferredValues.promise;

        } else {
            throw "Invalid operation options configuration. " + 
            "Preset options must contain either static options or an operation to retrieve them";
        }
    }

    vm.loadValues = function(option) { 
        var deferred = $q.defer();

        vm.getValues(option).then(function(resolvedValues) {
            vm.presets[option.key] = resolvedValues;
            deferred.resolve();
        });

        return deferred.promise;
    }

    /**
     * Returns true if value is null, undefined or is an empty array.
     */
    vm.isEmpty = function(value) {
        return (value == undefined || ((Array.isArray(value) && !value.length)))
    }

}
