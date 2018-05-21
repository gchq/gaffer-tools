describe('The Graph Service', function() {

    var graph

    beforeEach(module('app'));

    beforeEach(inject(function(_graph_) {
        graph = _graph_;
    }));

    beforeEach(function() {
        graph.load(); // gets called by MainCtrl
    });

    describe('when results are returned', function() {
        var events;

        var results = {
            entities: [
                {"vertex": "vertex1"}
            ],
            edges: [
                {"source": "vertex1", "destination": "vertex2", "directed": false}
            ],
            entitySeeds: [
                "vertex1",
                "vertex2"
            ]
        }

        beforeEach(inject(function(_events_) {
            events = _events_;
        }));

        beforeEach(function() {
            spyOn(graph, 'update').and.callThrough();
            spyOn(graph, 'redraw').and.callThrough();
            spyOn(events, 'broadcast').and.callThrough();
        });

        beforeEach(function() {
            events.broadcast('incomingResults', [ results ]);
        });

        it('should update the model automatically', function() {
            expect(graph.update).toHaveBeenCalledTimes(1);
            expect(graph.update).toHaveBeenCalledWith(results);
        });

        it('should redraw the graph', function() {
            expect(graph.redraw).toHaveBeenCalledTimes(1);
        })
    });
});
