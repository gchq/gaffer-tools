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

angular.module('app').factory('common', function() {

    var common = {};

    common.endsWith = function(str, suffix) { // to support ES5
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }

    common.startsWith = function(str, prefix) { // to support ES5
        return str.indexOf(prefix) === 0;
    }

    common.parseVertex = function(vertex) {
        if(typeof vertex === 'string' || vertex instanceof String) {
            vertex = "\"" + vertex + "\"";
        }

        if (vertex !== null && typeof vertex === 'object') {
            vertex = JSON.stringify(vertex);
        }

        return vertex;
    }

    common.parseUrl = function(url) {
        if(!common.startsWith(url, "http")) {
            url = "http://" + url;
        }

        return url;
    }

    common.objectContainsValue = function(obj, value) {
        return obj && value in obj;
    }

    common.arrayContainsValue = function(arr, value) {
        return arr && arr.indexOf(value) !== -1;
    }

    common.arrayContainsObject = function(arr, obj) {
        if (!arr || !obj) {
            return false;
        }
        for (var i in arr) {
            if (angular.equals(arr[i], obj)) {
                return true;
            }
        }
        return false;
    }

    common.arrayContainsObjectWithValue = function(arr, property, value) {
        return indexOfObjectWithValue(arr, property, value) !== -1;
    }

    var indexOfObjectWithValue = function(arr, property, value) {
        for(var i = 0; i < arr.length; i++) {
            if (arr[i] !== undefined && arr[i] !== null && arr[i][property] === value) return i;
        }
        return -1;
    }

    return common;
});