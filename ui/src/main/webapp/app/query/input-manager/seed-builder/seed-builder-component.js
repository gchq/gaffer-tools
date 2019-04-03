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
 * Input component which consists of a textarea which parses and unparses csv input to
 * create seeds
 */
angular.module('app').component('seedBuilder', seedBuilder());

function seedBuilder() {
    return {
        templateUrl: 'app/query/input-manager/seed-builder/seed-builder.html',
        controller: SeedBuilderController,
        controllerAs: 'ctrl',
        bindings: {
            model: '=',
            routeParam: '@',
            usePrevious: '<'
        }
    }
}

/**
 * Controller which parses and unparses csv input
 * @param {*} schema The schema service
 * @param {*} csv The csv parser service
 * @param {*} types The type service
 * @param {*} error The error service
 * @param {*} events The events service
 * @param {*} common The common service
 * @param {*} $routeParams The route params service
 */
function SeedBuilderController(schema, csv, types, error, events, common, $routeParams, $location) {
    var vm = this;
    vm.seedVertices = '';

    vm.$onInit = function() {
        schema.get().then(function(gafferSchema) {
            var vertices = schema.getSchemaVertices();
            if(vertices && vertices.length > 0 && undefined !== vertices[0]) {
                vm.vertexClass = gafferSchema.types[vertices[0]].class;
            }
            recalculateSeeds(vm.model);
            if($routeParams[vm.routeParam]) {
                if(Array.isArray($routeParams[vm.routeParam])) {
                    vm.seedVertices += '\n' + $routeParams[vm.routeParam].join('\n');
                } else {
                    vm.seedVertices += '\n' + $routeParams[vm.routeParam];
                }
                vm.addSeeds(true);
                $location.search(vm.routeParam, null);
            }

        });

        events.subscribe('onPreExecute', vm.addSeeds);
        events.subscribe('onOperationUpdate', onOperationUpdate);
    }

    var onOperationUpdate = function() {
        recalculateSeeds(vm.model);
    }

    /**
     * Creates the placeholder for the seed input
     */
    vm.getPlaceHolder = function() {
        return vm.usePrevious ? "Input is provided by the output of the previous operation" : "Enter your seeds, each seed on a new line \n" + vm.getCsvHeader()
    }

    /**
     * At the end of the component's lifecycle, it unsubscribes from the event service to save
     * time unnecessary function calls
     */
    vm.$onDestroy = function() {
        events.unsubscribe('onOperationUpdate', onOperationUpdate)
        events.unsubscribe('onPreExecute', vm.addSeeds);
    }

    /**
     * Gets all the fields available for a given type from the type service
     */
    vm.getFields = function() {
        return types.getFields(vm.vertexClass);
    }

    /**
     * Gets the csv header for the vertex class from the type service.
     */
    vm.getCsvHeader = function() {
        return types.getCsvHeader(vm.vertexClass);
    }

    /**
     * Goes through all lines from seed input box, removes trailing whitespace,
     * processes the line (returns if it fails), checks it's not too long,
     * adds it to an array, before finally updating the input service
     *
     * @param {boolean} suppressDuplicateError
     */
    vm.addSeeds = function(suppressDuplicateError) {
        if (vm.usePrevious) {
            vm.model = null;
            return;
        }
        var newInput = [];
        var keys = vm.getFields().map(function(field) {
            return field.key;
        });

        var lines = vm.seedVertices.split('\n');
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
            var parts = {};
            var fields = vm.getFields();
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
            newInput.push(createSeed(parts));
        }

        // deduplicate the input
        var deduped = [];

        for (var i in newInput) {
            var value = newInput[i];
            if (!common.arrayContainsObject(deduped, value)) {
                deduped.push(value);
            } else if (!suppressDuplicateError) {
                error.handle('Duplicate value: ' + types.getShortValue(types.createJsonValue(value.valueClass, value.parts)) + ' was removed') // not invalid
            }
        }

        if (vm.seedForm) {
            vm.seedForm.multiSeedInput.$setValidity('csv', true)
        }
        vm.model = deduped;
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
            handleError(simple, simple + '. Please wrap values containing commas in "quotes"');
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
        if (vm.seedForm) {
            vm.seedForm.multiSeedInput.$setValidity('csv', false);
        }
    }

    /**
     * Generates the CSV when supplied with values.
     * It makes sure to wrap stringified numbers and booleans with "quotes"
     * If fields are undefined, it adds commas without values
     * @param {any[]} updated The array of inputs
     */
    var recalculateSeeds = function(updated) {
        if (updated === undefined || updated === null) {
            vm.seedVertices = ''
            return;
        }
        var toParse = updated.map(function(input) {
            return input.parts;
        });

        var fields = vm.getFields();

        var str = '';
        for (var i in toParse) {            // for each value in the inputs
            var parts = toParse[i];
            for (var i in fields) {         // for each field returned by the type service for the vertex class
                var field = fields[i].key;
                var part = parts[field];                    // extract that field from the value
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

            str = str.replace(/,$/, "\n");
        }
        vm.seedVertices = str.slice(0, -1);
    }


    var createSeed = function(parts) {
        var vertex = {valueClass: vm.vertexClass, parts: parts};
        return vertex;
    }
}
