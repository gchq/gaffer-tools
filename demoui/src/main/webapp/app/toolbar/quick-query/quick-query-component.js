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

angular.module('app').component('quickQuery', quickQuery());

function quickQuery() {
    return {
        templateUrl: 'app/toolbar/quick-query/quick-query.html',
        controller: QuickQueryController,
        controllerAs: 'ctrl'
    }
} 

function QuickQueryController(config, schema, csv, error, types, query, operationService, operationOptions, $mdToast, navigation) {
    var vm = this;

    var ENTITY_SEED_CLASS = "uk.gov.gchq.gaffer.operation.data.EntitySeed";
    var OPERATION_CHAIN_CLASS = "uk.gov.gchq.gaffer.operation.OperationChain";

    vm.searchText = "";
    vm.placeholder = "Quick Query"
    

    /**
     * Initialisation function. Disables feature if specified by the user. Otherwise it
     * Sets up all the values dictated by the configuration file. To calculate the vertex class,
     * it uses the first vertex it finds in the schema.
     */
    vm.$onInit = function() {

        config.get().then(function(conf) {
            if (!conf.quickQuery) {
                vm.disableFeature = true;   // remove component
                return;
            }

            schema.get().then(function(gafferSchema) {
                var vertices = schema.getSchemaVertices();
                if (vertices && vertices.length > 0 && undefined !== vertices[0]) {
                    vm.vertexClass = gafferSchema.types[vertices[0]].class;
                    var csvHeader = types.getCsvHeader(vm.vertexClass);
                    vm.placeholder = conf.quickQuery.placeholder ? conf.quickQuery.placeholder : ('Quick Query' + (csvHeader === "" ? "" : ' eg. ' + csvHeader));
                }
            });
            vm.description = conf.quickQuery.description;
            vm.dedupe = conf.quickQuery.deduplicate;
            vm.options = conf.quickQuery.useDefaultOperationOptions;
            vm.limit = conf.quickQuery.limit;
            vm.query = conf.quickQuery.operation ? JSON.stringify(conf.quickQuery.operation) : JSON.stringify(conf.quickQuery.defaultOperation);

            if (vm.query.indexOf('"${input}"') === -1) {
                throw Error('Quick query operation configuration is invalid. Operation must contain the string "${input}" (with quotes)');
            }
        });
    }

    /**
     * Uses configuration to create a gaffer operation from a string input. 
     * Runs the operation against the REST service.
     */
    vm.search = function() {
        var seed = createSeed();    // creates vertex (not wrapped in EntitySeed Class)
        var jsonSeed = types.createJsonValue(seed.valueClass, seed.parts);
        var stringifiedInput = JSON.stringify({
            class: ENTITY_SEED_CLASS,
            vertex: jsonSeed
        });

        var operation = vm.query.replace("\"${input}\"", stringifiedInput);

        operation = JSON.parse(operation);

        var chain;

        if (operation.class === OPERATION_CHAIN_CLASS) {
            chain = operation;
        } else {
            chain = {
                class: OPERATION_CHAIN_CLASS,
                operations: [
                    operation
                ]
            }
        }

        var options = vm.options ? operationOptions.getDefaultOperationOptions() : {};

        if (vm.dedupe) {
            chain.operations.push(operationService.createDeduplicateOperation(options));
        }

        if (vm.limit) {
            chain.operations.push(operationService.createLimitOperation(options));
        }

        if (vm.options) {
            for (var i in chain.operations) {
                if (!chain.operations[i].options) {
                    chain.operations[i].options = options;
                }
            }
        }

        query.addOperation(chain);

        query.executeQuery(chain, function(results) {
            vm.searchText = "";
            var text = 'results returned'
            if (results.constructor === Array) {
                text = results.length + " " + text;
            }

            $mdToast.show($mdToast.simple()
                .textContent(text)
                .action('view results')
                .highlightAction(true)
                .position('top right'))
            .then(function(response) {
                if (response === 'ok') {
                    navigation.goTo('results');
                }
            })
        });

    }
    
    /**
     * Checks the length of the values returned is not greater than the number of keys.
     * If it is it broadcasts an error.
     *
     * @param {string} line The line of csv
     * @param {any[]} separated The processed values
     * @param {string[]} keys The keys associated with the fields of the vertex class
     *
     * @returns true if the line is valid, false if invalid
     */
    var isValid = function(line, separated, keys) {
        if (separated.length > keys.length) {
            var simple = line + ' contains ' + separated.length + ' parts. Only ' + keys.length + ' were expected'
            onError(simple, simple + '. Please wrap values containing commas in "quotes"');
            return false;
        }
        return true;
    }

    /**
     * Error handling. Sends error to the error service
     * @param {String} message the simple message
     * @param {*} err The underlying error
     */
    var onError = function(message, err) {
        error.handle(message, err);
    }

    /**
     * Generates a seed from the text entered into the search box
     */
    var createSeed = function() {
        var separated = csv.parse(vm.searchText, onError);
        if (!separated) {
            return;
        }

        var fields = types.getFields(vm.vertexClass);
        
        var keys = fields.map(function(field) {
            return field.key;
        });

        if (!isValid(vm.searchText, separated, keys)) {
            return;
        }
        
        var parts = {};

        for (var j in fields) {
            var value = separated[j];
            if (fields[j].class !== 'java.lang.String' && fields[j].type !== 'text') {
                try {
                    value = JSON.parse(value);
                } catch (e) {
                    console.log("possible failure parsing " + fields[j].type + " from string: " + value + " for class: " + fields[j].class, e); // Don't broadcast to UI.
                }
            }
            parts[fields[j].key] = value;
        }

        return {
            valueClass: vm.vertexClass,
            parts: parts
        }
    }
}
