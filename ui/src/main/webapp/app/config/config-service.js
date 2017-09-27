(function() {

    'use strict'

    angular.module('app').factory('configService', configService)

    function configService($http) {

        var config = {}

        loadConfig();

        return {
            getConfig: getConfig
        }

        function getConfig() {
            return config;
        }

        function setConfig(conf) {
            config = conf
        }

        function loadConfig() {
            $http.get('/config/config.json')
            .success(function(results) {
                setConfig(results)
            })
            .error(function(err) {
                console.err("Failed to load config: " + err)
            })
        }



    }

})()