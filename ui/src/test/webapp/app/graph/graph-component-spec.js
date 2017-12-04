describe('The graph component', function() {

    var scope;
    var element;

    beforeEach(module('app'));

     beforeEach(inject(function($rootScope, $compile) {
        scope = $rootScope.$new();
        element = angular.element('<graph></graph>');

        element = $compile(element)(scope);
    }));

    it('should exist', function() {
        expect(element).toBeDefined();
    });

    describe('The Graph Controller', function() {
        var $componentController;
        var graph;

        beforeEach(inject(function(_$componentController_, _graph_) {
            $componentController = _$componentController_;
            graph = _graph_;
        }));

        it('should exist', function() {
            var ctrl = $componentController('graph');
            expect(ctrl).toBeDefined();
        });

        it('should load the graph on startup', function(done) {
            spyOn(graph, 'load').and.callThrough();

            var ctrl = $componentController('graph');
            done();
            expect(graph.load).toHaveBeenCalled();
        });
    });
});