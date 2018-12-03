describe('The date range component', function() {
    var ctrl;
    var scope;
    var $componentController;
    var isValidUnit = true;
    var time;
    var model;
    var startDate, endDate;

    beforeEach(module('app'));

    beforeEach(inject(function(_$rootScope_, _$componentController_, _time_) {
        scope = _$rootScope_.$new();
        $componentController = _$componentController_;
        time = _time_;
    }));

    beforeEach(function() {

        spyOn(time, 'isValidUnit').and.callFake(function() {
            return isValidUnit;
        });
    });

    beforeEach(function() {
        model = {
            startDate: null,
            endDate: null
        }
        isValidUnit = true;
    });

    var createValidController = function() {
        createController({"filter": {"endProperty": "prop1", "class": "aClass", "startProperty": "myPropName"}});
    }

    var createController = function(conf) {
        ctrl = $componentController('dateRange', {$scope: scope}, {conf: conf, model: model});
    }

    describe('ctrl.$onInit()', function() {
        it('should throw an exception if the config is null', function() {
            createController(null);
            expect(ctrl.$onInit).toThrow('Config Error: Date range must be configured');
        });

        it('should throw an exception if the config is undefined', function() {
            createController(undefined);
            expect(ctrl.$onInit).toThrow('Config Error: Date range must be configured');
        });

        it('should throw an exception if the date filter is not configured', function() {
            createController({});
            expect(ctrl.$onInit).toThrow('Config Error: You must specify the configuration for the date filter');
        });

        it('should throw an exception if the start property is missing from the filter configuration', function() {
            createController({"filter": { "endProperty": "blah" }});
            expect(ctrl.$onInit).toThrow('Config Error: You must specify the start and end property');
        });

        it('should throw an exception if the end property is missing from the filter configuration', function() {
            createController({"filter": { "startProperty": "blah"}});
            expect(ctrl.$onInit).toThrow('Config Error: You must specify the start and end property');
        });

        it('should throw an exception if the class is missing from the configuration', function() {
            createController({"filter": {"startProperty": "prop1", "endProperty": "myPropName"}});
            expect(ctrl.$onInit).toThrow('Config Error: You must specify the class for the start and end');
        });

        it('should throw an exception if the date unit not valid', function() {
            isValidUnit = false;
            createController({"filter": {"startProperty": "prop1", "class": "aClass", "unit": "unknownUnit", "endProperty": "property"}});
            expect(ctrl.$onInit).toThrow('Config Error: Unknown time unit - unknownUnit. Must be one of: day, hour, minute, second, millisecond or microsecond (defaults to millisecond)');
        });

        it('should not throw an exception if units are left out of the config', function() {
            createController({"filter": {"endProperty": "prop1", "class": "aClass", "startProperty": "myPropName"}});
            expect(ctrl.$onInit).not.toThrow(jasmine.anything());
        });

        describe('When config is valid', function() {
            beforeEach(function() {
                createValidController();
            });

            beforeEach(function() {
                spyOn(Date.prototype, 'getTimezoneOffset').and.returnValue(0);  // assume it's utc time
            })

            it('should leave the start date as null if the date range service returns an undefined value', function() {
                ctrl.$onInit();
                expect(ctrl.startDate).toEqual(null);
            });

            it('should leave the end date as null if the date range service returns an undefined value', function() {
                ctrl.$onInit();
                expect(ctrl.endDate).toEqual(null);
            });

            it('should set the initial value of the start date if one exists in the model', function() {
                model.startDate = 123456789;
                ctrl.$onInit();
                expect(ctrl.startDate).toEqual(new Date(123456789));
            });

            it('should set the initial value of the start time if one exists in the model', function() {
                model.startDate = 1530627916000    // 03/07/2018 @ 14:25:16 (UTC)
                ctrl.$onInit()
                var expectedDate = moment.utc([1970, 0, 1, 14, 25, 16]).toDate();
                expect(ctrl.startTime).toEqual(expectedDate)
            });

            it('should set the initial value of the end date if one exists in the model', function() {
                model.endDate = 123456789;
                ctrl.$onInit();
                expect(ctrl.endDate).toEqual(new Date(123456789));
            });

            it('should set the initial value of the end time if one exists in the model', function() {
                model.endDate = 1530627916000    // 03/07/2018 @ 14:25:16 (UTC)
                ctrl.$onInit()
                var expectedDate = moment.utc([1970, 0, 1, 14, 25, 16]).toDate();
                expect(ctrl.endTime).toEqual(expectedDate)
            });

            it('should convert the value if the unit is second', function() {
                model.startDate = 123456789;
                ctrl.conf.filter.unit = 'SECOND';
                ctrl.$onInit();
                expect(ctrl.startDate).toEqual(new Date(123456789000));
            });

            it('should convert the value if the unit is microsecond', function() {
                model.startDate = 123456789999;
                ctrl.conf.filter.unit = 'microsecond';
                ctrl.$onInit();
                expect(ctrl.startDate).toEqual(new Date(123456789)); // should round down
            });

            it('should convert the value if the unit is minute', function() {
                model.startDate = 123456
                ctrl.conf.filter.unit = 'MINUTE';
                ctrl.$onInit();
                expect(ctrl.startDate).toEqual(new Date(123456 * 60 * 1000));
            });

            it('should convert the value if the unit is hour', function() {
                model.startDate = 123456;
                ctrl.conf.filter.unit = 'hour';
                ctrl.$onInit();
                expect(ctrl.startDate).toEqual(new Date(123456 * 60 * 60 * 1000));
            });

            it('should convert the value if the unit is day', function() {
                model.startDate = 123456;
                ctrl.conf.filter.unit = 'DAY';
                ctrl.$onInit();
                expect(ctrl.startDate).toEqual(new Date(123456 * 60 * 60 * 1000 * 24));
            });

            it('should set the preset values if specified', function() {
                createController({"filter": {"endProperty": "prop1", "class": "aClass", "startProperty": "myPropName", "presets": {"today": {
                    "offset": 0
                }}}});

                ctrl.$onInit();

                expect(ctrl.presets).toEqual({'today': { 'offset': 0}});
            });

            it('should set the preset values to undefined if not specified', function() {
                createValidController();
                ctrl.$onInit();
                expect(ctrl.presets).toBeUndefined();
            });
        });

        describe('When there is a UTC offset locally', function() {

            beforeEach(function() {
                createValidController();
            });

            it('should adjust the controllers model so that it appears the user is entering UTC time', function() {
                spyOn(Date.prototype, 'getTimezoneOffset').and.returnValue(-120);  // assume it's we're two hours ahead of UTC 
                model.startDate = 123456789;
                var offsetInMillis = 120 * 60 * 1000;

                ctrl.$onInit();
                expect(ctrl.startDate).toEqual(new Date(123456789 - offsetInMillis));
            });
        });
    });

    describe('ctrl.updateStartDate()', function() {

        var error;

        beforeEach(function() {
            createValidController();
        });

        beforeEach(inject(function(_error_) {
            error = _error_;
        }))

        beforeEach(function() {
            spyOn(ctrl, 'onStartDateUpdate').and.stub();
            spyOn(error, 'handle').and.stub();
        })

        it('should set the the start date when using an offset and unit of days', function() {
            var threeDaysAgo = new moment().subtract(3, 'days').startOf('day').toDate();

            ctrl.updateStartDate({'offset': -3, 'unit': 'day'});

            expect(ctrl.startDate).toEqual(threeDaysAgo);
            expect(ctrl.onStartDateUpdate).toHaveBeenCalled();
        });

        it('should set the start date when using an offset and unit of weeks', function() {
            var fiveWeeksAgo = new moment().subtract(5, 'weeks').startOf('day').toDate();

            ctrl.updateStartDate({'offset': -5, 'unit': 'weeks'});

            expect(ctrl.startDate).toEqual(fiveWeeksAgo);
            expect(ctrl.onStartDateUpdate).toHaveBeenCalled();
        });

        it('should set the start date when using an offset and unit of months', function() {
            var sixMonthsAgo = new moment().subtract(6, 'months').startOf('day').toDate();

            ctrl.updateStartDate({'offset': -6, 'unit': 'month'});

            expect(ctrl.startDate).toEqual(sixMonthsAgo);
            expect(ctrl.onStartDateUpdate).toHaveBeenCalled();
        });

        it('should set the start date when using an offset and unit of years', function() {
            var oneYearAgo = new moment().subtract(1, 'year').startOf('day').toDate();

            ctrl.updateStartDate({'offset': -1, 'unit': 'year'});

            expect(ctrl.startDate).toEqual(oneYearAgo);
            expect(ctrl.onStartDateUpdate).toHaveBeenCalled();
        });

        it('should set the start date when using an exact date', function() {
            var twoThousandAndTwo = new Date(2002, 0, 1, 0, 0, 0);
            ctrl.updateStartDate({'date': '2002-01-01'});

            expect(ctrl.startDate).toEqual(twoThousandAndTwo);
            expect(ctrl.onStartDateUpdate).toHaveBeenCalled();
        });

        it('should error if given a null value', function() {
            ctrl.updateStartDate(null);
            expect(error.handle).toHaveBeenCalled();
        });

        it('should error if given an offset without a unit', function() {
            ctrl.updateStartDate({ 'offset': 20});
            expect(error.handle).toHaveBeenCalled();
        });

        it('should error if given a unit without an offset', function() {
            ctrl.updateStartDate({ 'unit': 'days'});
            expect(error.handle).toHaveBeenCalled();
        });
    });

    describe('ctrl.updateEndDate()', function() {
        var error;

        beforeEach(function() {
            createValidController();
        });

        beforeEach(inject(function(_error_) {
            error = _error_;
        }));

        beforeEach(function() {
            spyOn(ctrl, 'onEndDateUpdate').and.stub();
            spyOn(error, 'handle').and.stub();
        });
        
        it('should set the the end date when using an offset and unit of days', function() {
            var threeDaysAgo = new moment().subtract(3, 'days').startOf('day').toDate();

            ctrl.updateEndDate({'offset': -3, 'unit': 'day'});

            expect(ctrl.endDate).toEqual(threeDaysAgo);
            expect(ctrl.onEndDateUpdate).toHaveBeenCalled();
        });

        it('should set the end date when using an offset and unit of weeks', function() {
            var fiveWeeksAgo = new moment().subtract(5, 'weeks').startOf('day').toDate();

            ctrl.updateEndDate({'offset': -5, 'unit': 'weeks'});

            expect(ctrl.endDate).toEqual(fiveWeeksAgo);
            expect(ctrl.onEndDateUpdate).toHaveBeenCalled();
        });

        it('should set the end date when using an offset and unit of months', function() {
            var sixMonthsAgo = new moment().subtract(6, 'months').startOf('day').toDate();

            ctrl.updateEndDate({'offset': -6, 'unit': 'month'});

            expect(ctrl.endDate).toEqual(sixMonthsAgo);
            expect(ctrl.onEndDateUpdate).toHaveBeenCalled();
        });

        it('should set the end date when using an offset and unit of years', function() {
            var oneYearAgo = new moment().subtract(1, 'year').startOf('day').toDate();

            ctrl.updateEndDate({'offset': -1, 'unit': 'year'});

            expect(ctrl.endDate).toEqual(oneYearAgo);
            expect(ctrl.onEndDateUpdate).toHaveBeenCalled();
        });

        it('should set the end date when using an exact date', function() {
            var twoThousandAndTwo = new Date(2002, 0, 2, 0, 0, 0);
            ctrl.updateEndDate({'date': '2002-01-02'});

            expect(ctrl.endDate).toEqual(twoThousandAndTwo);
            expect(ctrl.onEndDateUpdate).toHaveBeenCalled();
        });

        it('should error if given a null value', function() {
            ctrl.updateStartDate(null);
            expect(error.handle).toHaveBeenCalled();
        });

        it('should error if given an offset without a unit', function() {
            ctrl.updateStartDate({ 'offset': 20});
            expect(error.handle).toHaveBeenCalled();
        });

        it('should error if given a unit without an offset', function() {
            ctrl.updateStartDate({ 'unit': 'days'});
            expect(error.handle).toHaveBeenCalled();
        });
    })

    describe('ctrl.onStartDateUpdate()', function() {

        beforeEach(function() {
            createValidController();
        });

        beforeEach(function() {
            spyOn(Date.prototype, 'getTimezoneOffset').and.returnValue(0);  // assume it's utc time
        })

        it('should set the model start date to null if vm.start is undefined', function() {
            ctrl.startDate = undefined;
            ctrl.onStartDateUpdate();
            expect(model.startDate).toEqual(null);
        });

        it('should set the date range services start date to null if vm.start is null', function() {
            ctrl.startDate = null;
            ctrl.onStartDateUpdate();
            expect(model.startDate).toEqual(null);
        });

        it('should divide by 1000 when the time unit is second', function() {
            ctrl.startDate = new Date(1516579200000);
            ctrl.conf.filter.unit = 'second';
            ctrl.onStartDateUpdate();
            expect(model.startDate).toEqual(1516579200);
        });

        it('should divide by (1000 x 60) when the time unit is minute', function() {
            ctrl.startDate = new Date(1516579200000);
            ctrl.conf.filter.unit = 'MINUTE';
            ctrl.onStartDateUpdate();
            expect(model.startDate).toEqual((1516579200000 / (60 * 1000)));
        });

        it('should divide by (1000 x 60 x 60) when the time unit is hour', function() {
            ctrl.startDate = new Date(1516579200000);
            ctrl.conf.filter.unit = 'hour';
            ctrl.onStartDateUpdate();
            expect(model.startDate).toEqual((1516579200000 / (60 * 60 * 1000)));
        });

        it('should divide by (1000 x 60 x 60 x 24) when the time unit is day', function() {
            ctrl.startDate = new Date(1516579200000);
            ctrl.conf.filter.unit = 'day';
            ctrl.onStartDateUpdate();
            expect(model.startDate).toEqual((1516579200000 / (60 * 60 * 24 * 1000)));
        });

        it('should multiply the value by 1000 when the time unit is microsecond', function() {
            ctrl.startDate = new Date(86400000);
            ctrl.conf.filter.unit = 'microsecond';
            ctrl.onStartDateUpdate();
            expect(model.startDate).toEqual(86400000000);
        });

        it('should work for dates before Jan 1 1970', function() {
            ctrl.startDate = new Date(-86400000);
            ctrl.onStartDateUpdate();
            expect(model.startDate).toEqual(-86400000);
        });

        it('should work for seconds on dates before Jan 1 1970', function() {
            ctrl.startDate = new Date(-86400000);
            ctrl.conf.filter.unit = 'second';
            ctrl.onStartDateUpdate();
            expect(model.startDate).toEqual(-86400);
        });

        it('should work for microseconds on dates before Jan 1 1970', function() {
            ctrl.startDate = new Date(-86400000);
            ctrl.conf.filter.unit = 'microsecond';
            ctrl.onStartDateUpdate();
            expect(model.startDate).toEqual(-86400000000);
        });

        it('should work for Jan 1 1970', function() {
            ctrl.startDate = new Date(0);
            ctrl.onStartDateUpdate();
            expect(model.startDate).toEqual(0);
        });

        it('should work for Jan 1 1970 if units are seconds', function() {
            ctrl.startDate = new Date(0);
            ctrl.conf.filter.unit = 'second';
            ctrl.onStartDateUpdate();
            expect(model.startDate).toEqual(0);
        });

        it('should work for Jan 1 1970 if units are microseconds', function() {
            ctrl.startDate = new Date(0);
            ctrl.conf.filter.unit = 'microsecond';
            ctrl.onStartDateUpdate();
            expect(model.startDate).toEqual(0);
        });

        describe('The start time', function() {
            beforeEach(function() {
                ctrl.startDate = new Date(1516579200000);
            });

            it('should not affect the start date if the time is undefined', function() {
                ctrl.startTime = undefined;
                ctrl.onStartDateUpdate();
                expect(model.startDate).toEqual(1516579200000);
            });

            it('should not affect the start date if the time is null', function() {
                ctrl.startTime = null;
                ctrl.onStartDateUpdate();
                expect(model.startDate).toEqual(1516579200000);
            });

            it('should set the time for the start Date if it exists', function() {
                ctrl.startTime = moment.utc([1970, 0, 1, 10, 30, 15]).toDate() // 10:30:15
                ctrl.onStartDateUpdate();
                expect(model.startDate).toEqual(1516617015000) // date + time
            });

            it('should round down when converting to less precise units', function() {
                ctrl.startTime = moment.utc([1970, 0, 1, 10, 30, 15]).toDate(); // 10:30:15
                ctrl.conf.filter.unit = 'hour';
                ctrl.onStartDateUpdate();
                expect(model.startDate).toEqual(Math.floor((1516579200000 + 37815000) / (60 * 60 * 1000))) // 22 Jan 2018 10:00
            });
        });
    });

    describe('ctrl.onEndDateUpdate()', function() {

        beforeEach(function() {
            createValidController();
        });

        it('should set the date range services end date to null if vm.endDate is undefined', function() {
            ctrl.endDate = undefined;
            ctrl.onEndDateUpdate();
            expect(model.endDate).toEqual(null);
        });

        it('should set the date range services end date to null if vm.endDate is null', function() {
            ctrl.endDate = null;
            ctrl.onEndDateUpdate();
            expect(model.endDate).toEqual(null);
        });

        it('should set the time to be the end of the day', function() {
            ctrl.endDate = new Date(1516620668948);
            ctrl.onEndDateUpdate();
            expect(model.endDate).toEqual(1516665599999);
        });

        it('should divide by 1000 when the time unit is second', function() {
            ctrl.endDate = new Date(1516620668948);
            ctrl.conf.filter.unit = 'second';
            ctrl.onEndDateUpdate();
            expect(model.endDate).toEqual(1516665599);
        });

        it('should divide by (1000 x 60) and round down when the time unit is minute', function() {
            ctrl.endDate = new Date(1516620668948);
            ctrl.conf.filter.unit = 'minute';
            ctrl.onEndDateUpdate();
            expect(model.endDate).toEqual(Math.floor(1516665599999 / (1000 * 60)));
        });

        it('should divide by (1000 x 60 x 60) and round down when the time unit is hour', function() {
            ctrl.endDate = new Date(1516620668948);
            ctrl.conf.filter.unit = 'hour';
            ctrl.onEndDateUpdate();
            expect(model.endDate).toEqual(Math.floor(1516665599999 / (1000 * 60 * 60)));
        });

        it('should divide by (1000 x 60 x 60 x 24) and round down when the time unit is day', function() {
            ctrl.endDate = new Date(1516620668948);
            ctrl.conf.filter.unit = 'day';
            ctrl.onEndDateUpdate();
            expect(model.endDate).toEqual(Math.floor(1516665599999 / (1000 * 60 * 60 * 24)));
        });

        it('should multiply the value by 1000 when the time unit is microsecond', function() {
            ctrl.endDate = new Date(96389748);
            ctrl.conf.filter.unit = 'microsecond';
            ctrl.onEndDateUpdate();

            var expected = (moment.utc([1970, 0, 2, 23, 59, 59, 999]).valueOf() * 1000) + 999
            expect(model.endDate).toEqual(expected);
        });

        it('should work for dates before Jan 1 1970', function() {
            ctrl.endDate = moment([1969, 11, 5, 0, 0, 0]).toDate();
            var expected = moment.utc([1969, 11, 5, 23, 59, 59, 999]).valueOf();
            ctrl.onEndDateUpdate();

            expect(model.endDate).toEqual(expected);
        });

        it('should work for seconds on dates before Jan 1 1970', function() {
            ctrl.endDate = moment([1960, 5, 20, 0, 0, 0]).toDate();
            ctrl.conf.filter.unit = 'second';
            ctrl.onEndDateUpdate();

            var expected = moment.utc([1960, 5, 20, 23, 59, 59]).valueOf() / 1000;
            expect(model.endDate).toEqual(expected);
        });

        it('should work for microseconds on dates before Jan 1 1970', function() {
            ctrl.endDate = moment([1969, 11, 31, 0, 0, 0]).toDate();
            ctrl.conf.filter.unit = 'microsecond';
            ctrl.onEndDateUpdate();

            var expected = moment.utc([1969, 11, 31, 23, 59, 59, 999]).valueOf() * 1000 + 999;
            expect(model.endDate).toEqual(-1);
        });

        it('should work for Jan 1 1970', function() {
            ctrl.endDate = new Date(1);
            ctrl.onEndDateUpdate();
            expect(model.endDate).toEqual(86399999);
        });

        it('should work for Jan 1 1970 if units are second', function() {
            ctrl.endDate = new Date(1);
            ctrl.conf.filter.unit = 'second';
            ctrl.onEndDateUpdate();
            expect(model.endDate).toEqual(86399);
        });

        it('should work for Jan 1 1970 if units are microseconds', function() {
            ctrl.endDate = new Date(1);
            ctrl.conf.filter.unit = 'microsecond';
            ctrl.onEndDateUpdate();
            expect(model.endDate).toEqual(86399999999);
        });

        describe('The end time', function() {
            beforeEach(function() {
                ctrl.endDate = moment.utc([2018, 0, 22]).toDate();
            });

            it('should not affect the end date if the time is undefined', function() {
                ctrl.endTime = undefined;
                ctrl.onEndDateUpdate();
                expect(model.endDate).toEqual(1516665599999);
            });

            it('should not affect the end date if the time is null', function() {
                ctrl.endTime = null;
                ctrl.onEndDateUpdate();
                expect(model.endDate).toEqual(1516665599999);
            });

            it('should set the time for the end Date if it exists', function() {
                ctrl.endTime = moment.utc([1970, 0, 1, 10, 30, 15]).toDate();  // 10:30:15
                ctrl.onEndDateUpdate();
                expect(model.endDate).toEqual(1516617015999) // date + time + 999 ms
            });

            it('should round down when using a less precise time unit', function() {
                ctrl.endTime = moment.utc([1970, 0, 1, 10, 30, 15]).toDate(); // 10:30:25
                ctrl.conf.filter.unit = 'Day';
                ctrl.onEndDateUpdate();
                expect(model.endDate).toEqual(Math.floor((moment.utc([2018, 0, 22]).valueOf() + 37815000) / (1000 * 60 * 60 * 24))) // just the date
            });
        });
    });
});
