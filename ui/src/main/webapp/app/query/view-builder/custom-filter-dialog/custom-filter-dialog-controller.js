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

angular.module('app').controller('CustomFilterDialogController', ['$scope', '$mdDialog', 'schema', 'functions', 'types', function($scope, $mdDialog, schema, functions, types) {

    $scope.filter = { preAggregation: false }
    $scope.availablePredicates;
    $scope.predicateText;
    $scope.editMode = false;

    $scope.elementType = this.elementType;
    $scope.group = this.group;
    $scope.filterForEdit = this.filterForEdit;
    $scope.onSubmit = this.onSubmit;

    $scope.propertyClass = undefined;


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
        } else if ($scope.elementType === 'edge') {
            return schema.getEdgeProperties($scope.group);
        } else throw 'Element type can be "edge" or "entity" but not ' + JSON.stringify($scope.elementType)
    }

    $scope.resetForm = function() {
        $scope.filter = { preAggregation: false };
        $scope.filterForm.$setUntouched(true);
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
        if (!$scope.filter || !$scope.filter.availableFunctionParameters) {
            return 0;
        }

        var numParams = Object.keys($scope.filter.availableFunctionParameters).length;
        if (numParams === 2) {
            return 50;
        } else if (numParams === 1) {
            return 100;
        }

        return 33;
    }

    $scope.availableTypes = function(className) {
        if(types.isKnown(className)) {
            var rtn = {};
            rtn[className.split('.').pop()] = className;
            return rtn;
        }

        return types.getSimpleClassNames();
    }

    $scope.updateType = function(param) {
        if(param !== undefined) {
            param['parts'] = {};
        }
    }

    $scope.hasMultipleTypesAvailable = function(className) {
        return !types.isKnown(className);
    }

    $scope.onSelectedPropertyChange = function(editModeInit) {
        functions.getFunctions($scope.group, $scope.filter.property, function(data) {
            $scope.availablePredicates = data;
        });
        if (!editModeInit) {
            $scope.filter.predicate = '';
        }
    }

    $scope.showWarning = function() {
        return $scope.propertyClass &&
            $scope.filter &&
            $scope.filter.availableFunctionParameters &&
            Object.keys($scope.filter.availableFunctionParameters).length !== 0;
    }

    $scope.onSelectedPredicateChange = function() {
        if ($scope.filter.predicate === undefined || $scope.filter.predicate === '' || $scope.filter.predicate === null) {
            return;
        }
        functions.getFunctionParameters($scope.filter.predicate, function(data) {
            $scope.filter.availableFunctionParameters = data;
            if($scope.filter.parameters === undefined) {
                $scope.filter.parameters = {}
            } else {
                for(var param in $scope.filter.parameters) {
                    if(!(param in data)){
                        delete $scope.filter.parameters[param];
                    }
                }
            }

            for(var param in data) {
                if(!(param in $scope.filter.parameters && $scope.filter.parameters[param] !== undefined)) {
                    $scope.filter.parameters[param] = {};
                }

                if(!("valueClass" in $scope.filter.parameters[param])) {
                    var availableTypes = $scope.availableTypes(data[param]);
                    if(Object.keys(availableTypes).length == 1) {
                        $scope.filter.parameters[param]['valueClass'] = types.getClassName(Object.keys(availableTypes)[0]);
                    } else {
                        $scope.filter.parameters[param]['valueClass'] = types.getClassName($scope.propertyClass);
                    }
                }
            }
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
                    $scope.propertyClass = propertyClass;
                } else {
                    $scope.propertyClass = undefined;
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
            var valueClass;
            var value;
            if(param !== undefined && Object.keys(param).length === 1) {
                valueClass = types.getClassName(Object.keys(param)[0]);
                value = Object.values(param)[0];
                if(valueClass === undefined) {
                    valueClass = "JSON";
                    value = JSON.stringify(param);
                }
            } else {
                valueClass = undefined;
                value = param;
            }

            $scope.filter.parameters[name] = {
                "parts": types.createParts(valueClass, value)
            };

            if(valueClass !== undefined) {
                $scope.filter.parameters[name]["valueClass"] = valueClass;
            }
        }
        $scope.editMode = true;
    }

}]);
