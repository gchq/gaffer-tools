describe('The Loading Component', function() {

    beforeEach(module('app'));

    describe('The Controller', function() {

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
