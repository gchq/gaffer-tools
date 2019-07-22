describe('The My Queries component', function() {

    var ctrl;
    var $componentController;
    var previousQueries;

    beforeEach(module('app'));

    beforeEach(inject(function(_$componentController_, _previousQueries_) {
        $componentController =_$componentController_;
        previousQueries = _previousQueries_;
    }));

    beforeEach(function() {
        ctrl = $componentController('myQueries');
    });


    describe('ctrl.$onInit()', function() {
        it('should get the previously run queries from the service', function() {
            spyOn(previousQueries, 'getQueries').and.returnValue('test');
            
            ctrl.$onInit();

            expect(ctrl.queries).toEqual('test');
        });
    });

    describe('ctrl.createNew()', function() {
        var navigation, operationChain;

        beforeEach(inject(function(_navigation_, _operationChain_) {
            navigation = _navigation_;
            operationChain = _operationChain_;
        }));

        it('should reset the operation chain', function() {
            spyOn(operationChain, 'reset');

            ctrl.createNew();

            expect(operationChain.reset).toHaveBeenCalled();
        });

        it('should navigate to the query page', function() {
            spyOn(navigation, 'goToQuery');

            ctrl.createNew();

            expect(navigation.goToQuery).toHaveBeenCalled();
        });
    });
});
