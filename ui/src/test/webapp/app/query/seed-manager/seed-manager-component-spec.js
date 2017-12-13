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

        describe('When a user selects all seeds', function() {

            var ctrl;

            beforeEach(function() {
                spyOn(graph, 'selectAllNodes');
            });

            beforeEach(function() {
                ctrl = $componentController('seedManager');
                ctrl.$onInit();
                ctrl.selectAllSeeds()
            });

            it('should be able to select all seeds', function() {
                expect(graph.selectAllNodes).toHaveBeenCalledTimes(1);
            });
        });

        describe('When destroyed', function() {
            var ctrl;

            beforeEach(function() {
                spyOn(events, 'unsubscribe');
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
        });


    });
})