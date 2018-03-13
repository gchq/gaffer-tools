describe('The Result Count Warning Component', function() {
    beforeEach(module('app'));


    describe('The Controller', function() {

        var $componentController, $mdDialog;
        var settings;

        beforeEach(inject(function(_$componentController_, _settings_, _$mdDialog_) {
            $componentController = _$componentController_;
            settings = _settings_;
            $mdDialog = _$mdDialog_;
        }));

        it('should exist', function() {
            var ctrl = $componentController('resultCountWarning');
            expect(ctrl).toBeDefined();
        });

        it('should expose the value of the result count limit', function() {
            spyOn(settings, 'getResultLimit').and.returnValue(42);
            var ctrl = $componentController('resultCountWarning');

            expect(ctrl.limit).toEqual(42);
        });

        it('should submit an answer', function() {
            var ctrl = $componentController('resultCountWarning');
            spyOn($mdDialog, 'hide');

            ctrl.answer('test');

            expect($mdDialog.hide).toHaveBeenCalledTimes(1);
            expect($mdDialog.hide).toHaveBeenCalledWith('test');
        });
    })
});
