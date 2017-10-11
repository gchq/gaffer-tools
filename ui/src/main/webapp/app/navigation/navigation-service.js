'use strict'

angular.module('app').factory('navigation', ['$location', '$q', function($location, $q) {
    var navigation = {}

    var currentPage = $location.path().substr(1)
    var defer = $q.defer()

    navigation.getCurrentPage = function() {
        return currentPage
    }

    navigation.goTo = function(pageName) {
        currentPage = pageName
        $location.path('/' + pageName)
        defer.notify(currentPage)
    }

    navigation.observeCurrentPage = function() {
        return defer.promise
    }

    return navigation
}])