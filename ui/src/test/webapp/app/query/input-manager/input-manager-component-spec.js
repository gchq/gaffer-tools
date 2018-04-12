describe('The Input Manager Component', function() {
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
            var ctrl = $componentController('inputManager');
            expect(ctrl).toBeDefined();
        });

        describe('ctrl.selectAllSeeds()', function() {

            var ctrl;
            var graph;

            beforeEach(inject(function(_graph_) {
                graph = _graph_;
            }));

            beforeEach(function() {
                spyOn(graph, 'selectAllNodes');
            });

            beforeEach(function() {
                ctrl = $componentController('inputManager');
                ctrl.selectAllSeeds()
            });

            it('should be able to select all seeds', function() {
                expect(graph.selectAllNodes).toHaveBeenCalledTimes(1);
            });
        });
    });
});