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

angular.module('app').component('namedViews', namedViews());

function namedViews() {
    return {
        templateUrl: 'app/query/view-builder/named-views/named-views.html',
        controller: NamedViewsController,
        controllerAs: 'ctrl'
    }
}

function NamedViewsController(view) {
    var vm = this;

    vm.availableNamedViews;
    vm.selectedNamedViews = view.getNamedViews();
    vm.namedViewSearchTerm = null;
    vm.selectedNamedView;
    vm.label = ""

    var populateNamedViews = function(availableNamedViews) {
        vm.availableNamedViews = availableNamedViews
    }

    vm.$onInit = function() {
        view.shouldLoadNamedViewsOnStartup().then(function(yes) {
            if (yes) {
                view.reloadNamedViews().then(populateNamedViews);
            } else {
                populateNamedViews(view.getAvailableNamedViews())
            }
        });
    }

    vm.search = function(text) {
        var results = text ? vm.availableNamedViews.filter(createFilterFor(text)) : vm.availableNamedViews;
        return results
    }

    vm.refreshNamedViews = function() {
        view.reloadNamedViews(true).then(function(availableNamedViews) {
            vm.availableNamedViews = availableNamedViews;
        });
    }

    vm.deleteFilter = function(index) {
        vm.selectedNamedViews.splice(index, 1);
        view.setNamedViews(vm.selectedNamedViews);
    }

    vm.updateModel = function() {
        if (vm.selectedNamedView) {
            vm.selectedNamedViews.push(angular.copy(vm.selectedNamedView));
            view.setNamedViews(vm.selectedNamedViews);
            vm.namedViewSearchTerm = '';
            angular.element(document.querySelector('#named-views-autocomplete')).blur();
        }
    }

    vm.namedViewHasParams = function(namedView) {
        return namedView && namedView.parameters && Object.keys(namedView.parameters).length > 0;
    }

    vm.namedViewHasNoParams = function(namedView) {
        return namedView && (!namedView.parameters || Object.keys(namedView.parameters).length === 0);
    }

    vm.createNamedViewsLabel = function(selectedNamedViews) {
        if (!selectedNamedViews || selectedNamedViews.length === 0) {
            return 'Select predefined filters';
        } else {
            if(selectedNamedViews.length == 1) {
                return selectedNamedViews[0].name;
            }
            return selectedNamedViews.reduce(function(a,b){return a.name + ", " + b.name})
        }
    }

    var createFilterFor = function(text) {
        var lowercaseText = angular.lowercase('' + text);
        return function filterFn(namedView) {
            return  (angular.lowercase(namedView.name).indexOf(lowercaseText) >= 0 ||
            angular.lowercase(namedView.description).indexOf(lowercaseText) >= 0);
        }
    }
}