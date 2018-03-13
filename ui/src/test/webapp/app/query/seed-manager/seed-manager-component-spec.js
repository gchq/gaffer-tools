describe('The Seed Manager Component', function() {
    beforeEach(module('app'));

    describe('The Controller', function() {
        var $componentController;
        var events, input;

        beforeEach(inject(function(_$componentController_, _events_, _input_) {
            $componentController = _$componentController_;
            events = _events_;
            input = _input_;
        }));

        it('should exist', function() {
            var ctrl = $componentController('seedManager');
            expect(ctrl).toBeDefined();
        });

        describe('ctrl.$onInit()', function() {
            var ctrl;

            beforeEach(function() {
                spyOn(input, 'getInput').and.returnValue(['hello', 'world']);
                spyOn(events, 'subscribe');
            });

            beforeEach(function() {
                ctrl = $componentController('seedManager');
                ctrl.$onInit();
            });

            it('should set the initial value of the query input', function() {
                expect(ctrl.input).toEqual(["hello", "world"]);
            });

            it('should subscribe to the "queryInputUpdate" event', function() {
                expect(events.subscribe.calls.mostRecent().args[0]).toEqual('queryInputUpdate');
            });
        });

        describe('When a user selects all seeds', function() {

            var ctrl;
            var graph;

            beforeEach(inject(function(_graph_) {
                graph = _graph_;
            }));

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

            it('should unsubscribe from the queryInputUpdate Event', function() {
                expect(events.unsubscribe.calls.mostRecent().args[0]).toEqual('queryInputUpdate');
            });
        });
    });
})
