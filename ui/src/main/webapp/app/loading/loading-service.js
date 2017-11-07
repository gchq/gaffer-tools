'use strict'

angular.module('app').factory('loading', function() {

    var service = {};
    var loading = false;

    service.load = function() {
        loading = true;
    }

    service.finish = function() {
        loading = false;
    }

    service.isLoading = function() {
        return loading;
    }

    return service;

});