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

angular.module('app').component('schemaView', schemaViewView());

function schemaViewView() {
    return {
        templateUrl: 'app/graph/schema-view.html',
        controller: SchemaViewController,
        controllerAs: 'ctrl'
    };
}


function SchemaViewController($timeout, schemaView, schema) {
    var vm = this;
    vm.schema = {edges:{}, entities:{}};
    vm.$onInit = function() {

        schema.get().then(function(gafferSchema) {
            vm.schema = gafferSchema;
            $timeout(function(evt) {
                schemaView.load().then(function(cy) {
                    schemaView.reload(gafferSchema);
                })
            });
        });
    }
}