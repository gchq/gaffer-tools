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

angular.module('app').config(['$mdIconProvider', function($mdIconProvider) {

    $mdIconProvider
        .icon('save', 'app/img/save.svg')
        .icon('info', 'app/img/info.svg')
        .icon('left-arrow', 'app/img/left-arrow.svg')
        .icon('up-arrow', 'app/img/up-arrow.svg')
        .icon('right-arrow', 'app/img/right-arrow.svg')
        .icon('down-arrow', 'app/img/down-arrow.svg')
        .icon('refresh', 'app/img/refresh.svg')
        .icon('add', 'app/img/add.svg')
        .icon('delete', 'app/img/delete.svg')
        .icon('query', 'app/img/query.svg')
        .icon('table', 'app/img/table.svg')
        .icon('graph', 'app/img/graph.svg')
        .icon('schema', 'app/img/schema.svg')
        .icon('raw', 'app/img/raw.svg')
        .icon('settings', 'app/img/settings.svg')
        .icon('sidenav', 'app/img/sidenav.svg')
        .icon('cancel', 'app/img/cancel.svg')
        .icon('restore', 'app/img/restore.svg')
        .icon('redraw', 'app/img/redraw.svg')
        .icon('expand-out', 'app/img/expand-out.svg')
        .icon('location-search', 'app/img/location-search.svg')
        .icon('clear-results', 'app/img/clear-results.svg')
        .icon('rerun', 'app/img/rerun.svg')
        .icon('edit', 'app/img/edit.svg');
}]);
