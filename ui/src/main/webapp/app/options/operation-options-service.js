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

angular.module('app').factory('operationOptions', function() { // This simple service stores and serves to the default operation options
    
    var service = {};
    
    var defaultOperationOptionsConfiguration = null;


    /**
     * Updates the default configuration for options components
     * @param {Object} newDefaults 
     */
    service.updateDefaultConfiguration = function(newDefaults) {
        defaultOperationOptionsConfiguration = angular.copy(newDefaults);   
    }

    /**
     * Gets the default configuration for options components
     */
    service.getDefaultConfiguration = function() {
        return angular.copy(defaultOperationOptionsConfiguration);
    }

    /**
     * Derives the operation options to be inserted into a query 
     * from the default operation options configuration
     */
    service.getDefaultOperationOptions = function() {
        return extractOperationOptions(defaultOperationOptionsConfiguration)
    }

    /**
     * Derives the operation options from any operation options configuration;
     * @param {Object} operationOptionsConfiguration 
     */
    service.extractOperationOptions = function(operationOptionsConfiguration) {
        var options = {};
        if (!operationOptionsConfiguration) {
            return options;
        }

        for (var i in operationOptionsConfiguration.visible) {
            var option = operationOptionsConfiguration.visible[i];

            if (option.value !== undefined) {
                options[options.key] = options[value]
            }
        }

        return options;
    }

    return service;
});