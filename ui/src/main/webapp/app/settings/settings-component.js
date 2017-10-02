(function() {

    'use strict'

    angular.module('app').component('settings', settings())

    function settings() {

        return {
            templateUrl: 'app/settings/settings.html',
            controller: SettingsController,
            controllerAs: 'ctrl'
        }

        function SettingsController($scope, settingsService, schemaService, operationService) {

            var vm = this
            vm.resultLimit = settingsService.getResultLimit()
            vm.restUrl = settingsService.getRestUrl()
            vm.defaultOp = settingsService.getDefaultOp()

            function reloadData() {
                settingsService.setRestUrl(vm.restUrl)
                schemaService.loadSchema(settingsService.getRestUrl())
                operationService.reloadNamedOperations(settingsService.getRestUrl())
            }

            function updateResultLimit() {
                settingsService.setResultLimit(vm.resultLimit)
                $scope.$apply()
            }

            function updateDefaultOp() {
                settingsService.setDefaultOp(vm.defaultOp)
            }



        }

    }

})()