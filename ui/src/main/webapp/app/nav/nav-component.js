(function() {

    angular.module('app').component('navigation', nav())

    function nav() {
        return {
            templateUrl: '/app/nav/nav.html',
            controller: NavigationController,
            controllerAs: 'ctrl'
        }

        function NavigationController($scope, $mdDialog, schemaService, typeService, graphService, operationService, resultsService) {
            var vm = this;
            vm.loading = false


            vm.addMultipleSeeds = false

            vm.addSeedPrompt = addSeedPrompt
            vm.addSeed = addSeed

            function addSeedPrompt(ev) {
                $mdDialog.show({
                    preserveScope: true,
                    template: '<seed-builder></seed-builder>',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                })
                .then(function(seeds) {
                    for(var i in seeds) {
                        vm.addSeed(seeds[i].vertexType, JSON.stringify(seeds[i].vertex));
                    }
                    if(nav.showResultsTable) {
                        table.selectedTab = 2;
                    }
                });
            }

            function openBuildQueryDialog(ev) {
                    $mdDialog.show({
                      template: '<query-builder></query-builder>',
                      parent: angular.element(document.body),
                      targetEvent: ev,
                      clickOutsideToClose: true
                    })
                    .then(function(operation) {
                        operationService.addOperation(operation);
                        operationService.execute(JSON.stringify({
                            class: "uk.gov.gchq.gaffer.operation.OperationChain",
                            operations: [operation, operationsService.createLimitOperation(), operationsService.createDeduplicateOperation()]
                        }), function(results) {
                            loading = false
                            resultsService.updateResults(results)
                            $scope.$apply()
                        })
                    });
                }

            function addSeed(vertexType, vertex) {
                graphService.addSeed(vertexType, vertex, function () {
                    $scope.$apply()
                });
            }

            function executeAll() {
                resultsService.clearResults();
                loading = true
                for(var i in operationService.getOperations()) {
                    try {
                        operationService.execute(JSON.stringify({
                            class: "uk.gov.gchq.gaffer.operation.OperationChain",
                            operations: [$scope.operations[i], operationsService.createLimitOperation(), operationsService.createDeduplicateOperation()]
                        }), function(results) {
                            resultsService.updateResults(results, function() {
                                loading = false
                                $scope.$apply()
                            })
                        });
                    } catch(e) {
                        // Try without the limit and deduplicate operations
                        operationService.execute(JSON.stringify({
                            class: "uk.gov.gchq.gaffer.operation.OperationChain",
                            operations: [$scope.operations[i]]
                        }), function(results) {
                            resultsService.updateResults(results, function() {
                                loading = false
                                $scope.$apply()
                            })
                        });
                   }
               }
            }
        }
    }
})()