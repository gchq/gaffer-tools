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

var app = angular.module('app');

app.filter('schemaGroupFilter', function() {
    return function(input, search) {
        if(!input) {
            return input;
        }
        if (!search) {
            return input;
        }
        var lowercaseSearch = ('' + search).toLowerCase();
        var result = {};

        angular.forEach(input, function(info, group) {
            var lowercaseGroup = group.toLowerCase();
            var lowerCaseDescription = info.description.toLowerCase();
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
    vm.viewEdges = angular.copy(view.getViewEdges());
    vm.viewEntities = angular.copy(view.getViewEntities());
    vm.edgeFilters = view.getEdgeFilters();
    vm.entityFilters = view.getEntityFilters();

    vm.$onInit = function() {
        schema.get().then(function(gafferSchema) {
            vm.schemaEdges = gafferSchema.edges;
            vm.schemaEntities = gafferSchema.entities;
        });

        angular.element(document).find('.search-box').on('keydown', function(ev) {
            ev.stopPropagation();
        });
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

    vm.createFilterLabel = function(filter, preAggregation) {
        var label = filter.selection[0] + ' ';
        var classParts = filter.predicate.class.split('.');
        var simpleName = classParts[classParts.length - 1];
        label += simpleName;

        for (var field in filter.predicate) {
            if (field === 'class') {
                continue;
            }
            var shortVal = types.getShortValue(filter.predicate[field]);
            if(shortVal !== undefined) {
                label += (' ' + field + "=" + types.getShortValue(filter.predicate[field]));
            }
        }

        if (preAggregation) {
            label += ' before being summarised';
        } else {
            label += ' after being summarised';
        }

        return label;

    }

    vm.editFilter = function(group, elementType, preAggregation, filter, index) {
        var filterForEdit = {
            preAggregation: preAggregation,
            property: filter.selection[0],
            predicate: filter.predicate.class,
            parameters: {}
        }
        for (var field in filter.predicate) {
            if (field === 'class') {
                continue;
            }

            filterForEdit.parameters[field] = filter.predicate[field];
        }

        vm.tmpPreAggregation = preAggregation;
        vm.tmpIndex = index;

        $mdDialog.show({
            templateUrl: 'app/query/view-builder/custom-filter-dialog/custom-filter-dialog.html',
            controller: 'CustomFilterDialogController',
            locals: {
                group: group,
                elementType: elementType,
                onSubmit: replaceFilterFunction,
                filterForEdit: filterForEdit
            },
            bindToController: true,
            clickOutsideToClose: false
        });
    }

    var getFilterArray = function(group, elementType, preAggregation) {
        if (elementType === 'edge') {
            if (preAggregation === true) {
                return vm.edgeFilters[group].preAggregationFilterFunctions;
            } else {
                return vm.edgeFilters[group].postAggregationFilterFunctions;
            }
        } else {
            if (preAggregation === true) {
                return vm.entityFilters[group].preAggregationFilterFunctions;
            } else {
                return vm.entityFilters[group].postAggregationFilterFunctions;
            }
        }
    }

    var deleteFilterArray = function(group, elementType, preAggregation) {
        if (elementType === 'edge') {
            if (preAggregation === true) {
                vm.edgeFilters[group].preAggregationFilterFunctions = undefined;
            } else {
                vm.edgeFilters[group].postAggregationFilterFunctions = undefined;
            }
        } else {
            if (preAggregation === true) {
                vm.entityFilters[group].preAggregationFilterFunctions = undefined;
            } else {
                vm.entityFilters[group].postAggregationFilterFunctions = undefined;
            }
        }
    }

    vm.deleteFilter = function(group, elementType, preAggregation, index) {
        var filters = getFilterArray(group, elementType, preAggregation);
        filters.splice(index, 1);
        if (filters.length === 0) {
            deleteFilterArray(group, elementType, preAggregation);
        }
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

    var generateFilterFunction = function(filter) {
        var functionJson = {
            "predicate": {
                class: filter.predicate
            },
            "selection": [ filter.property ]
        }

        for(var paramName in filter.availableFunctionParameters) {
            if(filter.parameters[paramName] !== undefined) {
                var param;
                try {
                    param = JSON.parse(filter.parameters[paramName]);
                } catch(e) {
                    param = filter.parameters[paramName];
                }
                functionJson["predicate"][paramName] = types.createJsonValue(filter.parameters[paramName].valueClass, filter.parameters[paramName].parts);
            }
        }

        return functionJson;
    }

    var replaceFilterFunction = function(filter, group, elementType) {
        var filterArray = getFilterArray(group, elementType, vm.tmpPreAggregation);

        if (filter.preAggregation !== vm.tmpPreAggregation) {
            vm.deleteFilter(group, elementType, vm.tmpPreAggregation, vm.tmpIndex);
            addFilterFunction(filter, group, elementType);
            if (filterArray.length === 0) {
                if (elementType === 'edge') {
                    if (vm.tmpPreAggregation) {
                        vm.edgeFilters[group].preAggregationFilterFunctions = undefined;
                    } else {
                        vm.edgeFilters[group].postAggregationFilterFunctions = undefined;
                    }
                } else {
                    if (vm.tmpPreAggregation) {
                        vm.entityFilters[group].preAggregationFilterFunctions = undefined;
                    } else {
                        vm.entityFilters[group].postAggregationFilterFunctions = undefined;
                    }
                }
            }
        } else {
            filterArray[vm.tmpIndex] = generateFilterFunction(filter)
        }

        vm.tmpIndex = undefined;
        vm.tmpPreAggregation = undefined;
    }

    var addFilterFunction = function(filter, group, elementType) {

        if (!filter.predicate || !filter.property) {
            return;
        }

        var functionsToAddTo;
        if (elementType === 'edge') {
            if (!vm.edgeFilters[group]) {
                vm.edgeFilters[group] = {}
            }
            if (filter.preAggregation) {
                if (!vm.edgeFilters[group].preAggregationFilterFunctions) {
                    vm.edgeFilters[group].preAggregationFilterFunctions = [];
                }

                functionsToAddTo = vm.edgeFilters[group].preAggregationFilterFunctions;
            } else {
                if (!vm.edgeFilters[group].postAggregationFilterFunctions) {
                    vm.edgeFilters[group].postAggregationFilterFunctions = [];
                }

                functionsToAddTo = vm.edgeFilters[group].postAggregationFilterFunctions;
            }

        } else {
            if (!vm.entityFilters[group]) {
                vm.entityFilters[group] = {}
            }
            if (filter.preAggregation) {
                if (!vm.entityFilters[group].preAggregationFilterFunctions) {
                    vm.entityFilters[group].preAggregationFilterFunctions = [];
                }

                functionsToAddTo = vm.entityFilters[group].preAggregationFilterFunctions;
            } else {
                if (!vm.entityFilters[group].postAggregationFilterFunctions) {
                    vm.entityFilters[group].postAggregationFilterFunctions = [];
                }

                functionsToAddTo = vm.entityFilters[group].postAggregationFilterFunctions;
            }
        }

        var filterFunction = generateFilterFunction(filter);

        functionsToAddTo.push(filterFunction);
    }

}