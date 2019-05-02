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

angular.module('app').factory('results', ['events', function(events) {

    var resultService = {};
    // cache of unique stringified results
    var uniqueResults = [];
    var results = {entities: [], edges: [], other: []};

    resultService.get = function() {
        return results;
    }

    resultService.clear = function(broadcast) {
        results = {entities: [], edges: [], other: []};
        uniqueResults = [];
        if(broadcast === undefined || broadcast) {
            events.broadcast('resultsUpdated', [results]);
            events.broadcast('resultsCleared');
        }
    }

    var addUniqueResult = function(results, newResult) {
        var stringified = JSON.stringify(newResult)
        if (uniqueResults.indexOf(stringified) === -1) {
            uniqueResults.push(stringified)
            results.push(newResult)
        }
    }

    resultService.update = function(newResults) {
        var incomingResults = {
            entities: [], edges: [], other: []
        }
        if(newResults !== undefined && newResults !== null && newResults !== "") {
            if(!Array.isArray(newResults)) {
                newResults = [newResults];
            }
            for (var i in newResults) {
                var result = newResults[i];
                if(result !== Object(result)) {
                    var type = typeof result;
                    if(type === "string") {
                        type = "String";
                    } else if(type === "number") {
                       type = "Integer";
                    }

                    result = {
                        class: type,
                        value: result
                    };
                }

                if(result.class === "uk.gov.gchq.gaffer.data.element.Entity") {
                    if(result.vertex !== undefined && result.vertex !== '') {
                        incomingResults.entities.push(result);
                        addUniqueResult(results.entities, result);
                    }
                } else if(result.class === "uk.gov.gchq.gaffer.data.element.Edge") {
                    if(result.source !== undefined && result.source !== ''
                    && result.destination !== undefined && result.destination !== '') {
                        incomingResults.edges.push(result);
                        addUniqueResult(results.edges, result);
                    }
                } else {
                    incomingResults.other.push(result);
                    addUniqueResult(results.other, result);
                }
            }
            events.broadcast('incomingResults', [incomingResults]);
            events.broadcast('resultsUpdated', [results]);
        }
    }

    return resultService;
}]);
