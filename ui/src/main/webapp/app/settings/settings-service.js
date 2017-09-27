/*
 * Copyright 2016-2017 Crown Copyright
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

(function() {

    'use strict'

    angular.module('app').factory('settingsService', settingsService);


    function settingsService() {

        return {
             getResultLimit: getResultLimit,
             setResultLimit: setResultLimit,
             getRestUrl: getRestUrl,
             setRestUrl: setRestUrl,
             getDefaultOp: getDefaultOp,
             setDefaultOp: setDefaultOp,
        }

        var resultLimit = 100;
        var restUrl = window.location.origin + "/rest/latest"
        var defaultOp = "uk.gov.gchq.gaffer.operation.impl.get.GetElements"

        function getResultLimit() {
            return resultLimit
        }

        function setResultLimit(limit) {
            resultLimit = limit
        }

        function getRestUrl() {
            return restUrl
        }

        function setRestUrl(url) {
            restUrl = url
        }

        function getDefaultOp() {
            return defaultOp
        }

        function setDefaultOp(op) {
            defaultOp = op
        }


        function defaultShortValue(value) {
            return JSON.stringify(value);
        };
    }

})()
