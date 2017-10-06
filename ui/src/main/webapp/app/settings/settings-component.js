'use strict'

angular.module('app').component('settingsView', settingsView())

function settingsView() {

    return {
        templateUrl: 'app/settings/settings.html',
        controller: SettingsController,
        controllerAs: 'ctrl'
    }
}

function SettingsController($scope, settings, schema, operationService) {

    var vm = this
    vm.restUrl = settings.getRestUrl()
    vm.resultLimit = settings.getResultLimit()
    vm.defaultOp = settings.getDefaultOp()

    vm.reloadData = function() {
        settings.setRestUrl(vm.restUrl)
        schema.loadSchema(settings.getRestUrl())
        operationService.reloadNamedOperations(settings.getRestUrl())
    }

    vm.updateResultLimit = function() {
        settings.setResultLimit(vm.resultLimit)
    }

    vm.updateDefaultOp = function() {
        settings.setDefaultOp(vm.defaultOp)
    }

}
