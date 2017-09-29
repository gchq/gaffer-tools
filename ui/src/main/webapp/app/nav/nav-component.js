(function() {

    angular.module('app').component('nav', nav())

    function nav() {
        return {
            templateUrl: '/app/nav/nav.html',
            controller: navController,
            controllerAs: 'ctrl'
        }

        function navController($scope, $mdDialog, schemaService, typeService, graphService, operationService, resultService) {
            var vm = this;
            vm.loading = false


            vm.addMultipleSeeds = false

            vm.isLoading = isLoading
            vm.addSeedPrompt = addSeedPrompt
            vm.addSeed = addSeed

            function isLoading() {
                return loading
            }

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
                            resultService.updateResults(results)
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
                resultService.clearResults();
                loading = true
                for(var i in operationService.getOperations()) {
                    try {
                        operationService.execute(JSON.stringify({
                            class: "uk.gov.gchq.gaffer.operation.OperationChain",
                            operations: [$scope.operations[i], operationsService.createLimitOperation(), operationsService.createDeduplicateOperation()]
                        }), function(results) {
                            resultService.updateResults(results, function() {
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
                            resultService.updateResults(results, function() {
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