describe('The config service', function() {

    var service, defaultRestEndpoint;

    var $httpBackend, $q, $rootScope;

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

        beforeEach(function() {
            $httpBackend.expectGET('config/config.json').respond(200, '{}');
        });

        afterEach(function() {
            $httpBackend.resetExpectations()
        });

        it('should add default rest endpoint if it does not exist in the config', function() {
            service.get().then(function(config) {
                expect(config.restEndpoint).toEqual('test');
            });
            $httpBackend.flush();
        });

        it('should not make another http request once the config has been resolved', function() {
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

        it('should not overwrite an existing rest endpoint', function() {
            $httpBackend.resetExpectations();
            $httpBackend.expectGET('config/config.json').respond(200, '{ "restEndpoint": "A different test"}');
            service.get().then(function(config) {
                expect(config.restEndpoint).toEqual('A different test');
            });
            $httpBackend.flush();
        });

        it('should not make additional get requests while the first requests are pending', function() {
            service.get().then(function (config) {
                expect(config).toBeDefined();
            });

            service.get().then(function (config) {
                expect(config).toBeDefined();
            });

            $httpBackend.flush(1);
            $httpBackend.verifyNoOutstandingRequest();
        });


    })
});