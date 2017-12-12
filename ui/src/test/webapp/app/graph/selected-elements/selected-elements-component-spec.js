describe('The Selected Elements Component', function() {

    var testSelectedEdges = [];
    var testSelectedEntities = [];

    beforeEach(module('app'));

    describe('The Controller', function() {
        var $componentController;
        var events, graph

        beforeEach(function() {
            testSelectedEdges = [];
            testSelectedEntities = [];
        });

        beforeEach(inject(function(_$componentController_, _events_, _graph_) {
            $componentController = _$componentController_;
            events = _events_;
            graph = _graph_;
        }));

        beforeEach(function() {
            spyOn(graph, 'getSelectedEntities').and.callFake(function() {
                return testSelectedEntities;
            });

            spyOn(graph, 'getSelectedEdges').and.callFake(function() {
                return testSelectedEdges;
            });
        });

        it('should exist', function() {
            var ctrl = $componentController('selectedElements');
            expect(ctrl).toBeDefined()
        });

        describe('When created', function() {
            it('should expose empty array when no elements are selected on startup', function() {
                var ctrl = $componentController('selectedElements');

                expect(graph.getSelectedEntities).toHaveBeenCalledTimes(1);
                expect(graph.getSelectedEdges).toHaveBeenCalledTimes(1);
                expect(ctrl.selectedEntities).toEqual([]);
                expect(ctrl.selectedEdges).toEqual([]);
            });

            it('should expose array of selected elements when populated on startup', function() {
                testSelectedEdges = [
                    {
                        source: {
                            vertex: 1,
                            properties: {
                                count: 3
                            }
                        },
                        destination: {
                            vertex: 5,
                            properties: {
                                count: 1
                            }
                        }
                    }
                ];

                testSelectedEntities = [
                    {
                        vertex: 1,
                        properties: {}
                    },
                    {
                        vertex: 2,
                        properties: {}
                    },
                    {
                        vertex: 5,
                        properties: {}
                    },
                    {
                        vertex: 42,
                        properties: {}
                    }
                ]

                var ctrl = $componentController('selectedElements');

                expect(graph.getSelectedEntities).toHaveBeenCalledTimes(1);
                expect(graph.getSelectedEdges).toHaveBeenCalledTimes(1);
                expect(ctrl.selectedEntities).toEqual(testSelectedEntities);
                expect(ctrl.selectedEdges).toEqual(testSelectedEdges);

            });

            describe('when initialised', function() {
                it('should subscribe to event service to get updates to selected Elements', function() {
                    spyOn(events, 'subscribe');
                    var ctrl = $componentController('selectedElements');
                    ctrl.$onInit();


                    expect(events.subscribe.calls.mostRecent().args[0]).toEqual('selectedElementsUpdate');

                });
            });
        });

    });


});