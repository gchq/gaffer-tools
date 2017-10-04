'use strict'

angular.module('app').controller('MainCtrl', ['schema', 'settings', 'config', 'graph', function(schema, settings, config, graph) {
    config.loadConfig()
    schema.loadSchema(settings.getRestUrl())
}])