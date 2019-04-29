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
import { Injectable } from '@angular/core';
import { EventsService } from '../dynamic-input/events.service';

@Injectable()
export class ResultsService {

    results = {entities: [], edges: [], other: []};

    constructor(private events: EventsService) {}

    /** Get the table results */
    get = function() {
        return this.results;
    }

    /** Clear the table results */
    clear = function(broadcast) {
        this.results = {entities: [], edges: [], other: []};
        if(broadcast === undefined || broadcast) {
            this.events.broadcast('resultsUpdated', [this.results]);
            this.events.broadcast('resultsCleared');
        }
    }

    /** Update the table */
    update = function(newResults) {
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
                    let finalType;
                    if(type === "string") {
                        finalType = "String";
                    } else if(type === "number") {
                       finalType = "Integer";
                    }

                    result = {
                        class: finalType,
                        value: result
                    };
                }

                if(result.class === "uk.gov.gchq.gaffer.data.element.Entity") {
                    if(result.vertex !== undefined && result.vertex !== '') {
                        incomingResults.entities.push(result);
                        this.results.entities.push(result);
                    }
                } else if(result.class === "uk.gov.gchq.gaffer.data.element.Edge") {
                    if(result.source !== undefined && result.source !== ''
                    && result.destination !== undefined && result.destination !== '') {
                        incomingResults.edges.push(result);
                        this.results.edges.push(result);
                    }
                } else {
                    incomingResults.other.push(result)
                    this.results.other.push(result);
                }
            }
            this.events.broadcast('incomingResults', [incomingResults]);
            this.events.broadcast('resultsUpdated', [this.results]);
        }
    }
};
