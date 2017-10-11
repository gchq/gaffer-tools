'use strict'

angular.module('app').factory('common', [function() {

    var common = {}

    common.clone = function(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    common.parseVertex = function(vertex) {
        if(typeof vertex === 'string' || vertex instanceof String) {
            vertex = "\"" + vertex + "\"";
        }

        try {
            JSON.parse(vertex);
        } catch(err) {
            // Try using stringify
            vertex = JSON.stringify(vertex);
        }

        return vertex;
    }

    common.parseUrl = function(url) {
        if(!url.startsWith("http")) {
            url = "http://" + url
        }

        return url
    }

    common.objectContainsValue = function(obj, value) {
        return obj && value in obj
    }

    common.arrayContainsValue = function(arr, value) {
        return arr && arr.indexOf(value) !== -1
    }

    common.arrayContainsObjectWithValue = function(arr, property, value) {
        return indexOfObjectWithValue(arr, property, value) !== -1
    }

    var indexOfObjectWithValue = function(arr, property, value) {
        for(var i = 0; i < arr.length; i++) {
            if (arr[i][property] === value) return i;
        }
        return -1;
    }

    return common
}])