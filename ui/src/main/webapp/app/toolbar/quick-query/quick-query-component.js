/*
 * Copyright 2018 Crown Copyright
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

angular.module('app').component('quickQuery', quickQuery());

function quickQuery() {
    return {
        templateUrl: 'app/toolbar/quick-query/quick-query.html',
        controller: QuickQueryController,
        controllerAs: 'ctrl'
    }
} 

function QuickQueryController(config, schema, csv, error, types, query, navigation) {
    var vm = this;

    var ENTITY_SEED_CLASS = "uk.gov.gchq.gaffer.operation.data.EntitySeed";

    var defaultQuery = JSON.stringify({
        "class": "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
        "input": [
            "${input}"
        ],
        "view": {
            "globalElements": [
                {
                    "groupBy": []
                }
            ]
        }
    });
    
    vm.searchText = "";
    vm.placeholder = "Quick query"
    vm.description = "Get all related Elements";
    vm.query = null;
    vm.vertexClass = null;

    vm.$onInit = function() {

        config.get().then(function(conf) {
            if (!conf.quickQuery) {
                vm.query = defaultQuery;
                return;
            }
            vm.placeholder = conf.quickQuery.placeholder ;
            vm.description = conf.quickQuery.description;
            vm.query = conf.quickQuery.operation ? JSON.stringify(conf.quickQuery.operation) : defaultQuery;
        });

        schema.get().then(function(gafferSchema) {
            var vertices = schema.getSchemaVertices();
            if (vertices && vertices.length > 0 && undefined !== vertices[0]) {
                vm.vertexClass = gafferSchema.types[vertices[0]].class;
            }
        });

    }

    
    vm.search = function() {
        var seed = createSeed();    // creates vertex (not wrapped in EntitySeed Class)
        var jsonSeed = types.createJsonValue(seed.valueClass, seed.parts);
        var stringifiedInput = JSON.stringify({
            class: ENTITY_SEED_CLASS,
            vertex: jsonSeed
        });

        var operation = vm.query.replace("\"${input}\"", stringifiedInput);

        operation = JSON.parse(operation);
        query.addOperation(operation);

        query.executeQuery(operation, function() {
            vm.searchText = "";
            navigation.goTo('results');
        });

    }
    
    /**
     * Checks the length of the values returned is not greater than the number of keys.
     * If it is it broadcasts an error.
     *
     * @param {string} line The line of csv
     * @param {any[]} separated The processed values
     * @param {string[]} keys The keys associated with the fields of the vertex class
     *
     * @returns true if the line is valid, false if invalid
     */
    var isValid = function(line, separated, keys) {
        if (separated.length > keys.length) {
            var simple = line + ' contains ' + separated.length + ' parts. Only ' + keys.length + ' were expected'
            onError(simple, simple + '. Please wrap values containing commas in "quotes"');
            return false;
        }
        return true;
    }

    var onError = function(message, err) {
        error.handle(message, err);
    }

    var createSeed = function() {
        var separated = csv.parse(vm.searchText, onError);
        if (!separated) {
            return;
        }

        var fields = types.getFields(vm.vertexClass);
        
        var keys = fields.map(function(field) {
            return field.key;
        });

        if (!isValid(vm.searchText, separated, keys)) {
            return;
        }
        
        var parts = {};

        for (var j in fields) {
            var value = separated[j];
            if (fields[j].class === 'java.lang.String' && typeof value !== 'string') {
                value = JSON.stringify(value);
            }
            parts[fields[j].key] = value;
        }

        return {
            valueClass: vm.vertexClass,
            parts: parts
        }
    }
}