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

'use strict'

angular.module('app').factory('settings', function() {
    var settings = {};

    var resultLimit = 100;
    var defaultOp = "uk.gov.gchq.gaffer.operation.impl.get.GetElements";

    settings.getResultLimit = function() {
        return resultLimit;
    }

    settings.setResultLimit = function(limit) {
        resultLimit = limit;
    }

    settings.getDefaultOp = function() {
        return defaultOp;
    }

    settings.setDefaultOp = function(op) {
        defaultOp = op;
    }

    return settings;
});