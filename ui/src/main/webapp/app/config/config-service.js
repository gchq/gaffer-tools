

'use strict'

angular.module('app').factory('config', ['$http', function($http) {

    var configService = {}
    configService.config = {}

    configService.get = function() {
        return configService.config
    }

    configService.set = function(conf) {
        configService.config = conf
    }

    configService.load = function(onSuccess) {
        $http.get('/config/config.json')
        .success(function(results) {
            onSuccess(results)
        })
        .error(function(err) {
            console.error("Failed to load config: " + err)
        })
    }

    return configService

}])