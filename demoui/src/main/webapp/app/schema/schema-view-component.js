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

angular.module('app').component('schemaView', schemaViewController());

function schemaViewController() {
    return {
        templateUrl: 'app/schema/schema-view.html',
        controller: SchemaViewController,
        controllerAs: 'ctrl'
    };
}

function SchemaViewController(schemaView, schema) {
    var vm = this;
    vm.$onInit = function() {
        schema.get().then(function(gafferSchema) {
            schemaView.load().then(function(cy) {
                schemaView.reload(gafferSchema);
            });
        },
        function(err) {
            schemaView.load();
        });
    }
}
