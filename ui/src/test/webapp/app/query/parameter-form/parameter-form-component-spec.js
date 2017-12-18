describe('The Parameter Form Component', function() {
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
            var ctrl = $componentController('parameterForm');
            expect(ctrl).toBeDefined();
        });


        it('should take a parameter binding', function() {
            var ctrl = $componentController('parameterForm', null, {parameters: "test"});
            expect(ctrl.parameters).toEqual('test');
        });

        it('should log an error to the console if the parameters are null', function() {
            spyOn(console, 'error');
            var ctrl = $componentController('parameterForm', null, {parameters: null});
            ctrl.$onInit();
            expect(console.error).toHaveBeenCalledTimes(1);
            expect(console.error).toHaveBeenCalledWith('Expected defined, non-null value for parameters. Got null');
        });

        it('should log an error to the console if the parameters are undefined', function() {
            spyOn(console, 'error');
            var ctrl = $componentController('parameterForm', null, {});
            ctrl.$onInit();
            expect(console.error).toHaveBeenCalledTimes(1);
            expect(console.error).toHaveBeenCalledWith('Expected defined, non-null value for parameters. Got undefined');
        });

        it('should not log an error the console if the parameters are defined', function() {
            spyOn(console, 'error');
            var ctrl = $componentController('parameterForm', null, {parameters: "test"});
            ctrl.$onInit();
            expect(console.error).not.toHaveBeenCalled();
        });

        it('should expose the getFields() method of the type service', function() {
            spyOn(types, 'getFields').and.callFake(function(value) {
                return "field test"
            });

            var ctrl = $componentController('parameterForm');
            expect(ctrl.getFields()).toEqual('field test');
        });

        describe('When determining whether a parameter field is required', function() {
            var ctrl;

            beforeEach(function() {
                ctrl = $componentController('parameterForm');
            });

            it('should return false if the parameter is required and the field does not have the required flag', function() {
                var field = {
                    "class": "some.java.Class",
                    "type": "string"
                };

                var parameter = {
                    required: true
                }

                expect(ctrl.isRequired(field, parameter)).toBeFalsy();
            });

            it('should return false if the parameter is required and the field has a required flag set to false', function() {
                var field = {
                    "class": "some.java.Class",
                    "type": "string",
                    "required": false
                };

                var parameter = {
                    required: true
                }

                expect(ctrl.isRequired(field, parameter)).toBeFalsy();
            });

            it('should return true if the parameter is required but the required flag is set to true', function() {
                var field = {
                    "class": "some.java.Class",
                    "type": "string",
                    "required": true
                };

                var parameter = {
                    required: true
                }

                expect(ctrl.isRequired(field, parameter)).toBeTruthy();
            });

            it('should return false if the required flag on the parameter is set to false', function() {
                var field = {
                    "class": "some.java.Class",
                    "type": "string",
                    "required": true
                };

                var parameter = {
                    required: false
                }

                expect(ctrl.isRequired(field, parameter)).toBeFalsy();
            })
        });


    })
});