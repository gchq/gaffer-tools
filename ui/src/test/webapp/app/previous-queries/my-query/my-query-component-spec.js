describe('The My Query component', function() {

    var ctrl;
    var require = {};
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
    it('should take a parent as input', function() {
        var ctrl = $componentController('myQuery', null, {parent: 'test'});
        expect(require.parent).toEqual('test');
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

    describe('ctrl.openSideNav()', function() {
        var previousQueries, $mdSidenav;
        var operationIndex = 0;
        var chain = 0;
        var operation = {test: 'test'};
        beforeEach(inject(function(_previousQueries_, _$mdSidenav_) {
            previousQueries = _previousQueries_;
            $mdSidenav = _$mdSidenav_;
        }));
        beforeEach(function() {
            require.parent = 'myQueries'
        });
        it('should open edit sidenav in my query', function() {
           
            spyOn($mdSidenav('right'), 'toggle');
            ctrl.openSideNav(operationIndex, operation);
            expect($mdSidenav.toggle).toHaveBeenCalled();
        });
        it('should set chain and operation index', function() {
            
            spyOn($mdSidenav('right'), 'toggle');
            spyOn(previousQueries, 'setCurrentChain');
            ctrl.openSideNav(operationIndex, operation);
            expect(previousQueries.setOperationChain).toHaveBeenCalledWith(chain, operationIndex)
        });
        it('should get updated operations from edit sidenav', function() {
            
            spyOn(require.parent, 'getUpdatedOperations');
            ctrl.openSideNav(operationIndex, operation);
            expect(require.parent.getUpdatedOperations).toHaveBeenCalledWith(operation);
        });
    });
});
