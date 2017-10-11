

'use strict'

angular.module('app').factory('config', ['$http', function($http) {

    var configService = {}

    var config = {}

    configService.get = function() {
        return config
    }

    configService.set = function(conf) {
        config = conf
    }

    configService.load = function(onSuccess) {
        $http.get('/config/config.json')
            .then(function(response) {
                onSuccess(response.data)
            },
            function(err) {
                console.error("Failed to load config: " + err)
        })
    }

    return configService

}])