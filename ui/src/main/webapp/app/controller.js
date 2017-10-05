'use strict'

angular.module('app').controller('MainCtrl', ['schema', 'settings', 'config', 'graph', 'operations', function(schema, settings, config, graph, operations) {
    config.loadConfig()
    schema.loadSchema(settings.getRestUrl())
    operations.reloadNamedOperations(settings.getRestUrl())
}])