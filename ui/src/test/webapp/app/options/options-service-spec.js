describe('The operation options service', function() {
    var service;

    beforeEach(module('app'));

    beforeEach(module(function($provide) {

        $provide.factory('schema', function($q) {
            return {
                get: function() {
                    return $q.when({});
                }
            }
        });
    }));

    beforeEach(inject(function(_operationOptions_) {
        service = _operationOptions_;
    }));

    describe('operationOptions.setDefaultConfiguration()', function() {
        
        it('should change the value returned by the get method', function() {
            
            service.setDefaultConfiguration('foo');
            expect(service.getDefaultConfiguration()).toEqual('foo');

            service.setDefaultConfiguration('bar');
            expect(service.getDefaultConfiguration()).toEqual('bar');

        });

        it('should not forward any future local updates to the model', function() {
            var localValue = 'foo';

            service.setDefaultConfiguration(localValue);

            localValue = 'bar';

            expect(service.getDefaultConfiguration()).toEqual('foo');
        })
    });

    describe('operationOptions.getDefaultConfiguration()', function() {
        it('should not update the service value in the background as a result of local changes', function() {
            service.setDefaultConfiguration('foo');

            var localValue = service.getDefaultConfiguration();

            localValue = 'bar';

            expect(service.getDefaultConfiguration()).toEqual('foo');
        });
    });

    describe('operationOptions.getDefaultOperationOptionsAsync()', function() {
        var $rootScope, $httpBackend;

        beforeEach(inject(function(_$rootScope_, _$httpBackend_) {
            $rootScope = _$rootScope_;
            $httpBackend = _$httpBackend_;
        }));
        
        beforeEach(function() {
            spyOn(service, 'extractOperationOptions').and.callThrough();
        });


        it('should wrap the operation options in an asynchronous wrapper', function() {
            var existingDefault = {
                visible: [
                    {
                        key: 'key',
                        label: 'label',
                        value: 'value'
                    }
                ]
            }

            service.setDefaultConfiguration(existingDefault);

            service.getDefaultOperationOptionsAsync().then(function(defaultOptions) {
                expect(defaultOptions).toEqual({'key': 'value'});
            });

            $rootScope.$digest();

        });

        it('should return a wrapped undefined value', function() {

            service.setDefaultConfiguration(undefined);

            service.getDefaultOperationOptionsAsync().then(function(defaultOptions) {
                expect(defaultOptions).toEqual(undefined);
            });

            $rootScope.$digest();

        });

        it('should get the configuration and use the operation options if it is set to null', function() {
            $httpBackend.whenGET('config/defaultConfig.json').respond(200, {});
            $httpBackend.whenGET('config/config.json').respond(200, {
                operationOptions: {
                    visible: [
                        {
                            key: 'store.testoption',
                            label: 'test option',
                            value: 'test'
                        }
                    ]    
                }
            });

            service.setDefaultConfiguration(null);

            service.getDefaultOperationOptionsAsync().then(function(defaultOptions) {
                expect(defaultOptions).toEqual({
                    'store.testoption': 'test'
                });
            });

            $httpBackend.flush();
        });
    });

    describe('operationOptions.getDefaultOperationOptions()', function() {
        var valueReturnedByExtractionFunction = null;
        beforeEach(function() {
            spyOn(service, 'extractOperationOptions').and.callFake(function() {
                return valueReturnedByExtractionFunction;
            });
        });

        it('should pass down a null configuration', function() {
            service.setDefaultConfiguration(null);

            service.getDefaultOperationOptions();

            expect(service.extractOperationOptions).toHaveBeenCalledWith(null);
        });

        it('should pass down an undefined configuration', function() {
            service.setDefaultConfiguration(undefined);

            service.getDefaultOperationOptions();

            expect(service.extractOperationOptions).toHaveBeenCalledWith(undefined);
        });

        it('should pass down a set configuration', function() {
            service.setDefaultConfiguration('test');

            service.getDefaultOperationOptions();

            expect(service.extractOperationOptions).toHaveBeenCalledWith('test');
        });

        it('should return the value returned by the extraction function', function() {
            valueReturnedByExtractionFunction = 'test operation options';
            service.setDefaultConfiguration('test');

            var value = service.getDefaultOperationOptions();
            expect(value).toEqual('test operation options');
        });
    });

    describe('operationOptions.extractOperationOptions()', function() {
        it('should return an empty object if the configuration is null', function() {
            service.extractOperationOptions(null);

            expect(service.getDefaultOperationOptions()).toEqual({});
        });

        it('should return undefined if the configuration is undefined', function() {
            service.setDefaultConfiguration(undefined);

            expect(service.getDefaultOperationOptions()).toBeUndefined();
        });

        it('should create an object of key value pairs based on the visible configuration', function() {
            var conf = {
                visible: [
                    {
                        key: 'foo',
                        value: 'bar',
                        label: 'Foo bar'
                    },
                    {
                        key: 'marco',
                        value: 'polo',
                    }
                ]
            };

            var expectedOptions = {
                'foo': 'bar',
                'marco': 'polo'
            }

            expect(service.extractOperationOptions(conf)).toEqual(expectedOptions);
        });

        it('should ignore undefined values', function() {
            var conf = {
                visible: [
                    {
                        key: 'foo',
                        value: 'bar',
                        label: 'Foo bar'
                    },
                    {
                        key: 'marco',
                        value: undefined,
                    }
                ]
            };

            var expectedOptions = {
                'foo': 'bar'
            }

            expect(service.extractOperationOptions(conf)).toEqual(expectedOptions);
        });

        it('should ignore all values in the hidden column', function() {
            var conf = {
                visible: [
                    {
                        key: 'foo',
                        value: 'bar',
                        label: 'Foo bar'
                    },
                    {
                        key: 'marco',
                        value: 'polo',
                    }
                ],
                hidden: [
                    {
                        'key': 'k',
                        'value': 'v'
                    }
                ]
            };

            var expectedOptions = {
                'foo': 'bar',
                'marco': 'polo'
            }

            expect(service.extractOperationOptions(conf)).toEqual(expectedOptions);
        });

        it('should create a comma delimted list from arrays', function() {
            var conf = {
                visible: [
                    {
                        key: 'test',
                        value: ['foo', 'bar'],
                        label: 'Foo bar'
                    }
                ]
            };

            var expectedOptions = {
                'test': 'foo,bar'
            }

            expect(service.extractOperationOptions(conf)).toEqual(expectedOptions);
        });

        it('should ignore empty arrays', function() {
            var conf = {
                visible: [
                    {
                        key: 'test',
                        value: [],
                        label: 'Foo bar'
                    }
                ]
            };

            var expectedOptions = {}

            expect(service.extractOperationOptions(conf)).toEqual(expectedOptions);
        });
    });
});
