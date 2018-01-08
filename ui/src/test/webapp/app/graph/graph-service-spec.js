describe("The Graph Service", function() {

    var graph;
    var events;
    var scope;

    beforeEach(module('app'));

    beforeEach(module(function($provide) {
        $provide.factory('config', function($q) {
            var get = function() {
                return $q.when({});
            }

            return {
                get: get
            }
        });

        $provide.factory('schema', function($q) {
            return {
                get: function() {
                    return $q.when({});
                }
            }
        });
    }));

    beforeEach(inject(function(_graph_, _events_, _$rootScope_) {
        graph = _graph_;
        events = _events_;
        scope = _$rootScope_.$new();
    }));

    describe('when loading', function() {

        var resolvedValue;

        beforeEach(function(done) {
            graph.load().then(function(graphObject) {
                resolvedValue = graphObject;
                done();
            });

            setTimeout(function() {
                scope.$apply();
            }, 1000)
        });

        it('should load cytoscape and return the cytoscape graph object', function() {
            expect(resolvedValue).toBeDefined();
        });
    });

    describe('after loading', function() {
        beforeEach(function() {
            graph.load(); // simulating the call performed when MainCtrl starts
        });

        describe('when adding a seed', function() {
            it('should also select it', function() {
                graph.addSeed("mySeed");
                expect(graph.getSelectedEntities()).toEqual({'"mySeed"': [{vertex: '"mySeed"'}]})
            });

            it('should broadcast the selectedElementsUpdate event', function() {
                spyOn(events, 'broadcast');
                graph.addSeed('mySeed');
                expect(events.broadcast).toHaveBeenCalledTimes(1);
                expect(events.broadcast.calls.first().args[1]).toEqual([{entities: { '"mySeed"': [{vertex: '"mySeed"'}]}, edges: {}}]);
            });

            it('should select it if already added', function() {
                // add it the first time
                graph.addSeed("mySeed");
                // deselect it
                graph.reset();

                graph.addSeed("mySeed");
                expect(graph.getSelectedEntities()).toEqual({'"mySeed"': [{vertex: '"mySeed"'}]})
            });

            it('should do nothing if already added and selected', function() {
                graph.addSeed("mySeed");
                expect(graph.getSelectedEntities()).toEqual({'"mySeed"': [{vertex: '"mySeed"'}]});
                graph.addSeed("mySeed");
                expect(graph.getSelectedEntities()).toEqual({'"mySeed"': [{vertex: '"mySeed"'}]});
            });
        });
    })


})