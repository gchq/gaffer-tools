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

angular.module('app').component('viewBuilder', viewBuilder());

function viewBuilder() {
    return {
        templateUrl: 'app/query/view-builder/view-builder.html',
        controller: ViewBuilderController,
        controllerAs: 'ctrl'
    }
}

function ViewBuilderController(queryPage, graph, common, schema, functions, events) {
    var vm = this;

    vm.schemaEntities;
    vm.schemaEdges;
    vm.expandEdges = queryPage.expandEdges;
    vm.expandEntities = queryPage.expandEntities;
    vm.expandEdgesContent = queryPage.expandEdgesContent;
    vm.expandEntitiesContent = queryPage.expandEntitiesContent;

    vm.$onInit = function() {
        schema.get().then(function(gafferSchema) {
            vm.schemaEdges = Object.keys(gafferSchema.edges);
            vm.schemaEntities = Object.keys(gafferSchema.entities);
        });
    }

    vm.getEntityProperties = schema.getEntityProperties;
    vm.getEdgeProperties = schema.getEdgeProperties;
    vm.exists = common.arrayContainsValue;

    vm.toggle = function(item, list) {
        var idx = list.indexOf(item);
        if(idx > -1) {
            list.splice(idx, 1);
        } else {
            list.push(item);
        }
    }

    vm.onSelectedPropertyChange = function(group, filter) {
        functions.getFunctions(group, filter.property, function(data) {
            filter.availableFunctions = data;
        });
        filter.predicate = '';
    }

    vm.onSelectedFunctionChange = function(group, filter) {
        functions.getFunctionParameters(filter.predicate, function(data) {
            filter.availableFunctionParameters = data;
        });

        schema.get().then(function(gafferSchema) {
            var elementDef;
            if (gafferSchema.entities) {
                elementDef = gafferSchema.entities[group];
            }
            if(!elementDef && gafferSchema.edges) {
                 elementDef = gafferSchema.edges[group];
            }
            if (gafferSchema.types) {
                var propertyClass = gafferSchema.types[elementDef.properties[filter.property]].class;
                if("java.lang.String" !== propertyClass
                    && "java.lang.Boolean" !== propertyClass
                    && "java.lang.Integer" !== propertyClass) {
                    filter.propertyClass = propertyClass;
                }
            }

            filter.parameters = {};
        });
    }

    vm.addFilterFunction = function(expandElementContent, element, isPreAggregation) {
        if(!expandElementContent[element]) {
            expandElementContent[element] = {};
        }

        if(!expandElementContent[element].filters) {
            expandElementContent[element].filters = {};
        }

        if (isPreAggregation) {
            if (!expandElementContent[element].filters.preAggregation) {
                expandElementContent[element].filters.preAggregation = [];
            }
            expandElementContent[element].filters.preAggregation.push({});

        } else {
            if (!expandElementContent[element].filters.postAggregation) {
                expandElementContent[element].filters.postAggregation = [];
            }
            expandElementContent[element].filters.postAggregation.push({});
        }
    }

}