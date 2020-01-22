/*
 * Copyright 2020 Crown Copyright
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

function SavedResultsController(loading, query, graph, error, navigation, events, $cookies, config) {
    var saveResultsConfig = {
        enabled: false
    };

    var vm = this;
    vm.savedResults = [];

    /**
     * Loads the saved results
     */
    vm.$onInit = function() {
        events.subscribe('resultsSaved', function() {
            vm.savedResults = loadSavedResults();
        });

        config.get().then(function(conf) {
            if (conf.savedResults) {
                saveResultsConfig = conf.savedResults;
                if(saveResultsConfig.enabled) {
                    vm.savedResults = loadSavedResults();
                }
            }
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
        vm.savedResults = []
        updateSavedResults(vm.savedResults);
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

    vm.isEnabled = function() {
        return saveResultsConfig.enabled;
    }

    vm.daysToLive = function() {
        if(vm.isEnabled() && saveResultsConfig.timeToLiveInDays) {
            if(saveResultsConfig.timeToLiveInDays == 1) {
                return "1 day"
            }
            return saveResultsConfig.timeToLiveInDays + " days";
        }
        return "0 days";
    }

    var loadSavedResults = function(query) {
        var savedResults = $cookies.getObject(saveResultsConfig.key);
        if(!savedResults) {
            savedResults = [];
        }
        removeExpired(savedResults);
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
        updateSavedResults(savedResults);
    }

    var updateSavedResults = function(savedResults) {
        for( var i = 0; i < savedResults.length; i++){
            savedResults[i].edit = false;
        }
        $cookies.putObject(saveResultsConfig.key, savedResults, getExpiry());
    }

    var sortSavedResults = function(savedResults) {
        savedResults.sort(function(a, b) {
            return a.timestamp > b.timestamp ? -1 : (a.timestamp < b.timestamp ? 1 : 0);
        })
    }

    var removeExpired = function(savedResults) {
        var ttl = saveResultsConfig.timeToLiveInDays;
        if(!ttl) {
            return;
        }
        var ttlInMillis = ttl * 24 * 60 * 60 * 1000;
        var removedItem = false;
        var now = new Date().getTime();
        for(var i = 0; i < savedResults.length; i++){
           if (savedResults[i].timestamp + ttlInMillis < now) {
             savedResults.splice(i, 1);
             removedItem = true;
           }
        }
        if(removedItem) {
            updateSavedResults(savedResults);
        }
    }

    var getExpiry = function() {
      var result = new Date();
      var ttl = saveResultsConfig.timeToLiveInDays;
      if(!ttl) {
        ttl = 7;
      }
      result.setDate(result.getDate() + ttl);
      return result.toUTCString();
    }
}
