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

angular.module('app').factory('table', [function(){
    var table = {};
    table.data = {entities: {}, edges: {}, entitySeeds: [], other: []};
    table.selectedTab = 0;
    table.selectedSeeds = [];
    table.clear = function() {
       table.data = {entities: {}, edges: {}, entitySeeds: [], other: []};
    }

//    table.onSeedSelectToggle = function(vertex) {
//        var index = table.selectedSeeds.indexOf(vertex);
//        if(index > -1) {
//            table.selectedSeeds.splice(index, 1);
//        } else {
//            table.selectedSeeds.push(vertex);
//        }
//    }
//
//    table.onSeedSelect = function(vertex) {
//        if(table.selectedSeeds.indexOf(vertex) == -1
//        && table.data.entitySeeds.indexOf(vertex) > -1) {
//            table.selectedSeeds.push(vertex);
//        }
//    }
//
//    table.onSeedDeselect = function(vertex) {
//        var index = table.selectedSeeds.indexOf(vertex);
//        if(index > -1) {
//            table.selectedSeeds.splice(index, 1);
//        }
//    }

    var parseVertex = function(vertex) {
        if(typeof vertex === 'string' || vertex instanceof String) {
            vertex = "\"" + vertex + "\"";
        }

        try {
             JSON.parse(vertex);
        } catch(err) {
             // Try using stringify
             vertex = JSON.stringify(vertex);
        }

        return vertex;
    }

    table.update = function(results) {
            table.clear();
            for (var i in results.entities) {
                var entity = results.entities[i];
                if(!table.data.entities[entity.group]) {
                    table.data.entities[entity.group] = [];
                }
                table.data.entities[entity.group].push(entity);
            }

            for (var i in results.edges) {
                var edge = results.edges[i];
                if(!table.data.edges[edge.group]) {
                    table.data.edges[edge.group] = [];
                }
                table.data.edges[edge.group].push(edge);
            }

            for (var i in results.entitySeeds) {
                table.data.entitySeeds.push(
                    parseVertex(results.entitySeeds[i])
                );
            }

            for (var i in results.other) {
                table.data.other.push(results.other[i]);
            }
        }


    return table;
} ]);