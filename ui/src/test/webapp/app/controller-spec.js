describe('MainCtrl', function() {

    var $controller;
    var ctrl;
    var graph;

    beforeEach(module('app'));

    beforeEach(inject(function(_$controller_, _graph_) {
        $controller = _$controller_;
        graph = _graph_;
    }));

    beforeEach(function() {
        spyOn(graph, 'load');
    });

    beforeEach(function() {
        ctrl = $controller('MainCtrl');
    });

    it('should exist', function() {
        expect(ctrl).toBeDefined();
    });

    it('should call graph.load()', function() {
        expect(graph.load).toHaveBeenCalledTimes(1);
    });
});