'use strict'

angular.module('app').component('graphView', graphView())

function graphView() {

    return {
        templateUrl: 'app/graph/graph.html',
        controller: GraphController,
        controllerAs: 'ctrl'
    }
}


function GraphController($scope, graph, results, $timeout) {

    var vm = this

    vm.selectedEdges = graph.getSelectedEdges()
    vm.selectedEntities = graph.getSelectedEntities()

    var promise = null

    results.observe().then(null, null, function(results) {
        graph.update(results)
    })

    graph.onSelectedElementsUpdate(function(selectedElements) {
        vm.selectedEdges = selectedElements.edges
        vm.selectedEntities = selectedElements.entities

        if(!promise) {
            promise = $timeout(function() {
                $scope.$apply()
                promise = null
            })
        }
    })

    graph.reload(results.get())



}