describe('The options component', function() {

    var ctrl;
    var scope;
    

    beforeEach(module('app'));

    beforeEach(inject(function(_$rootScope_, _$componentController_) {
        scope = _$rootScope_.$new();
        $componentController = _$componentController_;

        ctrl = _$componentController_('options', {$scope: scope})
    }));

    describe('ctrl.$onInit()', function() {
        describe('When the component is the master', function() {

        });

        describe('When the component is not the master', function() {

        })
    });

    describe('ctrl.$onDestroy', function() {

    });

    describe('When an "onPreExecute" is called', function() {

    });

    describe('ctrl.addOption()', function() {

    });

    describe('ctrl.clearValue()', function() {

    });

    describe('ctrl.hideOption()', function() {

    });

});