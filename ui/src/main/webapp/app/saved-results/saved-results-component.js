/*
 * Copyright 2018-2019 Crown Copyright
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

angular.module('app').component('savedResults', savedResults())

function savedResults() {
    return {
        templateUrl: 'app/saved-results/saved-results.html',
        controller: SavedResultsController,
        controllerAs: 'ctrl'
    }   
}

function SavedResultsController(loading, query, graph, error, navigation, events) {
    var savedResultsKey = "savedResults";

    var vm = this;
    vm.savedResults = [];

    /**
     * Loads the saved results
     */
    vm.$onInit = function() {
        vm.savedResults = loadSavedResults();

        events.subscribe('resultsSaved', function() {
            vm.savedResults = loadSavedResults();
        });
    }

    vm.updateSavedResults = function() {
        updateSavedResults(vm.savedResults);
        vm.savedResults = loadSavedResults();
    }

    vm.deleteSavedResults = function(jobId) {
        deleteSavedResults(jobId);
        vm.savedResults = loadSavedResults();
    }

    vm.deleteAllSavedResults = function() {
        localStorage.setItem(savedResultsKey, JSON.stringify([]));
        vm.savedResults = []
    }

    vm.reloadSavedResults = function(jobId) {
        loading.load();

        query.executeQuery(
            {
              "class": "uk.gov.gchq.gaffer.operation.impl.export.resultcache.GetGafferResultCacheExport",
              "jobId": jobId
            },
            function(data) {
                submitResults(data);
            }
        );

        var submitResults = function(data) {
            if(!data || data.length < 1) {
                error.handle('No results were found - this could be because your results have expired.');
            } else {
                graph.deselectAll();
                navigation.goTo('results');
            }
        }
    }

    var loadSavedResults = function(query) {
        var savedResults = localStorage.getItem(savedResultsKey);
        if(savedResults) {
            savedResults = JSON.parse(savedResults);
        } else {
            savedResults = [];
        }
        sortSavedResults(savedResults);
        return savedResults;
    }

    var deleteSavedResults = function(jobId) {
        var savedResults = loadSavedResults();
        for( var i = 0; i < savedResults.length; i++){
           if (savedResults[i].jobId === jobId) {
             savedResults.splice(i, 1);
           }
        }
        localStorage.setItem(savedResultsKey, JSON.stringify(savedResults));
    }

    var updateSavedResults = function(savedResults) {
        for( var i = 0; i < savedResults.length; i++){
            savedResults[i].edit = false;
        }
        localStorage.setItem(savedResultsKey, JSON.stringify(savedResults));
    }

    var sortSavedResults = function(savedResults) {
        savedResults.sort(function(a, b) {
            return a.timestamp > b.timestamp ? -1 : (a.timestamp < b.timestamp ? 1 : 0);
        })
    }
}
