describe('The Dynamic Date picker component', function() {
    var ctrl;
    var $componentController
    var types, time;

    var fakeTypeFields;

    beforeEach(module('app'));

    beforeEach(inject(function(_$componentController_, _types_, _time_) {
        $componentController = _$componentController_;
        types = _types_;
        time = _time_;
    }));

    beforeEach(function() {
        spyOn(types, 'getFields').and.callFake(function(unusedValue) { return fakeTypeFields });
    });

    beforeEach(function() {
        fakeTypeFields = [
            {
                type: 'number'
            }
        ]
    });

    var createController = function(name, param, unit) {
        ctrl = $componentController('dynamicDatePicker', null, {name: name, param: param, unit: unit})
    }

    describe('ctrl.$onInit()', function() {
        var error;
    
        beforeEach(inject(function(_error_) {
            error = _error_;
        }));

        beforeEach(function() {
            spyOn(error, 'handle').and.stub();
        });

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

    describe('ctrl.onUpdate()', function() {

        beforeEach(function() {
            createController('test', {parts: {}}, 'milliseconds');
            ctrl.$onInit();
        });

        beforeEach(function() {
            ctrl.showTime = false;
        });

        it('should set showTime to true if user selects "choose"', function() {
            ctrl.selectedTime = 'choose';
            ctrl.onUpdate();

            expect(ctrl.showTime).toBeTruthy();
        });

        it('should set time to the current time if the user selects "choose"', function() {
            jasmine.clock().install();
            var now = new Date(2018, 7, 10, 12, 30, 45, 123);
            jasmine.clock().mockDate(now);
            ctrl.selectedTime = 'choose';
            ctrl.onUpdate();

            expect(ctrl.time).toEqual(now);
            jasmine.clock().uninstall()
        });

        it('should set time to the start of the day in UTC if the user selects "start of day"', function() {
            var expected = moment.utc([1970, 0, 1, 0, 0, 0, 0]).toDate();
            ctrl.selectedTime = "start of day";
            ctrl.onUpdate();
            expect(ctrl.time).toEqual(expected);
        });

        it('should set time to the end of the day in UTC if the user selects "end of day"', function() {
            var expected = moment.utc([1970, 0, 1, 23, 59, 59, 999]).toDate();
            ctrl.selectedTime = "end of day";
            ctrl.onUpdate();
            expect(ctrl.time).toEqual(expected);
        });

        it('should hide the time if the user sets it to undefined', function() {
            ctrl.showTime = true;
            ctrl.time = undefined;
            ctrl.onUpdate();
            expect(ctrl.showTime).toEqual(false);
        });

        it('should adjust the minutes of the model according to the timezone', function() {
            ctrl.date = moment([2018, 7, 10]).toDate();
            ctrl.selectedTime = 'end of day';
            ctrl.onUpdate();
            expect(ctrl.param.parts[undefined]).toEqual(moment.utc([2018, 7, 10, 23, 59, 59, 999]).toDate().getTime());
        });

        it('should update a text model in the format: YYYY-MM-DD hh:mm:ss', function() {
            fakeTypeFields = [
                {
                    type: 'text'
                }
            ];
            ctrl.$onInit();
            ctrl.date = moment([2018, 7, 10]).toDate();
            ctrl.selectedTime = 'end of day';
            ctrl.onUpdate();
            expect(ctrl.param.parts[undefined]).toEqual('2018-08-10 23:59:59');
        });

        it('should use the time entered rather than converting it to UTC', function() {
            fakeTypeFields = [
                {
                    type: 'text'
                }
            ];
            ctrl.$onInit();
            ctrl.date = moment([2018, 2, 10]).toDate();
            ctrl.selectedTime = 'start of day';
            ctrl.onUpdate();
            expect(ctrl.param.parts[undefined]).toEqual('2018-03-10 00:00:00');
        });

        it('should work with custom dates', function() {
            fakeTypeFields = [
                {
                    type: 'text'
                }
            ];
            ctrl.$onInit();
            ctrl.showTime = true;
            ctrl.date = moment([2018, 2, 10]).toDate();

            ctrl.time = new Date(0);
            ctrl.time.setUTCHours(14);
            ctrl.time.setUTCMinutes(20);
            ctrl.time.setUTCSeconds(30);

            ctrl.selectedTime = 'choose';
            ctrl.onUpdate();
            expect(ctrl.param.parts[undefined]).toEqual('2018-03-10 14:20:30');
        })

        it('should use the time service to calculate the number using the final value and unit when the outputType is number', function() {
            spyOn(time, 'convertDateToNumber');
            ctrl.date = moment([2018, 2, 10]).toDate();
            ctrl.selectedTime = 'start of day';
            ctrl.onUpdate();
            var expectedDate = moment.utc([2018, 2, 10, 0, 0, 0, 0]).toDate();
            expect(time.convertDateToNumber).toHaveBeenCalledWith(expectedDate, 'milliseconds'); // milliseconds determined in $onInit()
        });

        it('should add 999 to the final value of the model when the units are microseconds', function() {
            ctrl.date = moment([2018, 6, 24]).toDate();
            ctrl.selectedTime = 'end of day';
            ctrl.unit = 'microsecond';
            ctrl.onUpdate();
            var expectedEpoch = (moment.utc([2018, 6, 24, 23, 59, 59, 999]).valueOf() * 1000) + 999
            expect(ctrl.param.parts[undefined]).toEqual(expectedEpoch);
        });
    });

    describe('ctrl.updateView()', function() {
        
    });
});