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

/**
 * Input component which consists of a textarea which parses and unparses csv input to
 * create seeds
 */
angular.module('app').component('seedBuilder', seedBuilder());

function seedBuilder() {
    return {
        templateUrl: 'app/query/seed-manager/seed-builder/seed-builder.html',
        controller: SeedBuilderController,
        controllerAs: 'ctrl'
    }
}

/**
 * Controller which parses and unparses csv input
 * @param {*} schema The schema service
 * @param {*} types The type service
 * @param {*} input The input service
 * @param {*} error The error service
 * @param {*} events The events service
 * @param {*} common The common service
 * @param {*} $routeParams The route params service
 */
function SeedBuilderController(schema, types, input, error, events, common, $routeParams) {
    var vm = this;
    vm.seedVertices = '';

    vm.$onInit = function() {
        schema.get().then(function(gafferSchema) {
            var vertices = schema.getSchemaVertices();
            if(vertices && vertices.length > 0 && undefined !== vertices[0]) {
                vm.vertexClass = gafferSchema.types[vertices[0]].class;
            }
            if($routeParams.input) {
                if(Array.isArray($routeParams.input)) {
                    vm.seedVertices += '\n' + $routeParams.input.join('\n');
                } else {
                    vm.seedVertices += '\n' + $routeParams.input;
                }
                vm.addSeeds();
            }
        });
        var currentInput = input.getInput();
        
        events.subscribe('queryInputUpdate', recalculateSeeds);
        events.subscribe('onPreExecute', vm.addSeeds);
        recalculateSeeds(currentInput);
    }

    /**
     * At the end of the component's lifecycle, it unsubscribes from the event service to save
     * time unnecessary function calls
     */
    vm.$onDestroy = function() {
        events.unsubscribe('queryInputUpdate', recalculateSeeds);
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
     */
    vm.addSeeds = function() {
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
            var separated = process(line);
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
                if (fields[j].class === 'java.lang.String' && typeof value !== 'string') {
                    value = JSON.stringify(value);
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
            } else {
                error.handle('Duplicate value: ' + types.getShortValue(types.createJsonValue(value.valueClass, value.parts)) + ' was removed') // not invalid
            }
        }

        if (vm.seedForm) {
            vm.seedForm.multiSeedInput.$setValidity('csv', true)
        }
        input.setInput(deduped);
    }

    /**
     * Complex processing algorithm which parses & validates CSV
     * It implements the following rules:
     * 
     * 1. Values which contain a comma must be quoted or escaped using a backslash
     * 2. Quotes in values must be escaped
     * 3. Backslashes must be escaped
     * 4. Empty strings must be surrounded in quotes
     * 5. Empty values will be treated as undefined
     * 6. Quoted values must be terminated with a quote
     * 7. All quoted values will be treated as strings
     * 8. A line must not end with an escape character
     * 
     * @param {string} toProcess a line of csv
     * @returns {any[]} An array of values or undefined if the parsing fails
     */
    var process = function(toProcess) {
        var line = toProcess + '\0';    // add EOL to denote end of input
        var processed = []; // the array to return

        var states = {
            initial     : 0,    // initial state - at the start or after ','
            escaped     : 1,    // after '\' 
            quoted      : 2,    // between quotes
            unQuoted    : 3,    // in unquoted string
            atSeparator : 4,    // after quotes are closed
            complete    : 5     // when complete
        }

        var _state = states.initial;  // initial state
        var _previousState; // The previous state

        var _pointer = 0; // pointing to first character

        var currentString = '';   // '' = reset

        while(_state !== states.complete) {
            switch(_state) {
                
                case states.initial     :   // In intital state, we need to check whether the next string exists and what to do about it
                    switch(line[_pointer]) {
                        
                        case '\0':                      // End of input reached
                            _state = states.complete;   // set state to complete to exit the loop
                            break;                      // and break out of the case

                        case '"':                       // unescaped quote reached
                            _state = states.quoted;     // set state to quoted
                            break;                      // and break out of the case

                        case ',':                       // ,, implies undefined input
                            processed.push(undefined);  // so push undefined to the array
                            break;                      // then break out of the loop

                        default:                        // The start of a string, or an escape character
                            _state = states.unQuoted;   // Either way it's the start of an unquoted string
                            continue;                   // Continue to next loop to avoid pointer moving forward
                    }
                    _pointer++;     // update the pointer to the next character
                    break;          // break out of the switch statement


                case states.escaped     :   // after an escape character
                    if (line[_pointer] === '\0') {                                                                  // unless the escaped character is end of input
                        handleError('Illegal escape character at end of input for line: \'' + toProcess + '\'');   // in which case, we broadcast the error
                        return undefined;                                                                           // and return undefined to show processing failed
                    }
                    currentString += line[_pointer];    // add character to string regardless of what it is
                    _state = _previousState;            // reset the state
                    _pointer++;                         // move the pointer on
                    break;


                case states.quoted      :   // in a quoted string

                    while(line[_pointer] !== '"') { // until we hit the terminating quote

                        if (line[_pointer] === '\\') {  // unless theres an escape character
                            _state = states.escaped;    // In which case update the current state to escaped
                            break;                      // then exit the loop

                        } else if (line[_pointer] === '\0') {                           // Or if we get to the EOL before reaching the terminating quote
                            handleError('Unclosed quote for \'' + toProcess + '\'');   // broadcast an error
                            return undefined;                                           // Return the failed value of undefined
                        } else {
                            currentString += line[_pointer];    // Otherwise just append the character to the current string regardless of what it is
                        }
                        _pointer++;                             // Then update the pointer

                    }

                    if (_state === states.quoted) {     // unless we hit an escape character
                        _state = states.atSeparator;    // we expect the next character to be a comma or EOL
                    }
                    _previousState = states.quoted;     // keep track of the previous state
                    _pointer++;                         // update the pointer
                    break;                              // exit the switch


                case states.unQuoted    :   // in an unquoted string

                    while(line[_pointer] !== ',' && line[_pointer] !== '\0') {  // Until we see an unescaped comma or EOL implying the end of the string
                        if (line[_pointer] === '\\') {      // Unless we see an escape character                   
                            _state = states.escaped;        // Then we update the state
                            _pointer++;                     // and increment the pointer
                            break;                          // after which, we exit the loop
                        } else if (line[_pointer] === '"') {                                                                    // We should not see quotes here. They should be escaped
                            handleError('Unexpected \'"\' character in line \'' + toProcess + '\'. Please escape with \\.');   // If we do, broadcast an error
                            return undefined;                                                                                   // Then return undefined to show the processing failed
                        } else {                                // But if none of these things happen
                            currentString += line[_pointer];    // append to the current string
                            _pointer++;                         // and increment the pointer
                        }
                    }
                    if (_state == states.unQuoted) {    // If we didn't hit an escape character
                        _state = states.atSeparator;    // We can assume that we hit a comma or EOL so update the state
                    }
                    _previousState = states.unQuoted;   // set the previous state to unquoted
                    break;                              // Then exit the case


                case states.atSeparator :   // at a comma or end of input

                    if (line[_pointer] !== ',' && line[_pointer] !== '\0') {                                                // We should either be at EOL or a comma seperator
                        handleError('Unexpected \'' + line[_pointer] + '\' character in line \'' + toProcess + '\'.');     // If not we broadcast the error
                        return undefined;                                                                                   // and return undefined to show the processing failed
                    }

                    if (_previousState === states.unQuoted) {                                                       // If the string is not in quotes, it may be a number or boolean
                        if ((!isNaN(currentString)) || currentString === 'true' || currentString === 'false') {     // Test if it is
                            currentString = JSON.parse(currentString);                                              // and if so, convert it
                        }
                    }

                    processed.push(currentString);      // Push the current string, number or boolean onto the array
                    currentString = '';                 // the reset the current string to an empty string

                    if (line[_pointer] === ',') {       // If we're currently at a comma - Theres more to come
                        _pointer++;                     // Increment the pointer
                        _state = states.initial;        // Then reset the state
                    } else {                            // otherwise we must be at EOL because of the if statement above
                        _state = states.complete;       // in which case we can set the state to complete and finish processing
                    }
                    break;                              // exit the switch statement
            }

        }

        return processed;   // once parsed, we can return the parts.
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
