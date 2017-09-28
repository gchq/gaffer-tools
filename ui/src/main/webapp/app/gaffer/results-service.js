(function() {

    'use strict'

    angular.module('app').factory('resultsService', resultsService)

    function resultsService() {

        return {
            getResults: getResults,
            updateResults: updateResults,
            clearResults: clearResults
        }


        var results = {entities: [], edges: [], entitySeeds: [], other: []}

        function getResults() {
            return results
        }

        function clearResults() {
            results = {entities: [], edges: [], entitySeeds: [], other: []}
        }

        function updateResults(results) {
            if(results) {
                for (var i in results) {
                    var result = results[i];

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
            }
        }
    }
})()