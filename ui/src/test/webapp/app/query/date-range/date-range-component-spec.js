describe('The date range component', function() {
    var ctrl;
    var scope;
    var $componentController;
    var time;
    var startDate, endDate;

    beforeEach(module('app'));

    beforeEach(inject(function(_$rootScope_, _$componentController_, _time_) {
        scope = _$rootScope_.$new();
        $componentController = _$componentController_;
        time = _time_;
    }));

    beforeEach(function() {
        spyOn(time, 'getStartDate').and.callFake(function() {
            return startDate;
        });

        spyOn(time, 'getEndDate').and.callFake(function() {
            return endDate;
        });
    });

    beforeEach(function() {
        startDate = undefined;
        endDate = undefined;
    });

    var createValidController = function() {
        createController({"end": {"property": "prop1", "class": "aClass"}, "start": {"property": "myPropName", "class": "my.java.class"}});
    }

    var createController = function(conf) {
        ctrl = $componentController('dateRange', {$scope: scope}, {conf: conf})
    }

    describe('ctrl.$onInit()', function() {
        it('should throw an exception if the config is null', function() {
            createController(null);
            expect(ctrl.$onInit).toThrow('Config Error: Date range must be configured');
        });

        it('should throw an exception if the config is null', function() {
            createController(undefined);
            expect(ctrl.$onInit).toThrow('Config Error: Date range must be configured');
        });

        it('should throw an exception if the start date is not configured', function() {
            createController({"end": {}});
            expect(ctrl.$onInit).toThrow('Config Error: You must specify the configuration for the start and end date');
        });

        it('should throw an exception if the end date is not configured', function() {
            createController({"start": {}});
            expect(ctrl.$onInit).toThrow('Config Error: You must specify the configuration for the start and end date');
        });

        it('should throw an exception if the property is missing from the start date configuration', function() {
            createController({"start": {}, "end": {"property": "myPropName"}});
            expect(ctrl.$onInit).toThrow('Config Error: You must specify the start and end property');
        });

        it('should throw an exception if the property is missing from the end date configuration', function() {
            createController({"end": {}, "start": {"property": "myPropName"}});
            expect(ctrl.$onInit).toThrow('Config Error: You must specify the start and end property');
        });

        it('should throw an exception if the class is missing from the start date configuration', function() {
            createController({"start": {"property": "prop1"}, "end": {"property": "myPropName", "class": "my.java.class"}});
            expect(ctrl.$onInit).toThrow('Config Error: You must specify the class for the start and end');
        });

        it('should throw an exception if the class is missing from the start date configuration', function() {
            createController({"end": {"property": "prop1"}, "start": {"property": "myPropName", "class": "my.java.class"}});
            expect(ctrl.$onInit).toThrow('Config Error: You must specify the class for the start and end');
        });

        it('should throw an exception if the start date unit is set to anything other than milliseconds, microseconds or seconds', function() {
            createController({"start": {"property": "prop1", "class": "aClass", "unit": "unknownUnit"}, "end": {"property": "myPropName", "class": "my.java.class"}});
            expect(ctrl.$onInit).toThrow('Config Error: Unknown start time unit - unknownUnit. Must be one of seconds, milliseconds or microseconds (defaults to milliseconds)');
        });

        it('should throw an exception if the end date unit is set to anything other than milliseconds, microseconds or seconds', function() {
            createController({"end": {"property": "prop1", "class": "aClass", "unit": "unknownUnit"}, "start": {"property": "myPropName", "class": "my.java.class"}});
            expect(ctrl.$onInit).toThrow('Config Error: Unknown end time unit - unknownUnit. Must be one of seconds, milliseconds or microseconds (defaults to milliseconds)');
        });

        it('should not throw an exception if units are left out of the config', function() {
            createController({"end": {"property": "prop1", "class": "aClass"}, "start": {"property": "myPropName", "class": "my.java.class"}});
            expect(ctrl.$onInit).not.toThrow(jasmine.anything());
        });

        describe('When config is valid', function() {
            beforeEach(function() {
                createValidController();
            });

            it('should leave the start date as null if the time service returns an undefined value', function() {
                ctrl.$onInit();
                expect(ctrl.startDate).toEqual(null);
            });

            it('should leave the end date as null if the time service returns an undefined value', function() {
                ctrl.$onInit();
                expect(ctrl.endDate).toEqual(null);
            });

            it('should set the initial value of the start date if one exists in the time service', function() {
                startDate = 123456789;
                ctrl.$onInit();
                expect(ctrl.startDate).toEqual(new Date(123456789));
            });

            it('should set the initial value of the end date if one exists in the time service', function() {
                endDate = 123456789;
                ctrl.$onInit();
                expect(ctrl.endDate).toEqual(new Date(123456789));
            });

            it('should convert the value if the unit is seconds', function() {
                startDate = 123456789;
                ctrl.conf.start.unit = 'seconds';
                ctrl.$onInit();
                expect(ctrl.startDate).toEqual(new Date(123456789000));
            });

            it('should convert the value if the unit is microseconds', function() {
                startDate = 123456789999;
                ctrl.conf.start.unit = 'microseconds';
                ctrl.$onInit();
                expect(ctrl.startDate).toEqual(new Date(123456790));
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
            spyOn(time, 'setStartDate').and.callFake(function(date) {
                serviceStartDate = date;
            });
        });

        it('should set the time services start date to undefined if vm.start is undefined', function() {
            ctrl.startDate = undefined;
            ctrl.onStartDateUpdate();
            expect(time.setStartDate).toHaveBeenCalledWith(undefined);
            expect(time.setStartDate).toHaveBeenCalledTimes(1);
            expect(serviceStartDate).toEqual(undefined);
        });

        it('should set the time services start date to undefined if vm.start is null', function() {
            ctrl.startDate = null;
            ctrl.onStartDateUpdate();
            expect(time.setStartDate).toHaveBeenCalledWith(undefined);
            expect(time.setStartDate).toHaveBeenCalledTimes(1);
            expect(serviceStartDate).toEqual(undefined);
        });

        it('should set the time to be 0', function() {
            ctrl.startDate = new Date(1516620668948);
            ctrl.onStartDateUpdate();
            expect(time.setStartDate).toHaveBeenCalledWith(1516579200000)
            expect(time.setStartDate).toHaveBeenCalledTimes(1);
            expect(serviceStartDate).toEqual(1516579200000);
        });

        it('should divide by 1000 when the time unit is seconds', function() {
            ctrl.startDate = new Date(1516579200000);
            ctrl.conf.start.unit = 'seconds';
            ctrl.onStartDateUpdate();
            expect(time.setStartDate).toHaveBeenCalledWith(1516579200);
            expect(time.setStartDate).toHaveBeenCalledTimes(1);
            expect(serviceStartDate).toEqual(1516579200);
        });

        it('should multiply the value by 1000 when the time unit is microseconds', function() {
            ctrl.startDate = new Date(96389748);
            ctrl.conf.start.unit = 'microseconds';
            ctrl.onStartDateUpdate();
            expect(time.setStartDate).toHaveBeenCalledWith(86400000000);
            expect(time.setStartDate).toHaveBeenCalledTimes(1);
            expect(serviceStartDate).toEqual(86400000000);
        });

        it('should work for dates before Jan 1 1970', function() {
            ctrl.startDate = new Date(-1);
            ctrl.onStartDateUpdate();
            expect(time.setStartDate).toHaveBeenCalledWith(-86400000);
            expect(time.setStartDate).toHaveBeenCalledTimes(1);
            expect(serviceStartDate).toEqual(-86400000);
        });

        it('should work for seconds on dates before Jan 1 1970', function() {
            ctrl.startDate = new Date(-1);
            ctrl.conf.start.unit = 'seconds';
            ctrl.onStartDateUpdate();
            expect(time.setStartDate).toHaveBeenCalledWith(-86400);
            expect(time.setStartDate).toHaveBeenCalledTimes(1);
            expect(serviceStartDate).toEqual(-86400);
        });

        it('should work for microseconds on dates before Jan 1 1970', function() {
            ctrl.startDate = new Date(-1);
            ctrl.conf.start.unit = 'microseconds';
            ctrl.onStartDateUpdate();
            expect(time.setStartDate).toHaveBeenCalledWith(-86400000000);
            expect(time.setStartDate).toHaveBeenCalledTimes(1);
            expect(serviceStartDate).toEqual(-86400000000);
        });

        it('should work for Jan 1 1970', function() {
            ctrl.startDate = new Date(1);
            ctrl.onStartDateUpdate();
            expect(time.setStartDate).toHaveBeenCalledWith(0);
            expect(time.setStartDate).toHaveBeenCalledTimes(1);
            expect(serviceStartDate).toEqual(0);
        });

        it('should work for Jan 1 1970 if units are in seconds', function() {
            ctrl.startDate = new Date(1);
            ctrl.conf.start.unit = 'seconds';
            ctrl.onStartDateUpdate();
            expect(time.setStartDate).toHaveBeenCalledWith(0);
            expect(time.setStartDate).toHaveBeenCalledTimes(1);
            expect(serviceStartDate).toEqual(0);
        });

        it('should work for Jan 1 1970 if units are in microseconds', function() {
            ctrl.startDate = new Date(1);
            ctrl.conf.start.unit = 'microseconds';
            ctrl.onStartDateUpdate();
            expect(time.setStartDate).toHaveBeenCalledWith(0);
            expect(time.setStartDate).toHaveBeenCalledTimes(1);
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
            spyOn(time, 'setEndDate').and.callFake(function(date) {
                serviceEndDate = date;
            });
        });

        it('should set the time services end date to undefined if vm.endDate is undefined', function() {
            ctrl.endDate = undefined;
            ctrl.onEndDateUpdate();
            expect(time.setEndDate).toHaveBeenCalledWith(undefined);
            expect(time.setEndDate).toHaveBeenCalledTimes(1);
            expect(serviceEndDate).toEqual(undefined);
        });

        it('should set the time services end date to undefined if vm.endDate is null', function() {
            ctrl.endDate = null;
            ctrl.onEndDateUpdate();
            expect(time.setEndDate).toHaveBeenCalledWith(undefined);
            expect(time.setEndDate).toHaveBeenCalledTimes(1);
            expect(serviceEndDate).toEqual(undefined);
        });

        it('should set the time to be 0', function() {
            ctrl.endDate = new Date(1516620668948);
            ctrl.onEndDateUpdate();
            expect(time.setEndDate).toHaveBeenCalledWith(1516665599999)
            expect(time.setEndDate).toHaveBeenCalledTimes(1);
            expect(serviceEndDate).toEqual(1516665599999);
        });

        it('should divide by 1000 when the time unit is seconds', function() {
            ctrl.endDate = new Date(1516620668948);
            ctrl.conf.end.unit = 'seconds';
            ctrl.onEndDateUpdate();
            expect(time.setEndDate).toHaveBeenCalledWith(1516665599);
            expect(time.setEndDate).toHaveBeenCalledTimes(1);
            expect(serviceEndDate).toEqual(1516665599);
        });

        it('should multiply the value by 1000 when the time unit is microseconds', function() {
            ctrl.endDate = new Date(96389748);
            ctrl.conf.end.unit = 'microseconds';
            ctrl.onEndDateUpdate();
            expect(time.setEndDate).toHaveBeenCalledWith(172799999999);
            expect(time.setEndDate).toHaveBeenCalledTimes(1);
            expect(serviceEndDate).toEqual(172799999999);
        });

        it('should work for dates before Jan 1 1970', function() {
            ctrl.endDate = new Date(-10);
            ctrl.onEndDateUpdate();
            expect(time.setEndDate).toHaveBeenCalledWith(-1);
            expect(time.setEndDate).toHaveBeenCalledTimes(1);
            expect(serviceEndDate).toEqual(-1);
        });

        it('should work for seconds on dates before Jan 1 1970', function() {
            ctrl.endDate = new Date(-10);
            ctrl.conf.end.unit = 'seconds';
            ctrl.onEndDateUpdate();
            expect(time.setEndDate).toHaveBeenCalledWith(-1);
            expect(time.setEndDate).toHaveBeenCalledTimes(1);
            expect(serviceEndDate).toEqual(-1);
        });

        it('should work for microseconds on dates before Jan 1 1970', function() {
            ctrl.endDate = new Date(-100);
            ctrl.conf.end.unit = 'microseconds';
            ctrl.onEndDateUpdate();
            expect(time.setEndDate).toHaveBeenCalledWith(-1);
            expect(time.setEndDate).toHaveBeenCalledTimes(1);
            expect(serviceEndDate).toEqual(-1);
        });

        it('should work for Jan 1 1970', function() {
            ctrl.endDate = new Date(1);
            ctrl.onEndDateUpdate();
            expect(time.setEndDate).toHaveBeenCalledWith(86399999);
            expect(time.setEndDate).toHaveBeenCalledTimes(1);
            expect(serviceEndDate).toEqual(86399999);
        });

        it('should work for Jan 1 1970 if units are seconds', function() {
            ctrl.endDate = new Date(1);
            ctrl.conf.end.unit = 'seconds';
            ctrl.onEndDateUpdate();
            expect(time.setEndDate).toHaveBeenCalledWith(86399);
            expect(time.setEndDate).toHaveBeenCalledTimes(1);
            expect(serviceEndDate).toEqual(86399);
        });

        it('should work for Jan 1 1970 if units are microseconds', function() {
            ctrl.endDate = new Date(1);
            ctrl.conf.end.unit = 'microseconds';
            ctrl.onEndDateUpdate();
            expect(time.setEndDate).toHaveBeenCalledWith(86399999999);
            expect(time.setEndDate).toHaveBeenCalledTimes(1);
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
        });
    });
});