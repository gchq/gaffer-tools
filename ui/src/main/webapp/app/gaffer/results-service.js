'use strict'

angular.module('app').factory('results', ['$q', function($q) {

    var resultService = {};
    var results = {entities: [], edges: [], entitySeeds: [], other: []};

    var defer = $q.defer();

    resultService.observe = function() {
        return defer.promise;
    }

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
            defer.notify(results);
        }
    }

    return resultService;
}]);