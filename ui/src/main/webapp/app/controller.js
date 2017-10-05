'use strict'

angular.module('app').controller('MainCtrl', ['schema', 'settings', 'config', 'graph', 'operations', function(schema, settings, config, graph, operations) {
    config.loadConfig(function(conf) {
        config.setConfig(conf)
        operations.reloadNamedOperations(settings.getRestUrl())
    })
    schema.loadSchema(settings.getRestUrl())
    graph.load()
}])