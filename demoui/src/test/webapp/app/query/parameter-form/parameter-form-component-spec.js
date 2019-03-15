describe('The Parameter Form Component', function() {
    beforeEach(module('app'));

    describe('The Controller', function() {
        var $componentController;
        var types

        beforeEach(inject(function(_$componentController_, _types_) {
            $componentController = _$componentController_;
            types = _types_;
        }));

        it('should exist', function() {
            var ctrl = $componentController('parameterForm');
            expect(ctrl).toBeDefined();
        });


        it('should take a parameter binding', function() {
            var ctrl = $componentController('parameterForm', null, {parameters: "test"});
            expect(ctrl.parameters).toEqual('test');
        });

        it('should take a title binding', function() {
            var ctrl = $componentController('parameterForm', null, {title: "test"});
            expect(ctrl.title).toEqual('test');
        });

        it('should take a titleClass binding', function() {
            var ctrl = $componentController('parameterForm', null, {titleClass: "test"});
            expect(ctrl.titleClass).toEqual('test');
        });

        describe('ctrl.$onInit()', function() {
            it('should throw an error if the parameters are null', function() {
                var ctrl = $componentController('parameterForm', null, {parameters: null});
                expect(ctrl.$onInit).toThrow('Expected defined, non-null value for parameters. Got null')
            });

            it('should throw an error if the parameters are undefined', function() {
                var ctrl = $componentController('parameterForm', null, {});
                expect(ctrl.$onInit).toThrow('Expected defined, non-null value for parameters. Got undefined')
            });

            describe('When parameters are defined', function() {
                var ctrl;

                beforeEach(function() {
                    ctrl = $componentController('parameterForm', null, {parameters: "test"});
                });

                it('should not throw an error if the parameters are defined', function() {
                    expect(ctrl.$onInit).not.toThrow()
                });

                it('should set the title to "Parameters" if it is not set in the bindings', function() {
                    ctrl.$onInit();
                    expect(ctrl.title).toEqual('Parameters');
                });
            });
        });
    })
});
