/*
 * Copyright 2017 Crown Copyright
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

angular.module('app').controller('CustomFilterDialogController', ['$mdDialog', 'schema', 'functions', function($mdDialog, schema, functions) {
    var vm = this;

    var filters = [];
    vm.filterForEdit = { preAggregation: true }
    vm.availablePredicates;
    vm.predicateText;

    vm.preAggregationMessage = 'Apply filter before summarization';

    var createFilterFor = function(text) {
        var lowerCaseText = angular.lowercase(text);
        return function filterFn(predicate) {
            return angular.lowercase(predicate).indexOf(lowerCaseText) >= 0;
        }
    }

    vm.search = function(text) {
        var results = text ? vm.availablePredicates.filter( createFilterFor(text) ) : vm.availablePredicates;
        return results;
    }

    vm.createFriendlyName = function(javaClass) {
        var classParts = javaClass.split('.');
        return classParts[classParts.length - 1];
    }

    vm.getProperties = function() {
        if (vm.elementType === 'entity') {
            return schema.getEntityProperties(vm.group);
        } else {
            return schema.getEdgeProperties(vm.group);
        }
    }

    vm.onPreAggregationChange = function() {
        if (vm.filterForEdit.preAggregation) {
            vm.preAggregationMessage = 'Apply filter before summarization';
        } else {
            vm.preAggregationMessage = 'Apply filter after summarization';
        }
    }

    vm.resetForm = function() {
        vm.filterForEdit = { preAggregation: true };
        vm.filterForm.$setUntouched(true);
        vm.filterForEdit.availableFunctionParameters = [];
    }

    vm.cancel = function() {
        $mdDialog.cancel();
    }

    vm.noValidFilters = function() {
        return (filters.length === 0 && vm.filterForm && vm.filterForm.$invalid);
    }

    vm.submit = function() {
        filters.push(vm.filterForEdit);
        $mdDialog.hide(filters)
    }

    vm.addAnother = function() {
        filters.push(vm.filterForEdit);
        vm.resetForm();
    }

    vm.getFlexValue = function() {
        var value = 33;
        if (vm.filterForEdit.availableFunctionParameters.length % 2 === 0) {
            value = 50;
        } else if (vm.filterForEdit.availableFunctionParameters.length === 1) {
            value = 100;
        }

        return value;
    }

    vm.onSelectedPropertyChange = function() {
        functions.getFunctions(vm.group, vm.filterForEdit.property, function(data) {
            vm.availablePredicates = data;
        });
        vm.filterForEdit.predicate = '';
    }

    vm.onSelectedPredicateChange = function() {
        if (vm.filterForEdit.predicate === undefined || vm.filterForEdit.predicate === '' || vm.filterForEdit.predicate === null) {
            return;
        }
        functions.getFunctionParameters(vm.filterForEdit.predicate, function(data) {
            vm.filterForEdit.availableFunctionParameters = data;
        });

        schema.get().then(function(gafferSchema) {
            var elementDef;
            if (gafferSchema.entities) {
                elementDef = gafferSchema.entities[vm.group];
            }
            if(!elementDef && gafferSchema.edges) {
                 elementDef = gafferSchema.edges[vm.group];
            }
            if (gafferSchema.types) {
                var propertyClass = gafferSchema.types[elementDef.properties[vm.filterForEdit.property]].class;
                if("java.lang.String" !== propertyClass
                    && "java.lang.Boolean" !== propertyClass
                    && "java.lang.Integer" !== propertyClass) {
                    vm.filterForEdit.propertyClass = propertyClass;
                }
            }

            vm.filterForEdit.parameters = {};
        });
    }


}]);
