/*
 * Copyright 2017-2019 Crown Copyright
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

/**
 * Input component which consists of a textarea which parses and unparses csv pairs of seeds
 */
angular.module('app').component('pairBuilder', pairBuilder());

function pairBuilder() {
    return {
        templateUrl: 'app/query/input-manager/pair-builder/pair-builder.html',
        controller: PairBuilderController,
        controllerAs: 'ctrl',
        bindings: {
            usePrevious: '<',
            model: '='
        }
    }
}

/**
 * Controller which parses and unparses csv pairs
 * @param {*} schema The schema service
 * @param {*} csv The csv parser service
 * @param {*} types The type service
 * @param {*} error The error service
 * @param {*} events The events service
 * @param {*} common The common service
 * @param {*} $routeParams The route params service
 */
function PairBuilderController(schema, csv, types, error, events, common, $routeParams, $location) {
    var vm = this;
    vm.pairs = '';

    vm.$onInit = function() {
        schema.get().then(function(gafferSchema) {
            var vertices = schema.getSchemaVertices();
            if(vertices && vertices.length > 0 && undefined !== vertices[0]) {
                vm.vertexClass = gafferSchema.types[vertices[0]].class;
            }
            if($routeParams['input']) {
                if(Array.isArray($routeParams['input'])) {
                    vm.pairs += '\n' + $routeParams['input'].join('\n');
                } else {
                    vm.pairs += '\n' + $routeParams['input'];
                }
                vm.addPairs(true);
                $location.search('input', null);
            }
        });
        
        events.subscribe('onOperationUpdate', onOperationUpdate);
        events.subscribe('onPreExecute', vm.addPairs);
        recalculateSeeds(vm.model);
    }

    var onOperationUpdate = function() {
        recalculateSeeds(vm.model);
    }

    /**
     * Creates the placeholder for the pair input
     */
    vm.getPlaceHolder = function() {
        return vm.usePrevious ? "Input is provided by the output of the previous operation" : "Enter your pairs of seeds, each pair on a new line.\n" + vm.createExample();
    }

    /**
     * At the end of the component's lifecycle, it unsubscribes from the event service to reduce
     * unnecessary function calls
     */
    vm.$onDestroy = function() {
        events.unsubscribe('onOperationUpdate', recalculateSeeds);
        events.unsubscribe('onPreExecute', vm.addPairs);
    }

    /**
     * Gets all the fields available for a given type from the type service
     */
    vm.getFields = function() {
        return types.getFields(vm.vertexClass);
    }

    /**
     * creates an example csv header - replacing empty headers with start and end
     */
    vm.createExample = function() {
        var csvHeader = types.getCsvHeader(vm.vertexClass);
        return csvHeader === '' ? 'start,end' : csvHeader + ',' + csvHeader;
    }

    /**
     * Goes through all lines from seed input box, removes trailing whitespace,
     * processes the line (returns if it fails), checks it's not too long, 
     * adds it to an array, before finally updating the model
     */
    vm.addPairs = function(suppressDuplicateError) {
        if (vm.usePrevious) {
            vm.model = null;
            return;
        }
        var newInput = [];
        var keys = vm.getFields().map(function(field) {
            return field.key;
        });

        var lines = vm.pairs.split('\n');
        for (var i in lines) {
            var line = lines[i].trim();
            if (line === '') {
                continue; // skip empty lines
            }
            var separated = csv.parse(line, handleError);
            if (separated === undefined) { // if something went wrong in the processing
                return;
            }
            if (!isValid(line, separated, keys)) {
                return;
            }
            var start = {};
            var end = {};
            var fields = vm.getFields();

            for (var j in fields) {
                var startValue = separated[j];
                if (fields[j].class !== 'java.lang.String' && fields[j].type !== 'text') {
                    try {
                        startValue = JSON.parse(startValue);
                    } catch (e) {
                        console.log("possible failure parsing " + fields[j].type + " from string: " + startValue + " for class: " + fields[j].class, e); // Don't broadcast to UI.
                    }
                }
                start[fields[j].key] = startValue;
                
                var endValue = separated[+j + fields.length];
                if (fields[j].class !== 'java.lang.String' && fields[j].type !== 'text') {
                    try {
                        endValue = JSON.parse(endValue);
                    } catch (e) {
                        console.log("possible failure parsing " + fields[j].type + " from string: " + endValue + " for class: " + fields[j].class, e); // Don't broadcast to UI.
                    }
                }
                end[fields[j].key] = endValue
            }
            newInput.push(createPair(start, end));
        }

        // deduplicate the input
        var deduped = [];

        for (var i in newInput) {
            var value = newInput[i];
            if (!common.arrayContainsObject(deduped, value)) {
                deduped.push(value);
            } else if (!suppressDuplicateError) {
                error.handle('Duplicate value was removed') // not invalid
            }
        }

        if (vm.pairForm) {
            vm.pairForm.seedPairInput.$setValidity('csv', true)
        }
        vm.model = deduped;
    }

    /**
     * Checks the length of the values returned is not equal to the number of keys x 2 (because there are two values in pairs).
     * If it is it broadcasts an error.
     * 
     * @param {string} line The line of csv
     * @param {any[]} separated The processed values
     * @param {string[]} keys The keys associated with the fields of the vertex class 
     * 
     * @returns true if the line is valid, false if invalid
     */
    var isValid = function(line, separated, keys) {
        if (separated.length !== (keys.length * 2)) {
            var simple = 'Expected exactly ' + keys.length * 2 + ' parts but line \'' + line + '\' only contains ' + separated.length
            handleError(simple, simple + '. Please wrap values containing commas in "quotes" and include empty fields');
            return false;
        }
        return true;
    }

    /**
     * Calls error.handle with message and error but also sets the validity of the form to false. Meaning that execute cannot be called
     * until the input it updated
     * @param {string} message The error message
     * @param {*} err The error (optional)
     */
    var handleError = function(message, err) {
        error.handle(message, err);
        if (vm.pairForm) {
            vm.pairForm.seedPairInput.$setValidity('csv', false);
        }
    }

    /**
     * Generates the CSV when supplied with values.
     * It makes sure to wrap stringified numbers and booleans with "quotes"
     * If fields are undefined, it adds commas without values
     * @param {any[]} updated The array of inputs
     */
    var recalculateSeeds = function(toParse) {
        var fields = vm.getFields();

        var str = '';
        for (var i in toParse) {          // for each pair in the input
            var pair = toParse[i];
            for (var value in pair) {   // for each first and second part of the pair
                var parts = pair[value].parts;
                for (var i in fields) {         // for each field returned by the type service for the vertex class
                    var key = fields[i].key;      
                    var part = parts[key];                    // extract that field from the value
                    if (part === undefined || part === null) {  // if it doesn't exist
                        str += ',';                             // then add a single comma
                    } else if (typeof part === 'string') {                                                      // or if it's a string
                        if (part.indexOf(',') !== -1 || !isNaN(part) || part === 'true' || part === 'false') {  // but looks like a number or boolean.
                            str += ('"' + part + '",');                                                         // wrap it in quotes
                        } else {
                            var parsed = part.replace(/\\/g, "\\\\").replace(/"/g, "\\\"")    // otherwise escape backslashes and quotes
                            str += (parsed + ',');                                          // then add it
                        }
                    } else {
                        str += (part + ',');    // or if it's not a string, just add it
                    }
                }

            }
            str = str.replace(/,$/, "\n");
        }
        vm.pairs = str.slice(0, -1);
    }


    var createPair = function(first, second) {
        return {
            first: {
                valueClass: vm.vertexClass,
                parts: first
            },
            second: {
                valueClass: vm.vertexClass,
                parts: second
            }
        }
    }
}
