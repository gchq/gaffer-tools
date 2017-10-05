'use strict'

angular.module('app').factory('results', ['$q', function($q) {

    var resultService = {}
    resultService.results = {entities: [], edges: [], entitySeeds: [], other: []}

    var defer = $q.defer()

    resultService.observeResults = function() {
        return defer.promise
    }

    resultService.clearResults = function() {
        resultService.results = {entities: [], edges: [], entitySeeds: [], other: []}
    }

    resultService.updateResults = function(results) {
        if(results) {
            for (var i in results) {
                var result = results[i];

                if(result.class === "uk.gov.gchq.gaffer.data.element.Entity") {
                    if(result.vertex !== undefined && result.vertex !== '') {
                        resultService.results.entities.push(result);
                        if(resultService.results.entitySeeds.indexOf(result.vertex) == -1) {
                            resultService.results.entitySeeds.push(result.vertex);
                        }
                    }
                } else if(result.class === "uk.gov.gchq.gaffer.operation.data.EntitySeed") {
                   if(result.vertex !== undefined && result.vertex !== '') {
                       if(resultService.results.entitySeeds.indexOf(result.vertex) == -1) {
                           resultService.results.entitySeeds.push(result.vertex);
                       }
                   }
                } else if(result.class === "uk.gov.gchq.gaffer.data.element.Edge") {
                    if(result.source !== undefined && result.source !== ''
                         && result.destination !== undefined && result.destination !== '') {
                       resultService.results.edges.push(result);

                       if(resultService.results.entitySeeds.indexOf(result.source) == -1) {
                           resultService.results.entitySeeds.push(result.source);
                       }
                       if(resultService.results.entitySeeds.indexOf(result.destination) == -1) {
                           resultService.results.entitySeeds.push(result.destination);
                       }
                    }
                } else {
                    resultService.results.other.push(result);
                }
            }
            defer.notify(resultService.results)
        }
    }

    return resultService
}])