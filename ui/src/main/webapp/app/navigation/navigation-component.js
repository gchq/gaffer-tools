angular.module('app').component('navigation', navigation())

function navigation() {
    return {
        templateUrl: 'app/navigation/navigation.html',
        controller: NavigationController,
        controllerAs: 'ctrl'
    }
}

function NavigationController($scope, $mdDialog, graph, operations, results) {
    var vm = this;
    vm.loading = false
    vm.addMultipleSeeds = false

    vm.addSeedPrompt = function(ev) {
        $mdDialog.show({
            preserveScope: true,
            template: '<seed-builder aria-label="Seed Builder"></seed-builder>',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        })
        .then(function(seeds) {
            for(var i in seeds) {
                graph.addSeed(seeds[i].vertexType, JSON.stringify(seeds[i].vertex))
            }
        });
    }

    vm.openBuildQueryDialog = function(ev) {
        $mdDialog.show({
          template: '<query-builder aria-label="Query Builder"></query-builder>',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true
        })
        .then(function(operation) {
            operations.addOperation(operation);
            operations.execute(JSON.stringify({
                class: "uk.gov.gchq.gaffer.operation.OperationChain",
                operations: [operation, operationsService.createLimitOperation(), operationsService.createDeduplicateOperation()]
            }), function(results) {
                loading = false
                results.updateResults(results)
            })
        });
    }


    vm.executeAll = function() {
        results.clearResults();
        loading = true
        for(var i in operations.getOperations()) {
            try {
                operations.execute(JSON.stringify({
                    class: "uk.gov.gchq.gaffer.operation.OperationChain",
                    operations: [$scope.operations[i], operationsService.createLimitOperation(), operationsService.createDeduplicateOperation()]
                }), function(results) {
                    results.updateResults(results, function() {
                        loading = false
                    })
                });
            } catch(e) {
                // Try without the limit and deduplicate operations
                operations.execute(JSON.stringify({
                    class: "uk.gov.gchq.gaffer.operation.OperationChain",
                    operations: [$scope.operations[i]]
                }), function(results) {
                    results.updateResults(results, function() {
                        loading = false
                    })
                });
           }
       }
    }
}
