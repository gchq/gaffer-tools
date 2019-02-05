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

'use strict'

angular.module('app').factory('csv', ['error', function(error) {

    var service = {};

    /**
     * Complex processing algorithm which parses & validates a single line of CSV
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
     * @param {function} onError a function to call in the event of an error
     * @returns {any[]} An array of values or undefined if the parsing fails
     */
    service.parse = function(toProcess, onError) {
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
                            if (line[_pointer - 1] === ',') {   // if character before EOL was a comma
                                processed.push(undefined)   // undefined value is implied
                            }
                            _state = states.complete;   // set state to complete to exit the loop
                            break;                      // and break out of the case

                        case '"':                       // unescaped quote reached
                            _state = states.quoted;     // set state to quoted
                            break;                      // and break out of the case

                        case ',':                       // empty value implies undefined input
                            processed.push(undefined);  // so push undefined to the array
                            break;                      // then break out of the loop

                        default:                        // The start of a string, or an escape character
                            _state = states.unQuoted;   // Either way it's the start of an unquoted string
                            continue;                   // Continue to next loop to avoid pointer moving forward
                    }
                    _pointer++;     // update the pointer to the next character
                    break;          // break out of the switch statement


                case states.escaped     :   // after an escape character
                    if (line[_pointer] === '\0') {  // unless the escaped character is end of input
                        if (onError) {
                            onError('Illegal escape character at end of input for line: \'' + toProcess + '\'');   // in which case, we broadcast the error
                        }                                                                  
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

                        } else if (line[_pointer] === '\0') { // Or if we get to the EOL before reaching the terminating quote
                            if (onError) {
                                onError('Unclosed quote for \'' + toProcess + '\'');   // broadcast an error
                            }                           
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
                            if (onError) {
                                onError('Unexpected \'"\' character in line \'' + toProcess + '\'. Please escape with \\.');   // If we do, broadcast an error
                            }
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
                        if (onError) {
                            onError('Unexpected \'' + line[_pointer] + '\' character in line \'' + toProcess + '\'.');     // If not we broadcast the error
                        }
                        return undefined;                                                                                   // and return undefined to show the processing failed
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
     * Generates CSV based on a an array of objects, and a header array.
     */
    service.generate = function(rows, headers) {

        var csvString = "";

        if (!headers) { 
            error.handle('Unable to parse CSV with no headers');
        }

        for (var i in headers) {
            var header = headers[i].replace(/"/g, '""');
            if (header.indexOf(',') !== -1 || header.indexOf('"') !== -1) {
                csvString += '"' + header + '",';
            } else {
                csvString += header + ',';
            }
        }

        csvString = csvString.substr(0, csvString.length - 1);
        csvString += '\r\n';
        

        for (var i in rows) {
            var row = rows[i];


            for (var j in headers) {
                var field = row[headers[j]];
                
                if (field === null || field === undefined) {
                    csvString += ',';
                    continue;
                }

                if (typeof field === 'string') {
                    field = field.replace(/"/g, '""');
                    if (field.indexOf(',') !== -1 || field.indexOf('"') !== -1) {
                        field = '"' + field + '"';
                    }
                }

                csvString += field + ','
            }

            csvString = csvString.substr(0, csvString.length - 1);
            csvString += '\r\n';
            
        }

        csvString.trim();

        return csvString;

    }

    return service;
}]);
