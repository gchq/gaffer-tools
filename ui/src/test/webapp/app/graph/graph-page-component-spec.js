describe('The graph page component', function() {

    var ctrl;
    var $componentController;
    var graph;

    beforeEach(module('app'));

    beforeEach(inject(function(_$componentController_, _graph_) {
        $componentController = _$componentController_;
        graph = _graph_;
    }));

    beforeEach(function() {
        ctrl = $componentController('graphPage');
    });

    it('should exist', function() {
        expect(ctrl).not.toBeUndefined();
    });

    describe('ctrl.$onInit()', function() {
        it('should set the selected elements using the graph service', function() { 
            spyOn(graph, 'getSelectedElements').and.returnValue('test');

            ctrl.$onInit();

            expect(graph.getSelectedElements).toHaveBeenCalled();
            expect(ctrl.selectedElements).toEqual('test');
        });
    });

    describe('ctrl.$onDestroy()', function() {
        it('should submit the current model to the graph service', function() {
            spyOn(graph, 'setSelectedElements').and.stub();
            ctrl.selectedElements = 'foo';

            ctrl.$onDestroy();

            expect(graph.setSelectedElements).toHaveBeenCalledWith('foo');
        });
    }); 
});
