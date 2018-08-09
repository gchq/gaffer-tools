describe('The Dynamic Date picker component', function() {
    var ctrl;
    var $componentController

    beforeEach(module('app'));

    beforeEach(inject(function(_$componentController_) {
        $componentController = _$componentController_;
    }));

    var createController = function(name, param, unit) {
        ctrl = $componentController('dynamicDatePicker', null, {name: name, param: param, unit: unit})
    }

    describe('ctrl.$onInit()', function() {
        var error, types;

        var fakeTypeFields;

        beforeEach(inject(function(_error_, _types_) {
            error = _error_;
            types = _types_;
        }));

        beforeEach(function() {
            spyOn(error, 'handle').and.stub();

            spyOn(types, 'getFields').and.callFake(function(unusedValue) { return fakeTypeFields });
        });

        beforeEach(function() {
            fakeTypeFields = [
                {
                    type: 'number'
                }
            ]
        })

        it('should error if no model is present', function() {
            createController('test', undefined, 'millisecond');
            expect(ctrl.$onInit).toThrow('Unable to create dynamic date picker as there is no model present');
        });

        it('should error if the model class contains more than 1 field', function() {
            fakeTypeFields = [ {type: 'number'}, {type: 'text'}];
            createController('test', {}, 'millisecond')
            expect(ctrl.$onInit).toThrow('Unsupported date class detected. Must be a number or string');
        });

        it('should error if no unit is present and the type is number', function() {
            createController('test', {}, null);
            expect(ctrl.$onInit).toThrow('Unable to create dynamic date picker as no unit was supplied');
        });

        it('should not throw error if unit is missing and the type is text', function() {
            fakeTypeFields = [
                {
                    type: 'text'
                }
            ]
            createController('test', {}, null);
            expect(ctrl.$onInit).not.toThrow('Unable to create dynamic date picker as no unit was supplied');
        })

        it('should error if no name is present', function() {
            createController(undefined, {}, 'milliseconds');
            expect(ctrl.$onInit).not.toThrow('Unable to create dynamic date picker as no unit was supplied');
        });

        it('should error if the models field type is anything other than text or number', function() {
            fakeTypeFields = [
                {
                    type: 'boolean'
                }
            ]
            createController('test', {}, 'milliseconds');
            expect(ctrl.$onInit).toThrow('Unable to create dynamic date picker. Expected model to be of type "text" or "number". However it was "boolean"')
        });

        it('should reload the view', function() {
            createController('test', {}, 'milliseconds');
            spyOn(ctrl, 'updateView').and.stub();
            ctrl.$onInit();
            expect(ctrl.updateView).toHaveBeenCalled();
        });
    });
});