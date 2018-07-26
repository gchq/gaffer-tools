describe('The config service', function() {

    var service, defaultRestEndpoint;
    var $httpBackend, $q, $rootScope;
    var defaultConfig, customConfig;

    beforeEach(module('app'));

    beforeEach(module(function($provide) {
        $provide.factory('schema', function($q) {
            return {
                get: function() {
                    return $q.when({});
                },
                getSchemaVertices: function() {
                    return [];
                }
            }
        });
    }));

    beforeEach(function() {
        defaultConfig = {
            title: "test title1",
            restEndpoint: "defaultEndpoint",
            types: {
                "test.class1": {
                    "value": 1
                },
                "test.class2": {
                    "value": 1
                }
            },
            operations: {
            }
        };

        customConfig = {
            title: "test title2",
            restEndpoint: "customEndpoint",
            types: {
                "test.class1": {
                    "value": 2
                },
                "test.class3": {
                    "value": 2
                }
            },
            operations: {
            }
        };
    })

    beforeEach(inject(function(_config_, _$httpBackend_, _$q_, _defaultRestEndpoint_, _$rootScope_) {
        service = _config_;
        $httpBackend = _$httpBackend_;
        $q = _$q_;
        defaultRestEndpoint = _defaultRestEndpoint_;
        $rootScope = _$rootScope_;
    }));


    describe('config.get()', function() {

        beforeEach(function() {
            spyOn(defaultRestEndpoint, 'get').and.returnValue('test');
        });

        afterEach(function() {
            $httpBackend.resetExpectations()
        });

        it('should add default rest endpoint if it does not exist in the config', function() {
            $httpBackend.whenGET('config/config.json').respond(200, {});
            $httpBackend.whenGET('config/defaultConfig.json').respond(200, {});

            service.get().then(function(config) {
                expect(config.restEndpoint).toEqual('test');
            });

            $httpBackend.flush();
        });

        it('should not make another http request once the config has been resolved', function() {
            $httpBackend.whenGET('config/config.json').respond(200, {});
            $httpBackend.whenGET('config/defaultConfig.json').respond(200, {});

            getCalls = 0;
            service.get().then(function(conf) {
                getCalls ++;
            });

            $httpBackend.flush();
            $httpBackend.resetExpectations();

            service.get().then(function(conf) {
                getCalls ++;
            });

            $rootScope.$digest();
            expect(getCalls).toEqual(2);
        });

        it('should not overwrite an existing rest endpoint with a default', function() {
            $httpBackend.whenGET('config/defaultConfig.json').respond(200, {});
            $httpBackend.expectGET('config/config.json').respond(200, '{ "restEndpoint": "A different test"}');
            service.get().then(function(config) {
                expect(config.restEndpoint).toEqual('A different test');
            });
            $httpBackend.flush();
        });

        it('should not make additional get requests while the first requests are pending', function() {
            $httpBackend.whenGET('config/defaultConfig.json').respond(200, {});
            $httpBackend.expectGET('config/config.json').respond(200, {});

            service.get().then(function(config) {
                expect(config).toBeDefined();
            });

            service.get().then(function (config) {
                expect(config).toBeDefined();
            });

            $httpBackend.flush(2);  // one to the default config, one to the custom config
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should load default config then custom config and merge the responses', function() {
            $httpBackend.whenGET('config/defaultConfig.json').respond(200, defaultConfig);
            $httpBackend.expectGET('config/config.json').respond(200, customConfig);


            service.get().then(function(config) {
                expect(config).toEqual({
                    title: "test title2",
                    restEndpoint: "customEndpoint",
                    types: {
                        "test.class1": {
                            "value": 2
                        },
                        "test.class2": {
                            "value": 1
                        },
                        "test.class3": {
                            "value": 2
                        }
                    },
                    operations: {
                    }
                });
            });

            $httpBackend.flush();
        });

        it('should load default config then custom config and merge the responses without overriding values', function() {

            customConfig = {
                types: {
                    "test.class1": {
                        "value": 2
                    },
                    "test.class3": {
                        "value": 2
                    }
                }
            }

            $httpBackend.expectGET('config/defaultConfig.json').respond(200, defaultConfig);
            $httpBackend.expectGET('config/config.json').respond(200, customConfig);

            service.get().then(function(config) {
                expect(config).toEqual({
                    title: "test title1",
                    restEndpoint: "defaultEndpoint",
                    types: {
                        "test.class1": {
                            "value": 2
                        },
                        "test.class2": {
                            "value": 1
                        },
                        "test.class3": {
                            "value": 2
                        }
                    },
                    operations: {
                    }
                });
            });

            $httpBackend.flush();
        })

        it('should load custom config and handle case when no default config provided', function() {
            $httpBackend.expectGET('config/defaultConfig.json').respond(200, undefined);
            $httpBackend.expectGET('config/config.json').respond(200, customConfig);

            service.get().then(function(config) {
                expect(config).toEqual(customConfig);
            })

            $httpBackend.flush();
        });

        it('should load default config and handle case when no custom config provided', function() {
            $httpBackend.expectGET('config/defaultConfig.json').respond(200, defaultConfig);
            $httpBackend.expectGET('config/config.json').respond(200, undefined);

            service.get().then(function(config) {
                expect(config).toEqual(defaultConfig);
            });

            $httpBackend.flush();
        });


    })
});
