'use strict'

angular.module('app').component('graphView', graphView())

function graphView() {
    return {
        templateUrl: 'app/graph/graph.html',
        controller: GraphController
    }
}


function GraphController(graph, results) {

    results.observeResults().then(null, null, function(results) {
        graph.update(results)
    })

    graph.reload()
}