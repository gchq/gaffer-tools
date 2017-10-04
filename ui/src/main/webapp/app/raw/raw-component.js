'use strict'

angular.module('app').component('raw', raw())

function raw() {

    return {
        templateUrl: 'app/raw/raw.html',
        controller: RawController,
        controllerAs: 'ctrl'
    }
}

function RawController($scope, operations, results, query) {
    var vm = this

    // variables
    vm.operationsForEdit = []
    vm.editingOperations = false
    vm.operations = query.operations
    vm.results = results.results

    // watches

    query.observeOperations().then(null, null, function(operations) {
        vm.operations = operations
    })

    results.observeResults().then(null, null, function(results) {
        vm.results = results
    })

    // functions

    vm.editOperations = function() {
        vm.operationsForEdit = []

        for(var i in vm.operations) {
            vm.operationsForEdit.push(JSON.stringify(operations[i], null, 2));
        }
        vm.editingOperations = true;
    }

    vm.saveOperations = function() {
        query.setOperations([])
        for(var i in vm.operationsForEdit) {
            try {
                query.addOperation(JSON.parse(vm.operationsForEdit[i]));
            } catch(e) {
                console.err('Invalid json: ' + vm.operationsForEdit[i]);
            }
        }
        vm.editingOperations = false;
    }
}
