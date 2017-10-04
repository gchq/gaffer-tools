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


'use strict'

angular.module('app').component('table', table())

function table() {
    return {
        templateUrl: 'app/table/table.html',
        controller: TableController,
        controllerAs: 'ctrl'
    }
}

function TableController($scope, results, schema, graph) {
    var vm = this
    vm.data = {entities: {}, edges: {}, entitySeeds: [], other: []}
    vm.selectedTab = 0
    vm.selectedSeeds = []
    vm.searchTerm = ''
    vm.schema = schema.getSchema()

    results.observeResults().then(null, null, function(results) {
        update(results)
        $scope.$apply()
    })

    schema.observeSchema().then(null, null, function(schema) {
        vm.schema = schema
        $scope.$apply()
    })

    function clear() {
        vm.data = {entities: {}, edges: {}, entitySeeds: [], other: []}
    }

    function parseVertex(vertex) {
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

    function convertElements() {
        for (var i in vm.data.entities) {
            for (var a in vm.data.entities[i]) {
                vm.data.entities[i][a] = JSON.parse(vm.data.entities[i][a]);
            }
        }
        for (var i in vm.data.edges) {
            for (var a in vm.data.edges[i])
            vm.data.edges[i][a] = JSON.parse(vm.data.edges[i][a]);
        }

    }

    function update(results) {
        clear();
        for (var i in results.entities) {
            var entity = results.entities[i];
            if(!vm.data.entities[entity.group]) {
                vm.data.entities[entity.group] = [];
            }
            if (vm.data.entities[entity.group].indexOf(angular.toJson(entity)) === -1) {
                vm.data.entities[entity.group].push(angular.toJson(entity));
            }
        }

        for (var i in results.edges) {
            var edge = results.edges[i];
            if(!vm.data.edges[edge.group]) {
                vm.data.edges[edge.group] = [];
            }
            if (vm.data.edges[edge.group].indexOf(angular.toJson(edge)) == -1) {
                vm.data.edges[edge.group].push(angular.toJson(edge));
            }
        }

        for (var i in results.entitySeeds) {
            var es = parseVertex(results.entitySeeds[i]);
            if (vm.data.entitySeeds.indexOf(es) == -1) {
                vm.data.entitySeeds.push(es);
            }
        }

        for (var i in results.other) {
            if (vm.data.other.indexOf(results.other[i]) === -1) {
                vm.data.other.push(results.other[i]);
            }
        }

        convertElements();
    }

}