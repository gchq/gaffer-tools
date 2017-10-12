'use strict'

angular.module('app').component('raw', raw())

function raw() {

    return {
        templateUrl: 'app/raw/raw.html',
        controller: RawController,
        controllerAs: 'ctrl'
    }
}

function RawController($scope, operationService, results, query, $mdToast) {
    var vm = this

    // variables
    vm.operationsForEdit = []
    vm.editingOperations = false
    vm.operations = query.getOperations()
    vm.results = results.get()

    // watches

    query.observeOperations().then(null, null, function(operations) {
        vm.operations = operations
    })

    results.observe().then(null, null, function(results) {
        vm.results = results
    })

    // functions

    vm.editOperations = function() {
        vm.operationsForEdit = []

        for(var i in vm.operations) {
            vm.operationsForEdit.push(JSON.stringify(vm.operations[i], null, 2));
        }
        vm.editingOperations = true;
    }

    vm.addOperation = function() {
        vm.operationsForEdit.push("")
    }

    vm.saveOperations = function() {
        query.setOperations([])
        for(var i in vm.operationsForEdit) {
            try {
                if (vm.operationsForEdit[i] !== "") {
                    query.addOperation(JSON.parse(vm.operationsForEdit[i]));
                }
            } catch(e) {
                $mdToast.show($mdToast.simple()
                    .textContent('Invalid json for operation ' + (+i + 1))
                    .position('bottom right'))
                console.log('Invalid json: ' + vm.operationsForEdit[i]);
                return;
            }
        }
        vm.editingOperations = false;
    }
}
