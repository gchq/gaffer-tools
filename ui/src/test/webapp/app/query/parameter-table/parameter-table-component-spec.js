describe('The Parameter Table Component', function() {
    beforeEach(module('app'));

    describe('The Controller', function() {
        var $componentController;
        var queryPage, types

        beforeEach(inject(function(_$componentController_, _queryPage_, _types_) {
            $componentController = _$componentController_;
            queryPage = _queryPage_;
            types = _types_;
        }));

        it('should exist', function() {
            var ctrl = $componentController('parameterTable');
            expect(ctrl).toBeDefined();
        });


        it('should expose the getSelectedOperation() method of the queryPage service', function() {
            spyOn(queryPage, 'getSelectedOperation').and.returnValue('test');
            var ctrl = $componentController('parameterTable');
            expect(ctrl.getSelectedOp()).toEqual('test');
        });

        it('should expose the getFields() method of the type service', function() {
            spyOn(types, 'getFields').and.callFake(function(value) {
                return "field test"
            });

            var ctrl = $componentController('parameterTable');
            expect(ctrl.getFields()).toEqual('field test');
        });


    })
});