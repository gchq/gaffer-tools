describe('The Directionality Picker Component', function() {
    beforeEach(module('app'));

    describe('The Controller', function() {

        var $componentController;

        beforeEach(inject(function(_$componentController_, ) {
            $componentController = _$componentController_;
        }));

        it('should exist', function() {
            var ctrl = $componentController('directionalityPicker');
            expect(ctrl).toBeDefined();
        });

        describe('ctrl.$onInit()', function() {
            it('should throw an error if the model is undefined', function() {
                var ctrl = $componentController('directionalityPicker', null, {model: undefined});
                expect(ctrl.$onInit).toThrow('Directionality picker must be initialised with a model');
            });

            it('should set the model to EITHER if the model is null', function() {
                var ctrl = $componentController('directionalityPicker', null, {model: null});
                ctrl.$onInit();
                expect(ctrl.model).toEqual('EITHER');
            });

            it('should throw an error if the model is anything other than "EITHER", "OUTGOING" or "INCOMING"', function() {
                var ctrl = $componentController('directionalityPicker', null, {model: "invalid"});
                expect(ctrl.$onInit).toThrow('Model must be one of: "EITHER", "OUTGOING", "INCOMING" or null but was: "invalid"');
            });
        })
    });
});
