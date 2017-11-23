/*
 * Copyright 2017 Crown Copyright
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
    var results = {entities: [], edges: [], entitySeeds: [], other: []};

    resultService.get = function() {
        return results;
    }

    resultService.clear = function() {
        results = {entities: [], edges: [], entitySeeds: [], other: []};
    }

    resultService.update = function(newResults) {
        if(newResults) {
            for (var i in newResults) {
                var result = newResults[i];

                if(result.class === "uk.gov.gchq.gaffer.data.element.Entity") {
                    if(result.vertex !== undefined && result.vertex !== '') {
                        results.entities.push(result);
                        if(results.entitySeeds.indexOf(result.vertex) == -1) {
                            results.entitySeeds.push(result.vertex);
                        }
                    }
                } else if(result.class === "uk.gov.gchq.gaffer.operation.data.EntitySeed") {
                   if(result.vertex !== undefined && result.vertex !== '') {
                       if(results.entitySeeds.indexOf(result.vertex) == -1) {
                           results.entitySeeds.push(result.vertex);
                       }
                   }
                } else if(result.class === "uk.gov.gchq.gaffer.data.element.Edge") {
                    if(result.source !== undefined && result.source !== ''
                         && result.destination !== undefined && result.destination !== '') {
                       results.edges.push(result);

                       if(results.entitySeeds.indexOf(result.source) == -1) {
                           results.entitySeeds.push(result.source);
                       }
                       if(results.entitySeeds.indexOf(result.destination) == -1) {
                           results.entitySeeds.push(result.destination);
                       }
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