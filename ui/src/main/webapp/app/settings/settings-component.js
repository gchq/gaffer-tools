'use strict'

angular.module('app').component('settingsView', settings())

function settings() {

    return {
        templateUrl: 'app/settings/settings.html',
        controller: SettingsController,
        controllerAs: 'ctrl'
    }
}

function SettingsController($scope, settings, schema, operationService) {

    var vm = this

    vm.reloadData = function() {
        settings.setRestUrl(vm.restUrl)
        schema.loadSchema(settings.getRestUrl())
        operationService.reloadNamedOperations(settings.getRestUrl())
    }

    vm.updateResultLimit = function() {
        settings.setResultLimit(vm.resultLimit)
        $scope.$apply()
    }

    vm.updateDefaultOp = function() {
        settings.setDefaultOp(vm.defaultOp)
    }

}
