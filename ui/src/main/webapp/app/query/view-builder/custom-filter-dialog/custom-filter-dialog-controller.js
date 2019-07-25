/*
 * Copyright 2017-2019 Crown Copyright
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

angular.module('app').controller('CustomFilterDialogController', ['$scope', '$mdDialog', 'schema', 'functions', 'types', 'error', function($scope, $mdDialog, schema, functions, types, error) {

    $scope.filter = { preAggregation: false }
    $scope.availablePredicates;
    $scope.predicateText;
    $scope.editMode = false;
    $scope.elementType = this.elementType;
    $scope.group = this.group;
    $scope.filterForEdit = this.filterForEdit;
    $scope.onSubmit = this.onSubmit;


    $scope.schema = {entities:{}, edges:{}, types:{}};

    schema.get().then(function(gafferSchema) {
        $scope.schema = gafferSchema;
        if ($scope.filterForEdit) {
            $scope.filter.preAggregation = $scope.filterForEdit.preAggregation;
            $scope.filter.property = $scope.filterForEdit.property;
            $scope.onSelectedPropertyChange(true);
            $scope.filter.predicate = $scope.filterForEdit.predicate;
            $scope.filter.parameters = $scope.filterForEdit.parameters;
            $scope.onSelectedPredicateChange();
            $scope.editMode = true;
        }
    });

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

    $scope.getPropertySelectLabel = function() {
        if ($scope.filter.property) {
            return $scope.filter.property;
        }
        return "Select a property";
    }

    $scope.resetForm = function() {
        $scope.filter = { preAggregation: false };
        $scope.filterForm.$setUntouched(true);
    }

    $scope.cancel = function() {
        $mdDialog.cancel();
    }

    $scope.submit = function() {
        for (var param in $scope.filter.parameters) {
            if ($scope.filter.parameters[param]['valueClass'] === 'JSON') {
                try {
                    JSON.parse($scope.filter.parameters[param]['parts'][undefined]);
                } catch(err) {
                    error.handle('Failed to parse ' + param + ' as a JSON object');
                    return;
                }
            }
        }
        $scope.onSubmit($scope.filter, $scope.group, $scope.elementType);
        $mdDialog.hide()
    }

    $scope.addAnother = function() {
        $scope.onSubmit($scope.filter, $scope.group, $scope.elementType)
        $scope.resetForm();
    }

    $scope.getFlexValue = function(valueClass) {
        if ($scope.hasMultipleTypesAvailable(valueClass)) {
            return 100;
        } else {
            return 50;
        }
    }

    $scope.availableTypes = function(className) {
        if(types.isKnown(className)) {
            var rtn = {};
            rtn[className.split('.').pop()] = className;
            return rtn;
        }

        var allTypes = types.getSimpleClassNames();

        var allClasses = {};

        for (var simpleName in allTypes) {
            if (!(simpleName.toLowerCase() === simpleName)) {
                allClasses[simpleName] = allTypes[simpleName];
            }
        }

        return allClasses;
    }

    $scope.updateType = function(param) {
        if(param !== undefined && param !== null) {
            var parts = param['parts'];

            if (parts !== undefined && Object.keys(parts).length === 1 && parts[undefined] !== undefined) {    // if it's simple
                var oldValue = parts[undefined];
                var newFields = types.getFields(param.valueClass);
                if (newFields.length === 1) {
                    var newJSType = newFields[0].type;
                    if (((newJSType === 'text' || newJSType === 'textarea') && (typeof oldValue === 'string' || oldValue instanceof String)) || (newJSType === 'number' && typeof oldValue === 'number')) {
                        return;
                    }
                }
            }
            param['parts'] = {};
        }
    }

    $scope.hasMultipleTypesAvailable = function(className) {
        return !types.isKnown(className);
    }

    $scope.onSelectedPropertyChange = function(editModeInit) {
        if (!editModeInit) {
            $scope.filter.predicate = '';
        }
        if (!$scope.group || !$scope.filter.property) {
            return;
        }
        var type;

        if($scope.schema.entities[$scope.group]) {
            type = $scope.schema.entities[$scope.group].properties[$scope.filter.property];
        } else if($scope.schema.edges[$scope.group]) {
           type = $scope.schema.edges[$scope.group].properties[$scope.filter.property];
        } else {
            console.error('The element group "' + $scope.group + '" does not exist in the schema');
            return;
        }

        var className = "";
        if(type) {
            var schemaType = $scope.schema.types[type];
            if (!schemaType) {
                console.error('No type "' + type + '" was found in the schema');
                return;
            }
            className = $scope.schema.types[type].class;
        } else {
            console.error('The property "' + $scope.filter.property + '" does not exist in the element group "' + $scope.group + '"');
            return;
        }
        functions.getFunctions(className, function(data) {
            $scope.availablePredicates = data;
        });
    }

    var setToPropertyClass = function(parameter) {
        var elementDef = $scope.schema.entities[$scope.group];
        if(!elementDef) {
             elementDef = $scope.schema.edges[$scope.group];
        }
        if ($scope.schema.types) {
            var propertyClass = $scope.schema.types[elementDef.properties[$scope.filter.property]].class;
            $scope.filter.parameters[parameter]['valueClass'] = propertyClass;
        }
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

                if(!$scope.filter.parameters[param]["valueClass"]) {
                    var availableTypes = $scope.availableTypes(data[param]);
                    if(Object.keys(availableTypes).length == 1) {
                        $scope.filter.parameters[param]['valueClass'] = availableTypes[Object.keys(availableTypes)[0]];
                    } else {
                        setToPropertyClass(param);
                    }
                }
            }
        });
    }
}]);
