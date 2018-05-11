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

angular.module('app').factory('results', ['events', function(events) {

    var resultService = {};
    var results = {entities: [], edges: [], other: []};

    resultService.get = function() {
        return results;
    }

    resultService.clear = function(broadcast) {
        results = {entities: [], edges: [], other: []};
        if(broadcast === undefined || broadcast) {
            events.broadcast('resultsUpdated', [results]);
        }
    }

    resultService.update = function(newResults) {
        if(newResults !== undefined) {
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
                        results.entities.push(result);
                    }
                } else if(result.class === "uk.gov.gchq.gaffer.data.element.Edge") {
                    if(result.source !== undefined && result.source !== ''
                         && result.destination !== undefined && result.destination !== '') {
                       results.edges.push(result);
                    }
                } else {
                    results.other.push(result);
                }
            }
            events.broadcast('resultsUpdated', [results]);
        }
    }

    return resultService;
}]);
