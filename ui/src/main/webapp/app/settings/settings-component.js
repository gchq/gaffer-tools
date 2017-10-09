'use strict'

angular.module('app').component('settingsView', settingsView())

function settingsView() {

    return {
        templateUrl: 'app/settings/settings.html',
        controller: SettingsController,
        controllerAs: 'ctrl'
    }
}

function SettingsController($scope, settings, schema, operationService, results) {

    var vm = this

    vm.resultLimit = settings.getResultLimit()
    vm.defaultOp = settings.getDefaultOp()

    vm.updateResultLimit = function() {
        settings.setResultLimit(vm.resultLimit)
    }

    vm.updateDefaultOp = function() {
        settings.setDefaultOp(vm.defaultOp)
    }

}
