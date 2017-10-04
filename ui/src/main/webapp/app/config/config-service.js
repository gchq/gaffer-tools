

'use strict'

angular.module('app').factory('config', ['$http', function($http) {

    var configService = {}
    configService.config = {}

    configService.getConfig = function() {
        return configService.config
    }

    configService.setConfig = function(conf) {
        configService.config = conf
    }

    configService.loadConfig = function() {
        $http.get('/config/config.json')
        .success(function(results) {
            configService.setConfig(results)
        })
        .error(function(err) {
            console.error("Failed to load config: " + err)
        })
    }

    return configService

}])