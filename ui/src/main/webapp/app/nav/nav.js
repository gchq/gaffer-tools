/*
 * Copyright 2016 Crown Copyright
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

angular.module('app').factory('nav', ['$http', 'graph', function($http, graph){
    var nav = {};
    var graphDataGraphLoaded = false;
    var switchTabs = function(tabFlag) {
          nav.showRaw = false;
          nav.showGraph = false;
          nav.showResultsTable = false;
          nav.showSettings = false;
          nav[tabFlag] = true;
      };

      nav.openRaw = function() {
         switchTabs('showRaw');
      };

      nav.openGraph = function() {
         if(!graphDataGraphLoaded) {
              graph.load()
                   .then(function(){
                     graphDataGraphLoaded = true;
                   });
          }
         switchTabs('showGraph');
      };

      nav.openResultsTable = function() {
        switchTabs('showResultsTable');
      };

      nav.openSettings = function() {
         switchTabs('showSettings');
      };

    return nav;
} ]);