describe('The Seed Manager Component', function() {
    beforeEach(module('app'));

    describe('The Controller', function() {
        var $componentController;
        var events, graph;

        beforeEach(inject(function(_$componentController_, _events_, _graph_) {
            $componentController = _$componentController_;
            events = _events_;
            graph = _graph_;
        }));

        it('should exist', function() {
            var ctrl = $componentController('seedManager');
            expect(ctrl).toBeDefined();
        });

        describe('on initialisation', function() {

            beforeEach(function() {
                spyOn(graph, 'getSelectedEntities').and.returnValue({'"test"': {}});
            })

            it('should set the initial value of the selected seeds to the entities selected on the graph', function() {
                var ctrl = $componentController('seedManager');
                ctrl.$onInit();
                expect(ctrl.selectedEntities).toEqual({'"test"': {}});
            });

            it('should subscribe to the selectedElementsUpdate event', function() {
                var ctrl = $componentController('seedManager');
                spyOn(events, 'subscribe');
                ctrl.$onInit();
                expect(events.subscribe).toHaveBeenCalledTimes(1);
                expect(events.subscribe.calls.first().args[0]).toEqual('selectedElementsUpdate')
            });
        });

        describe('when a selected element update is received', function() {
            var events;

            var ctrl;

            beforeEach(inject(function(_events_) {
                events = _events_;
            }));

            beforeEach(function() {
                ctrl = $componentController('seedManager');
                ctrl.$onInit();
            });

            it('should update the selectedEntities', function() {
                events.broadcast('selectedElementsUpdate', [{entities: [1, 2, 3]}]);
                expect(ctrl.selectedEntities).toEqual([1, 2, 3]);
            });

            it('should update the seeds message', function() {
                events.broadcast('selectedElementsUpdate', [ { entities: { '"test1"': {}, '"test2"': {} } }]);
                expect(ctrl.seedsMessage).toEqual("test1, test2");
            });

            it('should truncate the seeds message if more than two are returned', function() {
                events.broadcast('selectedElementsUpdate', [ { entities: { '"test1"': {}, '"test2"': {}, '"test3"': {}} }]);
                expect(ctrl.seedsMessage).toEqual("test2, test3 and 1 more");
            });

            it('should always display the last two seeds', function() {
                events.broadcast('selectedElementsUpdate', [ { entities: { '"This"': {}, '"is"': {}, '"my"': {}, '"test"': {}} }]);
                expect(ctrl.seedsMessage).toEqual("my, test and 2 more");
            });
        });

        describe('When a user selects all seeds', function() {

            var ctrl;

            beforeEach(function() {
                spyOn(graph, 'selectAllNodes').and.callFake(function() {
                    events.broadcast('selectedElementsUpdate', [ { entities: {'"Element1"': {}, '"Element2"': {} } } ]);
                });
            });

            beforeEach(function() {
                ctrl = $componentController('seedManager');
                ctrl.$onInit();
                ctrl.selectAllSeeds()
            });

            it('should be able to select all seeds', function() {
                expect(graph.selectAllNodes).toHaveBeenCalledTimes(1);
            });

            it('should have updated the selected entities model', function() {
                expect(ctrl.selectedEntities).toBeDefined();
                expect(ctrl.selectedEntities).toEqual({'"Element1"': {}, '"Element2"': {} })
            });
        });

        describe('When destroyed', function() {
            var ctrl;

            beforeEach(function() {
                spyOn(events, 'unsubscribe').and.callThrough();
            })

            beforeEach(function() {
                ctrl = $componentController('seedManager');
                ctrl.$onInit();
            });

            beforeEach(function() {
                ctrl.$onDestroy();
            });

            it('should unsubscribe from the events service', function() {
                expect(events.unsubscribe).toHaveBeenCalledTimes(1);
            });

            it('should no longer respond to SelectedElementsUpdate events', function() {
                events.broadcast('selectedElementsUpdate', [ { entities: {'"Element1"': {}, '"Element2"': {} } } ]);
                expect(ctrl.selectedEntities).toEqual({});
            });
        });


    });
})