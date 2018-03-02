describe('The date range component', function() {
    var ctrl;
    var scope;
    var $componentController;
    var isValidUnit = true;
    var dateRange, time;
    var startDate, endDate;

    beforeEach(module('app'));

    beforeEach(inject(function(_$rootScope_, _$componentController_, _dateRange_, _time_) {
        scope = _$rootScope_.$new();
        $componentController = _$componentController_;
        dateRange = _dateRange_;
        time = _time_;
    }));

    beforeEach(function() {
        spyOn(dateRange, 'getStartDate').and.callFake(function() {
            return startDate;
        });

        spyOn(dateRange, 'getEndDate').and.callFake(function() {
            return endDate;
        });

        spyOn(time, 'isValidUnit').and.callFake(function() {
            return isValidUnit;
        });
    });

    beforeEach(function() {
        startDate = undefined;
        endDate = undefined;
        isValidUnit = true;
    });

    var createValidController = function() {
        createController({"filter": {"endProperty": "prop1", "class": "aClass", "startProperty": "myPropName"}});
    }

    var createController = function(conf) {
        ctrl = $componentController('dateRange', {$scope: scope}, {conf: conf})
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

            it('should leave the start date as null if the date range service returns an undefined value', function() {
                ctrl.$onInit();
                expect(ctrl.startDate).toEqual(null);
            });

            it('should leave the end date as null if the date range service returns an undefined value', function() {
                ctrl.$onInit();
                expect(ctrl.endDate).toEqual(null);
            });

            it('should set the initial value of the start date if one exists in the date range service', function() {
                startDate = 123456789;
                ctrl.$onInit();
                expect(ctrl.startDate).toEqual(new Date(123456789));
            });

            it('should set the initial value of the end date if one exists in the date range service', function() {
                endDate = 123456789;
                ctrl.$onInit();
                expect(ctrl.endDate).toEqual(new Date(123456789));
            });

            it('should convert the value if the unit is second', function() {
                startDate = 123456789;
                ctrl.conf.filter.unit = 'SECOND';
                ctrl.$onInit();
                expect(ctrl.startDate).toEqual(new Date(123456789000));
            });

            it('should convert the value if the unit is microsecond', function() {
                startDate = 123456789999;
                ctrl.conf.filter.unit = 'microsecond';
                ctrl.$onInit();
                expect(ctrl.startDate).toEqual(new Date(123456789)); // should round down
            });

            it('should convert the value if the unit is minute', function() {
                startDate = 123456
                ctrl.conf.filter.unit = 'MINUTE';
                ctrl.$onInit();
                expect(ctrl.startDate).toEqual(new Date(123456 * 60 * 1000));
            });

            it('should convert the value if the unit is hour', function() {
                startDate = 123456;
                ctrl.conf.filter.unit = 'hour';
                ctrl.$onInit();
                expect(ctrl.startDate).toEqual(new Date(123456 * 60 * 60 * 1000));
            });

            it('should convert the value if the unit is day', function() {
                startDate = 123456;
                ctrl.conf.filter.unit = 'DAY';
                ctrl.$onInit();
                expect(ctrl.startDate).toEqual(new Date(123456 * 60 * 60 * 1000 * 24));
            });
        });
    });

    describe('ctrl.onStartDateUpdate()', function() {
        var serviceStartDate;

        beforeEach(function() {
            createValidController();
        });

        beforeEach(function() {
            serviceStartDate = undefined;
        });

        beforeEach(function() {
            spyOn(dateRange, 'setStartDate').and.callFake(function(date) {
                serviceStartDate = date;
            });
        });

        it('should set the date range services start date to undefined if vm.start is undefined', function() {
            ctrl.startDate = undefined;
            ctrl.onStartDateUpdate();
            expect(dateRange.setStartDate).toHaveBeenCalledWith(undefined);
            expect(dateRange.setStartDate).toHaveBeenCalledTimes(1);
            expect(serviceStartDate).toEqual(undefined);
        });

        it('should set the date range services start date to undefined if vm.start is null', function() {
            ctrl.startDate = null;
            ctrl.onStartDateUpdate();
            expect(dateRange.setStartDate).toHaveBeenCalledWith(undefined);
            expect(dateRange.setStartDate).toHaveBeenCalledTimes(1);
            expect(serviceStartDate).toEqual(undefined);
        });

        it('should set the time to be 0', function() {
            ctrl.startDate = new Date(1516620668948);
            ctrl.onStartDateUpdate();
            expect(dateRange.setStartDate).toHaveBeenCalledWith(1516579200000)
            expect(dateRange.setStartDate).toHaveBeenCalledTimes(1);
            expect(serviceStartDate).toEqual(1516579200000);
        });

        it('should divide by 1000 when the time unit is second', function() {
            ctrl.startDate = new Date(1516579200000);
            ctrl.conf.filter.unit = 'second';
            ctrl.onStartDateUpdate();
            expect(dateRange.setStartDate).toHaveBeenCalledWith(1516579200);
            expect(dateRange.setStartDate).toHaveBeenCalledTimes(1);
            expect(serviceStartDate).toEqual(1516579200);
        });

        it('should divide by (1000 x 60) when the time unit is minute', function() {
            ctrl.startDate = new Date(1516579200000);
            ctrl.conf.filter.unit = 'MINUTE';
            ctrl.onStartDateUpdate();
            expect(dateRange.setStartDate).toHaveBeenCalledWith((1516579200000 / (60 * 1000)));
            expect(dateRange.setStartDate).toHaveBeenCalledTimes(1);
            expect(serviceStartDate).toEqual((1516579200000 / (60 * 1000)));
        });

        it('should divide by (1000 x 60 x 60) when the time unit is hour', function() {
            ctrl.startDate = new Date(1516579200000);
            ctrl.conf.filter.unit = 'hour';
            ctrl.onStartDateUpdate();
            expect(dateRange.setStartDate).toHaveBeenCalledWith((1516579200000 / (60 * 60 * 1000)));
            expect(dateRange.setStartDate).toHaveBeenCalledTimes(1);
            expect(serviceStartDate).toEqual((1516579200000 / (60 * 60 * 1000)));
        });

        it('should divide by (1000 x 60 x 60 x 24) when the time unit is day', function() {
            ctrl.startDate = new Date(1516579200000);
            ctrl.conf.filter.unit = 'day';
            ctrl.onStartDateUpdate();
            expect(dateRange.setStartDate).toHaveBeenCalledWith((1516579200000 / (60 * 60 * 1000 * 24)));
            expect(dateRange.setStartDate).toHaveBeenCalledTimes(1);
            expect(serviceStartDate).toEqual((1516579200000 / (60 * 60 * 24 * 1000)));
        });

        it('should multiply the value by 1000 when the time unit is microsecond', function() {
            ctrl.startDate = new Date(96389748);
            ctrl.conf.filter.unit = 'microsecond';
            ctrl.onStartDateUpdate();
            expect(dateRange.setStartDate).toHaveBeenCalledWith(86400000000);
            expect(dateRange.setStartDate).toHaveBeenCalledTimes(1);
            expect(serviceStartDate).toEqual(86400000000);
        });

        it('should work for dates before Jan 1 1970', function() {
            ctrl.startDate = new Date(-1);
            ctrl.onStartDateUpdate();
            expect(dateRange.setStartDate).toHaveBeenCalledWith(-86400000);
            expect(dateRange.setStartDate).toHaveBeenCalledTimes(1);
            expect(serviceStartDate).toEqual(-86400000);
        });

        it('should work for seconds on dates before Jan 1 1970', function() {
            ctrl.startDate = new Date(-1);
            ctrl.conf.filter.unit = 'second';
            ctrl.onStartDateUpdate();
            expect(dateRange.setStartDate).toHaveBeenCalledWith(-86400);
            expect(dateRange.setStartDate).toHaveBeenCalledTimes(1);
            expect(serviceStartDate).toEqual(-86400);
        });

        it('should work for microseconds on dates before Jan 1 1970', function() {
            ctrl.startDate = new Date(-1);
            ctrl.conf.filter.unit = 'microsecond';
            ctrl.onStartDateUpdate();
            expect(dateRange.setStartDate).toHaveBeenCalledWith(-86400000000);
            expect(dateRange.setStartDate).toHaveBeenCalledTimes(1);
            expect(serviceStartDate).toEqual(-86400000000);
        });

        it('should work for Jan 1 1970', function() {
            ctrl.startDate = new Date(1);
            ctrl.onStartDateUpdate();
            expect(dateRange.setStartDate).toHaveBeenCalledWith(0);
            expect(dateRange.setStartDate).toHaveBeenCalledTimes(1);
            expect(serviceStartDate).toEqual(0);
        });

        it('should work for Jan 1 1970 if units are seconds', function() {
            ctrl.startDate = new Date(1);
            ctrl.conf.filter.unit = 'second';
            ctrl.onStartDateUpdate();
            expect(dateRange.setStartDate).toHaveBeenCalledWith(0);
            expect(dateRange.setStartDate).toHaveBeenCalledTimes(1);
            expect(serviceStartDate).toEqual(0);
        });

        it('should work for Jan 1 1970 if units are microseconds', function() {
            ctrl.startDate = new Date(1);
            ctrl.conf.filter.unit = 'microsecond';
            ctrl.onStartDateUpdate();
            expect(dateRange.setStartDate).toHaveBeenCalledWith(0);
            expect(dateRange.setStartDate).toHaveBeenCalledTimes(1);
            expect(serviceStartDate).toEqual(0);
        });

        describe('The start time', function() {
            beforeEach(function() {
                ctrl.startDate = new Date(1516579200000);
            });

            it('should not affect the start date if the time is undefined', function() {
                ctrl.startTime = undefined;
                ctrl.onStartDateUpdate();
                expect(serviceStartDate).toEqual(1516579200000);
            });

            it('should not affect the start date if the time is null', function() {
                ctrl.startTime = null;
                ctrl.onStartDateUpdate();
                expect(serviceStartDate).toEqual(1516579200000);
            });

            it('should set the time for the start Date if it exists', function() {
                ctrl.startTime = new Date(37815000)  // 10:30:15
                ctrl.onStartDateUpdate();
                expect(serviceStartDate).toEqual(1516617015000) // date + time
            });

            it('should round down when converting to less precise units', function() {
                ctrl.startTime = new Date(37815000)  // 10:30:15
                ctrl.conf.filter.unit = 'hour';
                ctrl.onStartDateUpdate();
                expect(serviceStartDate).toEqual(Math.floor((1516579200000 + 37815000) / (60 * 60 * 1000))) // 22 Jan 2018 10:00
            });
        });
    });

    describe('ctrl.onEndDateUpdate()', function() {
        var serviceEndDate;

        beforeEach(function() {
            createValidController();
        });

        beforeEach(function() {
            serviceEndDate = undefined;
        });

        beforeEach(function() {
            spyOn(dateRange, 'setEndDate').and.callFake(function(date) {
                serviceEndDate = date;
            });
        });

        it('should set the date range services end date to undefined if vm.endDate is undefined', function() {
            ctrl.endDate = undefined;
            ctrl.onEndDateUpdate();
            expect(dateRange.setEndDate).toHaveBeenCalledWith(undefined);
            expect(dateRange.setEndDate).toHaveBeenCalledTimes(1);
            expect(serviceEndDate).toEqual(undefined);
        });

        it('should set the date range services end date to undefined if vm.endDate is null', function() {
            ctrl.endDate = null;
            ctrl.onEndDateUpdate();
            expect(dateRange.setEndDate).toHaveBeenCalledWith(undefined);
            expect(dateRange.setEndDate).toHaveBeenCalledTimes(1);
            expect(serviceEndDate).toEqual(undefined);
        });

        it('should set the time to be 0', function() {
            ctrl.endDate = new Date(1516620668948);
            ctrl.onEndDateUpdate();
            expect(dateRange.setEndDate).toHaveBeenCalledWith(1516665599999)
            expect(dateRange.setEndDate).toHaveBeenCalledTimes(1);
            expect(serviceEndDate).toEqual(1516665599999);
        });

        it('should divide by 1000 when the time unit is second', function() {
            ctrl.endDate = new Date(1516620668948);
            ctrl.conf.filter.unit = 'second';
            ctrl.onEndDateUpdate();
            expect(dateRange.setEndDate).toHaveBeenCalledWith(1516665599);
            expect(dateRange.setEndDate).toHaveBeenCalledTimes(1);
            expect(serviceEndDate).toEqual(1516665599);
        });

        it('should divide by (1000 x 60) and round down when the time unit is minute', function() {
            ctrl.endDate = new Date(1516620668948);
            ctrl.conf.filter.unit = 'minute';
            ctrl.onEndDateUpdate();
            expect(dateRange.setEndDate).toHaveBeenCalledWith(Math.floor(1516665599999 / (1000 * 60)));
            expect(dateRange.setEndDate).toHaveBeenCalledTimes(1);
            expect(serviceEndDate).toEqual(Math.floor(1516665599999 / (1000 * 60)));
        });

        it('should divide by (1000 x 60 x 60) and round down when the time unit is hour', function() {
            ctrl.endDate = new Date(1516620668948);
            ctrl.conf.filter.unit = 'hour';
            ctrl.onEndDateUpdate();
            expect(dateRange.setEndDate).toHaveBeenCalledWith(Math.floor(1516665599999 / (1000 * 60 * 60)));
            expect(dateRange.setEndDate).toHaveBeenCalledTimes(1);
            expect(serviceEndDate).toEqual(Math.floor(1516665599999 / (1000 * 60 * 60)));
        });

        it('should divide by (1000 x 60 x 60 x 24) and round down when the time unit is day', function() {
            ctrl.endDate = new Date(1516620668948);
            ctrl.conf.filter.unit = 'day';
            ctrl.onEndDateUpdate();
            expect(dateRange.setEndDate).toHaveBeenCalledWith(Math.floor(1516665599999 / (1000 * 60 * 60 * 24)));
            expect(dateRange.setEndDate).toHaveBeenCalledTimes(1);
            expect(serviceEndDate).toEqual(Math.floor(1516665599999 / (1000 * 60 * 60 * 24)));
        });

        it('should multiply the value by 1000 when the time unit is microsecond', function() {
            ctrl.endDate = new Date(96389748);
            ctrl.conf.filter.unit = 'microsecond';
            ctrl.onEndDateUpdate();
            expect(dateRange.setEndDate).toHaveBeenCalledWith(172799999999);
            expect(dateRange.setEndDate).toHaveBeenCalledTimes(1);
            expect(serviceEndDate).toEqual(172799999999);
        });

        it('should work for dates before Jan 1 1970', function() {
            ctrl.endDate = new Date(-10);
            ctrl.onEndDateUpdate();
            expect(dateRange.setEndDate).toHaveBeenCalledWith(-1);
            expect(dateRange.setEndDate).toHaveBeenCalledTimes(1);
            expect(serviceEndDate).toEqual(-1);
        });

        it('should work for seconds on dates before Jan 1 1970', function() {
            ctrl.endDate = new Date(-10);
            ctrl.conf.filter.unit = 'second';
            ctrl.onEndDateUpdate();
            expect(dateRange.setEndDate).toHaveBeenCalledWith(-1);
            expect(dateRange.setEndDate).toHaveBeenCalledTimes(1);
            expect(serviceEndDate).toEqual(-1);
        });

        it('should work for microseconds on dates before Jan 1 1970', function() {
            ctrl.endDate = new Date(-100);
            ctrl.conf.filter.unit = 'microsecond';
            ctrl.onEndDateUpdate();
            expect(dateRange.setEndDate).toHaveBeenCalledWith(-1);
            expect(dateRange.setEndDate).toHaveBeenCalledTimes(1);
            expect(serviceEndDate).toEqual(-1);
        });

        it('should work for Jan 1 1970', function() {
            ctrl.endDate = new Date(1);
            ctrl.onEndDateUpdate();
            expect(dateRange.setEndDate).toHaveBeenCalledWith(86399999);
            expect(dateRange.setEndDate).toHaveBeenCalledTimes(1);
            expect(serviceEndDate).toEqual(86399999);
        });

        it('should work for Jan 1 1970 if units are second', function() {
            ctrl.endDate = new Date(1);
            ctrl.conf.filter.unit = 'second';
            ctrl.onEndDateUpdate();
            expect(dateRange.setEndDate).toHaveBeenCalledWith(86399);
            expect(dateRange.setEndDate).toHaveBeenCalledTimes(1);
            expect(serviceEndDate).toEqual(86399);
        });

        it('should work for Jan 1 1970 if units are microseconds', function() {
            ctrl.endDate = new Date(1);
            ctrl.conf.filter.unit = 'microsecond';
            ctrl.onEndDateUpdate();
            expect(dateRange.setEndDate).toHaveBeenCalledWith(86399999999);
            expect(dateRange.setEndDate).toHaveBeenCalledTimes(1);
            expect(serviceEndDate).toEqual(86399999999);
        });

        describe('The end time', function() {
            beforeEach(function() {
                ctrl.endDate = new Date(1516620668948);
            });

            it('should not affect the end date if the time is undefined', function() {
                ctrl.endTime = undefined;
                ctrl.onEndDateUpdate();
                expect(serviceEndDate).toEqual(1516665599999);
            });

            it('should not affect the end date if the time is null', function() {
                ctrl.endTime = null;
                ctrl.onEndDateUpdate();
                expect(serviceEndDate).toEqual(1516665599999);
            });

            it('should set the time for the end Date if it exists', function() {
                ctrl.endTime = new Date(37815000)  // 10:30:15
                ctrl.onEndDateUpdate();
                expect(serviceEndDate).toEqual(1516617015000) // date + time
            });

            it('should round down when using a less precise time unit', function() {
                ctrl.endTime = new Date(37815000)  // 10:30:15
                ctrl.conf.filter.unit = 'Day';
                ctrl.onEndDateUpdate();
                expect(serviceEndDate).toEqual(Math.floor((1516620668948 + 37815000) / (1000 * 60 * 60 * 24))) // just the date
            });
        });
    });
});