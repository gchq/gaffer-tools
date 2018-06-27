describe('The time service', function() {

    var $rootScope;

    var service;

    beforeEach(module('app'));

    beforeEach(module(function($provide) {
        $provide.factory('config', function($q) {
            return {
                get: function() {
                    return $q.when({
                        "time": {
                            'properties': {
                                'startDate': {
                                    "class": "java.lang.Date",
                                    "unit": "millisecond"
                                },
                                'endDate': {
                                    "class": "java.lang.Date",
                                    "unit": "millisecond"
                                },
                                'dateInMilliseconds': {
                                    "class": "java.lang.Date",
                                    "unit": "millisecond"
                                },
                                'dateInSeconds': {
                                    "class": "java.lang.Date",
                                    "unit": "second"
                                }
                            }
                        }
                    });
                }
            }
        });
    }));

    beforeEach(inject(function(_$rootScope_, _time_) {
        $rootScope = _$rootScope_;
        service = _time_;
    }));

    beforeEach(function() {
        $rootScope.$digest();
    });

    describe('isValidUnit', function() {
        it('should return true when time unit is valid', function() {
            var isValid = service.isValidUnit('SECOND');
            expect(isValid).toBe(true);
        });

        it('should return false when time unit is not valid', function() {
            var isValid = service.isValidUnit('unknownUnit');
            expect(isValid).toBe(false);
        });
    });

    describe('getUnitErrorMsg', function() {
        it('should return error message with provided time unit', function() {
            var msg = service.getUnitErrorMsg('unknownUnit');
            expect(msg).toEqual('Unknown time unit - unknownUnit. Must be one of: day, hour, minute, second, millisecond or microsecond (defaults to millisecond)');
        });
    });

    describe('isTimeProperty', function() {
        it('should return true when property is a time property', function() {
            var result = service.isTimeProperty('startDate');
            expect(result).toBe(true);
        });

        it('should return false when property is not a time property', function() {
            var result = service.isTimeProperty('count');
            expect(result).toBe(false);
        });

        it('should return false when property is undefined', function() {
            var result = service.isTimeProperty(undefined);
            expect(result).toBe(false);
        });
    });

    describe('getDateString', function() {
        var expectedDateString = 'date string';
        var expectedTimeString = 'time string';
        beforeEach(function() {
            spyOn(window, 'moment').and.callFake(function() {
                return {
                    format: function(str) {
                        return expectedDateString + ' ' + expectedTimeString
                    }
                }
            });
        });

        it('should return a date string for a time property in milliseconds', function() {
            var dateString = service.getDateString('dateInMilliseconds', 1519986711199);
            // the result is in UTC
            expect(dateString).toEqual('2018-03-02 10:31:51');
        });

        it('should return a date string for a time property in seconds', function() {
            var dateString = service.getDateString('dateInSeconds', 1519986711);
            // the result depends on what your local date settings are set to
            expect(dateString).toEqual('2018-03-02 10:31:51');
        });

        it('should return a provided value for a non time property', function() {
            var dateString = service.getDateString('count', 10);
            expect(dateString).toEqual(10);
        });
    });

    describe('convertNumberToDate', function() {
        it('should convert microseconds to date', function() {
            var dateString = service.convertNumberToDate(1519986711199123, 'microsecond');
            expect(dateString).toEqual(new Date(1519986711199));
        });

        it('should convert milliseconds to date', function() {
            var dateString = service.convertNumberToDate(1519986711199, 'millisecond');
            expect(dateString).toEqual(new Date(1519986711199));
        });

        it('should convert seconds to date', function() {
            var dateString = service.convertNumberToDate(1519986711, 'second');
            expect(dateString).toEqual(new Date(1519986711000));
        });

        it('should convert minutes to date', function() {
            var dateString = service.convertNumberToDate(25333111, 'minute');
            expect(dateString).toEqual(new Date(1519986660000));
        });

        it('should convert hours to date', function() {
            var dateString = service.convertNumberToDate(422218, 'hour');
            expect(dateString).toEqual(new Date(1519984800000));
        });

        it('should convert days to date', function() {
            var dateString = service.convertNumberToDate(17592, 'day');
            expect(dateString).toEqual(new Date(1519948800000));
        });

        it('should convert unknown unit to date', function() {
            var dateString = service.convertNumberToDate(1519986711199, 'unknown');
            expect(dateString).toEqual(new Date(1519986711199));
        });
    });

    describe('convertDateToNumber', function() {
        it('should convert date to microseconds', function() {
            var result = service.convertDateToNumber(new Date(1519986711199), 'microsecond');
            expect(result).toEqual(1519986711199000);
        });

        it('should convert date to milliseconds', function() {
            var result = service.convertDateToNumber(new Date(1519986711199), 'millisecond');
            expect(result).toEqual(1519986711199);
        });

        it('should convert date to seconds', function() {
            var result = service.convertDateToNumber(new Date(1519986711000), 'second');
            expect(result).toEqual(1519986711);
        });

        it('should convert date to minutes', function() {
            var result = service.convertDateToNumber(new Date(1519986660000), 'minute');
            expect(result).toEqual(25333111);
        });

        it('should convert date to hours', function() {
            var result = service.convertDateToNumber(new Date(1519984800000), 'hour');
            expect(result).toEqual(422218);
        });

        it('should convert date to days', function() {
            var result = service.convertDateToNumber(new Date(1519948800000), 'day');
            expect(result).toEqual(17592);
        });

        it('should convert unknown date to milliseconds', function() {
            var result = service.convertDateToNumber(new Date(1519986711199), 'unknown');
            expect(result).toEqual(1519986711199);
        });
    });
});
