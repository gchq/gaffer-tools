/*
 * Copyright 2017-2018 Crown Copyright
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

var app = angular.module('app');

app.filter('schemaGroupFilter', function() {
    return function(input, search) {
        if(!input) {
            return input;
        }
        if (!search) {
            return input;
        }
        var lowercaseSearch = search ? search.toLowerCase() : '';
        var result = {};

        angular.forEach(input, function(info, group) {
            var lowercaseGroup = group.toLowerCase();
            var lowerCaseDescription = info.description ? info.description.toLowerCase() : '';
            if (lowercaseGroup.indexOf(lowercaseSearch) !== -1) {
                result[group] = info;
            } else if (lowerCaseDescription.indexOf(lowercaseSearch) !== -1) {
                result[group] = info;
            }
        });

        return result;
    }
});


app.component('viewBuilder', viewBuilder());

function viewBuilder() {
    return {
        templateUrl: 'app/query/view-builder/view-builder.html',
        controller: ViewBuilderController,
        controllerAs: 'ctrl'
    }
}

function ViewBuilderController(view, graph, common, schema, functions, events, types, $mdDialog) {
    var vm = this;

    vm.schemaEntities;
    vm.schemaEdges;
    vm.viewEdges = view.getViewEdges();
    vm.viewEntities = view.getViewEntities();
    vm.edgeFilters = view.getEdgeFilters();
    vm.entityFilters = view.getEntityFilters();

    vm.showBuilder = false;

    vm.makeVisible = function() {
        vm.showBuilder = true;
    }

    vm.clear = function() {
        vm.edgeFilters = {};
        vm.entityFilters = {};
        vm.viewEdges = [];
        vm.viewEntities = [];
        view.setViewEdges(vm.viewEdges);
        view.setViewEntities(vm.viewEntities);
        vm.showBuilder = false;
    }

    vm.$onInit = function() {
        schema.get().then(function(gafferSchema) {
            vm.schemaEdges = gafferSchema.edges;
            vm.schemaEntities = gafferSchema.entities;
        });

        angular.element(document).find('.search-box').on('keydown', function(ev) {
            ev.stopPropagation();
        });

        vm.showBuilder = (vm.viewEdges.length + vm.viewEntities.length) > 0;
    }

    vm.noMore = function(group) {
        var validEdges = [];

        for (var i in vm.viewEdges) {
            var edge = vm.viewEdges[i];
            if (vm.getEdgeProperties(edge)) {
                validEdges.push(edge);
            }
        }

        if (validEdges.indexOf(group) === -1) { // group is an entity
            if (validEdges.length > 0) {
                return false;
            }
            var validEntities = [];

            for (var i in vm.viewEntities) {
                var entity = vm.viewEntities[i];
                if (vm.getEntityProperties(entity)) {
                    validEntities.push(entity);
                }
            }

            return validEntities.indexOf(group) === validEntities.length - 1;
        }

        return validEdges.indexOf(group) === validEdges.length - 1;
    }

    vm.createViewElementsLabel = function(elements, type) { // type is 'entities' or 'elements'
        if (!elements || elements.length === 0) {
            if (!type) {
                throw 'Cannot create label without either the elements or element type';
            }
            return 'Only include these ' + type;
        } else {
            return elements.join(', ');
        }
    }

    vm.createFilterLabel = function(filter) {
        var label = filter.property + ' ';
        var simpleName = filter.predicate.split('.').pop();
        label += simpleName;

        for (var param in filter.parameters) {

            var shortVal = types.getShortValue(types.createValue(filter.parameters[param].valueClass, filter.parameters[param].parts));
            if(shortVal !== undefined) {
                label += ' ' + param + "=" + shortVal;
            }
        }

        if (filter.preAggregation) {
            label += ' before being summarised';
        } else {
            label += ' after being summarised';
        }

        return label;

    }

    vm.editFilter = function(group, elementType, filter, index) {
        vm.tmpIndex = index;

        $mdDialog.show({
            templateUrl: 'app/query/view-builder/custom-filter-dialog/custom-filter-dialog.html',
            controller: 'CustomFilterDialogController',
            locals: {
                group: group,
                elementType: elementType,
                onSubmit: replaceFilterFunction,
                filterForEdit: angular.copy(filter)
            },
            bindToController: true,
            clickOutsideToClose: false
        });
    }

    var getFilters = function(group, elementType) {
        if (elementType === 'edge') {
            if (!vm.edgeFilters[group]) {
                vm.edgeFilters[group] = []
            }
            return vm.edgeFilters[group];
        } else if (elementType === 'entity') {
            if (!vm.entityFilters[group]) {
                vm.entityFilters[group] = []
            }
            return vm.entityFilters[group];
        } else {
            console.error('Unrecognised element type ' + elementType);
            return [];
        }

    }

    vm.deleteFilter = function(group, elementType, index) {
        var filters = getFilters(group, elementType)
        filters.splice(index, 1);
    }


    vm.addFilters = function(ev, group, elementType) {
        $mdDialog.show({
            templateUrl: 'app/query/view-builder/custom-filter-dialog/custom-filter-dialog.html',
            controller: 'CustomFilterDialogController',
            locals: {
                group: group,
                elementType: elementType,
                onSubmit: addFilterFunction
            },
            bindToController: true,
            clickOutsideToClose: false,
            targetEvent: ev
        });
    }

    vm.getEntityProperties = function(group) {
        return schema.getEntityProperties(group);
    }

    vm.getEdgeProperties =  function(group) {
        return schema.getEdgeProperties(group);
    }

    vm.onElementGroupChange = function(elementType) {
        if(elementType === 'entity') {
            view.setViewEntities(vm.viewEntities);
            vm.entitySearchTerm = '';
        } else if (elementType === 'edge') {
            view.setViewEdges(vm.viewEdges);
            vm.edgeSearchTerm = '';
        }
    }

    var replaceFilterFunction = function(filter, group, elementType) {
        var filters = getFilters(group, elementType);
        filters.splice(vm.tmpIndex, 1, filter);
    }

    var addFilterFunction = function(filter, group, elementType) {
        var filters = getFilters(group, elementType);
        filters.push(filter);
    }

}
