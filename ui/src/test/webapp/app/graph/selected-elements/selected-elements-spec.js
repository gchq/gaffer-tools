describe('The Selected Elements Component', function() {
    var scope;
    var element;

    var testSelectedEdges = [];
    var testSelectedEntities = [];

    var watchedFunctions = {};

    beforeEach(module('app'));

    beforeEach(module(function($provide) {
        $provide.factory('graph', function() {
            var getSelectedEdges = jasmine.createSpy('getSelectedEdges').and.callFake(function() {
                return testSelectedEdges;
            });

            var getSelectedEntities = jasmine.createSpy('getSelectedEntities').and.callFake(function() {
                return testSelectedEntities;
            });

            watchedFunctions['getSelectedEdges'] = getSelectedEdges;
            watchedFunctions['getSelectedEntities'] = getSelectedEntities;

            return {
                getSelectedEdges: getSelectedEdges,
                getSelectedEntities: getSelectedEntities
            }
        });


    }));

    beforeEach(inject(function($rootScope, $compile) {
        scope = $rootScope.$new();
        element = angular.element('<selected-seeds></selected-seeds>');

        element = $compile(element)(scope);
    }));

    it('Exists', function() {
        expect(element).toBeDefined();
    });

    describe('The Selected Seeds Controller', function() {
        var $componentController;
        var events

        beforeEach(function() {
            testSelectedEdges = [];
            testSelectedEntities = [];
        });

        beforeEach(inject(function(_$componentController_, _events_) {
            $componentController = _$componentController_;
            events = _events_;
        }));

        it('should exist', function() {
            var ctrl = $componentController('selectedElements');
            expect(ctrl).toBeDefined()
        })

        it('should expose empty array when no elements are selected on startup', function() {
            var ctrl = $componentController('selectedElements');
            expect(watchedFunctions['getSelectedEntities']).toHaveBeenCalledTimes(1);
            expect(watchedFunctions['getSelectedEdges']).toHaveBeenCalledTimes(1);
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
            expect(watchedFunctions['getSelectedEntities']).toHaveBeenCalledTimes(1);
            expect(watchedFunctions['getSelectedEdges']).toHaveBeenCalledTimes(1);
            expect(ctrl.selectedEntities).toEqual(testSelectedEntities);
            expect(ctrl.selectedEdges).toEqual(testSelectedEdges);

        });

        it('should subscribe to event service to get updates to selected Elements', function() {
            spyOn(events, 'subscribe').and.callThrough();
            var ctrl = $componentController('selectedElements');

            expect(events.subscribe.calls.mostRecent().args[0]).toEqual('selectedElementsUpdate');

        });

        it('should update the model when the selected elements changes', function() {
            var ctrl = $componentController('selectedElements');
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
        })
    });


});