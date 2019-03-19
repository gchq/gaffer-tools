/*
 * Copyright 2018-2019 Crown Copyright
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

angular.module('app').component('analytics', analytics())

function analytics() {
    return {
        templateUrl: 'app/analytics/analytics.html',
        controller: AnalyticsController,
        controllerAs: 'ctrl',
        bindings: {
            model: '=',
        }
    }   
}

function AnalyticsController(navigation) {

    var vm = this;
    vm.analytics = ["Get Adjacent Ids","Get All Elements","frequent-vehicles-in-region"];

    /**
     * Sets the previously run queries on initialisation
     */
    vm.$onInit = function() {
        //vm.analytics = analytics.getAnalytics();
    }

    /**
     * Resets the operation chain builder and navigates to it
     */
}
