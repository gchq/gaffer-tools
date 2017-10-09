'use strict'

angular.module('app').controller('MainCtrl', ['schema', 'settings', 'config', 'graph', 'operationService', function(schema, settings, config, graph, operationService) {

    var defaultRestEndpoint = window.location.origin + "/rest/latest"

    config.load(function(conf) {
        if (!conf.restEndpoint) {
            conf.restEndpoint = defaultRestEndpoint
        }
        config.set(conf)
        operationService.reloadNamedOperations()
        schema.load()
        graph.load()
    })
}])