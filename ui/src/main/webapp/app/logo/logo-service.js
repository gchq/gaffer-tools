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

angular.module('app').factory('logo', ['properties', '$q', 'config', 'common', function(properties, $q, config, common) {
    var service = {};

    var logo;

    service.get = function() {
        var defer = $q.defer();
        if (logo) {
            defer.resolve(logo);
        } else {
            load(defer);
        }

        return defer.promise;
    }

    var load = function(defer) {
        config.get().then(function(conf) {
            properties.get().then(function(props) {
                if (!props['gaffer.properties.app.logo.src']) {
                    defer.resolve(null);
                } else {
                    var srcPrefix = common.parseUrl(conf.restEndpoint).replace(/\/$/, ''); // remove trailing slash
                    srcPrefix = srcPrefix.substring(0, srcPrefix.lastIndexOf('/'));
                    logo = srcPrefix + '/' + props['gaffer.properties.app.logo.src'];
                    defer.resolve(logo);
                }
            });

        });
    }

    return service;
}]);
