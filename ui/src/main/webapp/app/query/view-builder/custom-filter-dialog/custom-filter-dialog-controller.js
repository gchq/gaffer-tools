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

angular.module('app').controller('CustomFilterDialogController', ['$scope', '$mdDialog', 'schema', 'functions', function($scope, $mdDialog, schema, functions) {

    $scope.filter = { preAggregation: false }
    $scope.availablePredicates;
    $scope.predicateText;
    $scope.editMode = false;

    var createFilterFor = function(text) {
        var lowerCaseText = angular.lowercase(text);
        return function filterFn(predicate) {
            return angular.lowercase(predicate).indexOf(lowerCaseText) >= 0;
        }
    }

    $scope.search = function(text) {
        var results = text ? $scope.availablePredicates.filter( createFilterFor(text) ) : $scope.availablePredicates;
        return results;
    }

    $scope.createFriendlyName = function(javaClass) {
        var classParts = javaClass.split('.');
        return classParts[classParts.length - 1];
    }

    $scope.getProperties = function() {
        if ($scope.elementType === 'entity') {
            return schema.getEntityProperties($scope.group);
        } else {
            return schema.getEdgeProperties($scope.group);
        }
    }

    $scope.resetForm = function() {
        $scope.filter = { preAggregation: false };
        $scope.filterForm.$setUntouched(true);
        $scope.filter.availableFunctionParameters = [];
    }

    $scope.cancel = function() {
        $mdDialog.cancel();
    }

    $scope.submit = function() {
        $scope.onSubmit($scope.filter, $scope.group, $scope.elementType);
        $mdDialog.hide()
    }

    $scope.addAnother = function() {
        $scope.onSubmit($scope.filter, $scope.group, $scope.elementType)
        $scope.resetForm();
    }

    $scope.getFlexValue = function() {
        var value = 33;
        if ($scope.filter.availableFunctionParameters.length % 2 === 0) {
            value = 50;
        } else if ($scope.filter.availableFunctionParameters.length === 1) {
            value = 100;
        }

        return value;
    }

    $scope.onSelectedPropertyChange = function(editModeInit) {
        functions.getFunctions($scope.group, $scope.filter.property, function(data) {
            $scope.availablePredicates = data;
        });
        if (!editModeInit) {
            $scope.filter.predicate = '';
        }
    }

    $scope.onSelectedPredicateChange = function() {
        if ($scope.filter.predicate === undefined || $scope.filter.predicate === '' || $scope.filter.predicate === null) {
            return;
        }
        functions.getFunctionParameters($scope.filter.predicate, function(data) {
            $scope.filter.availableFunctionParameters = data;
        });

        schema.get().then(function(gafferSchema) {
            var elementDef;
            if (gafferSchema.entities) {
                elementDef = gafferSchema.entities[$scope.group];
            }
            if(!elementDef && gafferSchema.edges) {
                 elementDef = gafferSchema.edges[$scope.group];
            }
            if (gafferSchema.types) {
                var propertyClass = gafferSchema.types[elementDef.properties[$scope.filter.property]].class;
                if("java.lang.String" !== propertyClass
                    && "java.lang.Boolean" !== propertyClass
                    && "java.lang.Integer" !== propertyClass) {
                    $scope.filter.propertyClass = propertyClass;
                }
            }
        });

        $scope.filter.parameters = {};
    }

    if ($scope.filterForEdit) {
        $scope.filter.preAggregation = $scope.filterForEdit.preAggregation;
        $scope.filter.property = $scope.filterForEdit.property;
        $scope.onSelectedPropertyChange(true);
        $scope.filter.predicate = $scope.filterForEdit.predicate;
        $scope.onSelectedPredicateChange();
        for(var name in $scope.filterForEdit.parameters) {
            var param = $scope.filterForEdit.parameters[name];
            if(typeof param === 'string' || param instanceof String) {
                $scope.filter.parameters[name] = param;
            } else {
                $scope.filter.parameters[name] = JSON.stringify(param)
            }
        }
        $scope.editMode = true;
    }


}]);
