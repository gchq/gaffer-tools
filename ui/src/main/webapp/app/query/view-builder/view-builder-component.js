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

function ViewBuilderController(queryPage, graph, common, schema, functions) {
    var vm = this;

    vm.relatedEntities = graph.getRelatedEntities();
    vm.relatedEdges = graph.getRelatedEdges();
    vm.expandEdges = queryPage.expandEdges;
    vm.expandEntities = queryPage.expandEntities;
    vm.expandEdgesContent = queryPage.expandEdgesContent;
    vm.expandEntitiesContent = queryPage.expandEntitiesContent;

    graph.onRelatedEntitiesUpdate(function(relatedEntities) {
        vm.relatedEntities = relatedEntities;
    });

    graph.onRelatedEdgesUpdate(function(relatedEdges) {
        vm.relatedEdges = relatedEdges;
    });

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


    vm.onSelectedPropertyChange = function(group, selectedElement) {
        functions.getFunctions(group, selectedElement.property, function(data) {
            selectedElement.availableFunctions = data;
        });
        selectedElement.predicate = '';
    }

    vm.onSelectedFunctionChange = function(group, selectedElement) {
        functions.getFunctionParameters(selectedElement.predicate, function(data) {
            selectedElement.availableFunctionParameters = data;
        });

        var gafferSchema = schema.get();

        var elementDef = gafferSchema.entities[group];
        if(!elementDef) {
             elementDef = gafferSchema.edges[group];
        }
        var propertyClass = gafferSchema.types[elementDef.properties[selectedElement.property]].class;
        if("java.lang.String" !== propertyClass
            && "java.lang.Boolean" !== propertyClass
            && "java.lang.Integer" !== propertyClass) {
            selectedElement.propertyClass = propertyClass;
        }

        selectedElement.parameters = {};
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