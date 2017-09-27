(function() {

    function nav() {
        return {
            templateUrl: '/app/nav/nav.html',
            controller: navController,
            controllerAs: 'ctrl'
        }

        function navController($scope, $mdDialog) {
            var loading = false

            function isLoading() {
                return loading
            }

            function addSeedPrompt(ev) {
                 $mdDialog.show({
                      scope: $scope,
                      preserveScope: true,
                      controller: addSeedDialogController,
                      templateUrl: 'app/graph/addSeedDialog.html',
                      parent: angular.element(document.body),
                      targetEvent: ev,
                      clickOutsideToClose: true,
                      fullscreen: $scope.customFullscreen
                 })
                 .then(function(seeds) {
                      for(var i in seeds) {
                          $scope.addSeed(seeds[i].vertexType, JSON.stringify(seeds[i].vertex));
                      }
                      if(nav.showResultsTable) {
                        table.selectedTab = 2;
                      }
                 });
               }



        }

        function addSeedDialogController($scope, $mdDialog) {
                $scope.addSeedCancel = function() {
                  $mdDialog.cancel();
                };

                $scope.addSeedAdd = function() {
                  var seeds = [];
                  if($scope.addMultipleSeeds) {
                      var vertices = $scope.addSeedVertices.trim().split("\n");
                      for(var i in vertices) {
                        var vertex = vertices[i];
                        var vertexType = $scope.addSeedVertexType;
                        var typeClass = $scope.rawData.schema.types[vertexType].class;
                        var partValues = vertex.trim().split(",");
                        var types = settings.getType(typeClass).types;
                        if(types.length != partValues.length) {
                            alert("Wrong number of parameters for seed: " + vertex + ". " + vertexType + " requires " + types.length + " parameters");
                            break;
                        }
                        var parts = {};
                        for(var j = 0; j< types.length; j++) {
                            parts[types[j].key] = partValues[j];
                        }
                        seeds.push(createSeed(vertexType, parts));
                      }
                  } else {
                      seeds.push(createSeed($scope.addSeedVertexType, $scope.addSeedVertexParts));
                  }
                  $scope.addSeedVertexType = '';
                  $scope.addSeedVertex = '';
                  $scope.addSeedVertices = '';
                  $scope.addSeedVertexParts = {};
                  $mdDialog.hide(seeds);
                };
              }
    }
})()