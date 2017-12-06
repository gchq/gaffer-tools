describe('The Selected Elements Component', function() {

    var testSelectedEdges = [];
    var testSelectedEntities = [];

    beforeEach(module('app'));

    beforeEach(module(function($provide) {
        $provide.factory('graph', function() {
            var getSelectedEdges = function() {
                return testSelectedEdges;
            };

            var getSelectedEntities = function() {
                return testSelectedEntities;
            };

            return {
                getSelectedEdges: getSelectedEdges,
                getSelectedEntities: getSelectedEntities
            }
        });
    }));

    describe('The Selected Seeds Controller', function() {
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

        it('should exist', function() {
            var ctrl = $componentController('selectedElements');
            expect(ctrl).toBeDefined()
        })

        it('should expose empty array when no elements are selected on startup', function() {
            spyOn(graph, 'getSelectedEntities').and.callThrough();
            spyOn(graph, 'getSelectedEdges').and.callThrough();

            var ctrl = $componentController('selectedElements');

            ctrl.$onInit();

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

            spyOn(graph, 'getSelectedEntities').and.callThrough();
            spyOn(graph, 'getSelectedEdges').and.callThrough();

            var ctrl = $componentController('selectedElements');

            ctrl.$onInit();

            expect(graph.getSelectedEntities).toHaveBeenCalledTimes(1);
            expect(graph.getSelectedEdges).toHaveBeenCalledTimes(1);
            expect(ctrl.selectedEntities).toEqual(testSelectedEntities);
            expect(ctrl.selectedEdges).toEqual(testSelectedEdges);

        });

        it('should subscribe to event service to get updates to selected Elements', function() {
            spyOn(events, 'subscribe').and.callThrough();
            var ctrl = $componentController('selectedElements');

            ctrl.$onInit();


            expect(events.subscribe.calls.mostRecent().args[0]).toEqual('selectedElementsUpdate');

        });

        it('should update the model when the selected elements changes', function() {
            var ctrl = $componentController('selectedElements');

            ctrl.$onInit();

            expect(ctrl.selectedEntities).toEqual([]);
            expect(ctrl.selectedEdges).toEqual([]);

            var newSelectedElements = {
                'edges': [
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
                ],
                'entities': [
                    {
                        vertex: 1,
                        properties: {}
                    },
                    {
                        vertex: 2,
                        properties: {}
                    }
                ]
            }

            events.broadcast('selectedElementsUpdate', [newSelectedElements]);
            expect(ctrl.selectedEntities).toEqual(newSelectedElements['entities']);
            expect(ctrl.selectedEdges).toEqual(newSelectedElements['edges']);
        });
    });


});