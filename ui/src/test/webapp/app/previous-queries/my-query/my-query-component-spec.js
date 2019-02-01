describe('The My Query component', function() {

    var ctrl;
    var $componentController;

    beforeEach(module('app'));

    beforeEach(inject(function(_$componentController_) {
        $componentController =_$componentController_;
    }));

    beforeEach(function() {
        ctrl = $componentController('myQuery');
    });

    it('should take a model as input', function() {
        var ctrl = $componentController('myQuery', null, {model: 'test'});
        expect(ctrl.model).toEqual('test');
    });

    describe('ctrl.load()', function() {
        var navigation, operationChain;

        beforeEach(inject(function(_navigation_, _operationChain_) {
            navigation = _navigation_;
            operationChain = _operationChain_; 
        }));

        beforeEach(function() {
            ctrl.model = {
                name: 'op chain',
                lastRun: '12:34',
                operations: 'test operation'
            };
        })

        it('should set the operation chain to the operation in the model', function() {
            spyOn(operationChain, 'setOperationChain');

            ctrl.load();

            expect(operationChain.setOperationChain).toHaveBeenCalledWith('test operation');
        });

        it('should navigate to the query page', function() {
            spyOn(navigation, 'goToQuery');

            ctrl.load();

            expect(navigation.goToQuery).toHaveBeenCalled();
        });
    });
});
