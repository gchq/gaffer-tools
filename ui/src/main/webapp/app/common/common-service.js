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

'use strict'

/**
 * Library of common code - used for compatability with certain browsers and to reduce
 * code duplication.
 */
angular.module('app').factory('common', function() {

    var common = {};

    /**
     * Checks whether a string ends with a given suffix
     * @param {String} str The string to test
     * @param {String} suffix The ending you want to check against
     */
    common.endsWith = function(str, suffix) { // to support ES5
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }

    /**
     * Checks whether a string starts with a given prefix
     * @param {String} str The string to test
     * @param {String} prefix The prefix you want to check against
     */
    common.startsWith = function(str, prefix) { // to support ES5
        return str.indexOf(prefix) === 0;
    }

    /**
     * Converts a vertex into a string.
     * @param {*} vertex
     */
    common.parseVertex = function(vertex) {
        if(typeof vertex === 'string' || vertex instanceof String) {
            return "\"" + vertex + "\"";
        }

        if (vertex != null) {
            return JSON.stringify(vertex);
        }

        return vertex;
    }

    /**
     * Appends http:// to a url if not specified. This will not
     * overwrite if a user specifies they want to use https
     * @param {String} url
     */
    common.parseUrl = function(url) {
        if(!common.startsWith(url, "http")) {
            url = "http://" + url;
        }

        return url;
    }

    /**
     * Checks whether an object contains a value as a key
     * @param {Object} obj
     * @param {String or Number} value
     */
    common.objectContainsValue = function(obj, value) {
        return obj && value in obj;
    }

    /**
     * Checks whether a string or number is contained within array
     * This will not work if the value is an object
     * @param {Array} arr
     * @param {String or Number} value
     */
    common.arrayContainsValue = function(arr, value) {
        return arr && arr.indexOf(value) !== -1;
    }

    /**
     * Checks whether an object is contained within an array.
     * This is not fast and if possible, use the arrayContainsObjectWithValue or
     * arrayContainsValue if you know a property that can be used as a key
     * or if the value is not an object
     * @param {Array} arr
     * @param {Object} obj
     */
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

    /**
     * Checks whether an array contains an object with a given key, value pair
     * @param {Array} arr
     * @param {String} property
     * @param {*} value
     */
    common.arrayContainsObjectWithValue = function(arr, property, value) {
        return indexOfObjectWithValue(arr, property, value) !== -1;
    }

    /**
    * Adds the item to the list if it is not already in the list.
    * @param {*} item the item to add to the list
    * @param {Array} list
    */
    common.pushValueIfUnique = function(item, list) {
        if(list && !common.arrayContainsValue(list, item)) {
            list.push(item);
        }
    }

    /**
    * Adds the item to the list if it is not already in the list, uses arrayContainsObject.
    * @param {*} item the item to add to the list
    * @param {Array} list
    */
    common.pushObjectIfUnique = function(item, list) {
        if(list && !common.arrayContainsObject(list, item)) {
            list.push(item);
        }
    }

    /**
    * Adds all the items to the list if they are not already in the list.
    * @param {Array} items the items to add to the list
    * @param {Array} list
    */
    common.pushValuesIfUnique = function(items, list) {
        if(list && items) {
            for(var i in items) {
                common.pushValueIfUnique(items[i], list);
            }
        }
    }

    /**
    * Adds all the items to the list if they are not already in the list, uses arrayContainsObject.
    * @param {Array} items the items to add to the list
    * @param {Array} list
    */
    common.pushObjectsIfUnique = function(items, list) {
        if(list && items) {
            for(var i in items) {
                common.pushObjectIfUnique(items[i], list);
            }
        }
    }

    /**
    * Concatenates to lists together and deduplicates the result list.
    * @param {Array} list1
    * @param {Array} list2
    */
    common.concatUniqueValues = function(list1, list2) {
        if(!list1) {
            return angular.copy(list2);
        }

        if(!list2) {
            return angular.copy(list1);
        }

        var concatList = angular.copy(list1);
        common.pushValuesIfUnique(list2, concatList);
        return concatList
    }

    /**
    * Concatenates to lists together and deduplicates the result list, uses arrayContainsObject.
    * @param {Array} list1
    * @param {Array} list2
    */
    common.concatUniqueObjects = function(list1, list2) {
        if(!list1) {
            return angular.copy(list2);
        }

        if(!list2) {
            return angular.copy(list1);
        }

        var concatList = angular.copy(list1);
        common.pushObjectsIfUnique(list2, concatList);
        return concatList
    }

    /**
     * Gets the index of an object with a given key value pair in a given array
     * Will return -1 if not found
     * @param {Array} arr
     * @param {String} property
     * @param {*} value
     */
    var indexOfObjectWithValue = function(arr, property, value) {
        for(var i = 0; i < arr.length; i++) {
            if (arr[i] !== undefined && arr[i] !== null && arr[i][property] === value) return i;
        }
        return -1;
    }

    common.toTitle = function(text) {
        if(text === null || text === undefined) {
            return null;
        }
        return text.split(".").pop()
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, function(str){ return str.toUpperCase(); })
            .trim();
    }

    return common;
});
