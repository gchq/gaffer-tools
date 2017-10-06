'use strict'

angular.module('app').controller('MainCtrl', ['schema', 'settings', 'config', 'graph', 'operationService', function(schema, settings, config, graph, operationService) {
    config.loadConfig(function(conf) {
        config.setConfig(conf)
        operationService.reloadNamedOperations(settings.getRestUrl())
    })
    schema.loadSchema(settings.getRestUrl())
    graph.load()
}])