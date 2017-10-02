(function () {

    'use strict'

    angular.module('app').component('raw', raw())

    function raw() {

        return {
            templateUrl: 'app/raw/raw.html',
            controller: RawController,
            controllerAs: 'ctrl'
        }

        function RawController($scope, operationService, resultsService) {
            var vm = this

            // variables
            vm.operationsForEdit = []
            vm.editingOperations = false
            vm.operations = operationService.getOperations()
            vm.results = resultsService.getResults()

            // watches

            $scope.$watch(operationService.getOperations(), function(oldValue, newValue) {
                if (oldValue !== newValue) {
                    vm.operations = newValue
                }
            })

            $scope.$watch(resultsService.getResults(), function(oldValue, newValue) {
                            if (oldValue !== newValue) {
                                vm.results = newValue
                            }
                        })

            // functions
            vm.editOperations = editOperations
            vm.saveOperations = saveOperations

            function editOperations() {
                vm.operationsForEdit = []
                var operations = operationService.getOperations()

                for(var i in operations) {
                    vm.operationsForEdit.push(JSON.stringify(operations[i], null, 2));
                }
                vm.editingOperations = true;
            }

            function saveOperations() {
                operationService.setOperations([]);
                for(var i in vm.operationsForEdit) {
                    try {
                        operationService.addOperation(JSON.parse(vm.operationsForEdit[i]));
                    } catch(e) {
                        console.err('Invalid json: ' + vm.operationsForEdit[i]);
                    }
                }
                vm.editingOperations = false;
            }


        }
    }
})()