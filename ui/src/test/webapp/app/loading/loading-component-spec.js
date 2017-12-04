describe('The loading component', function() {

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

    describe('The loading controller', function() {

        var loading;
        var $componentController;

        beforeEach(inject(function(_loading_, _$componentController_) {
            loading = _loading_;
            $componentController = _$componentController_;
        }));

        it('should exist', function() {
            var ctrl = $componentController('loadingCircle');
            expect(ctrl).toBeDefined();
        })

        it('should expose the isLoading() method of the loading service', function() {
            var ctrl = $componentController('loadingCircle');

            expect(ctrl.isLoading()).toBeFalsy();
            loading.load();
            expect(ctrl.isLoading()).toBeTruthy();
            loading.finish();
            expect(ctrl.isLoading()).toBeFalsy();
        });
    });

});