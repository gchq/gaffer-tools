describe('The properties service', function() {
    var service, $httpBackend, $q, $rootScope;

    beforeEach(module('app'));

    beforeEach(module(function($provide) {
        $provide.factory('config', function($q) {
            var get = function() {
                return $q.when({});
            }

            return {
                get: get
            }
        });

        $provide.factory('schema', function($q) {
            return {
                get: function() {
                    return $q.when(schema);
                },
                getEdgeProperties: function() {
                    return edgeProperties;
                },
                getEntityProperties: function() {
                    return entityProperties;
                }
            }
        });
    }));

    beforeEach(inject(function(_properties_, _$httpBackend_, _$q_, _$rootScope_) {
        service = _properties_;
        $httpBackend = _$httpBackend_;
        $q = _$q_;
        $rootScope = _$rootScope_;
    }));

    describe('properties.get()', function() {

        var config;

        beforeEach(inject(function(_config_) {
            config = _config_;
        }));


        beforeEach(function() {
            spyOn(config, 'get').and.returnValue($q.when({
                restEndpoint: 'localhost/rest/latest'
            }))
        })

        it('should return the properties of the Gaffer graph', function() {
            $httpBackend.expectGET('http://localhost/rest/latest/properties').respond(200, {'prop': 'val'});
            service.get().then(function(props) {
                expect(props).toEqual({'prop': 'val'});
            });

            $httpBackend.flush();
        });

        it('should make a single http call to fulfil concurrent requests', function() {
            $httpBackend.whenGET('http://localhost/rest/latest/properties').respond(200, {});

            var callsResolved = 0;

            service.get().then(function(props) {
                callsResolved ++;
            });

            service.get().then(function(props) {
                callsResolved ++;
            });

            $httpBackend.flush(1);
            $httpBackend.verifyNoOutstandingRequest();
            expect(callsResolved).toEqual(2);
        });

        it('should allow a second http call once the request has failed', function() {
            $httpBackend.expectGET('http://localhost/rest/latest/properties').respond(404, undefined);

            service.get().then(function(unused) {
                fail('should have failed the first time');
            },
            function(err) {
                // handle error
            });

            $httpBackend.flush();

            $httpBackend.resetExpectations();
            $httpBackend.expectGET('http://localhost/rest/latest/properties').respond(200, 'test');

            service.get().then(function(props) {
                expect(props).toEqual('test');
            },
            function(err) {
                fail('should not have failed this time')
            });

            $httpBackend.flush();

        });

        it('should use the cached values once resolved', function() {
            $httpBackend.whenGET('http://localhost/rest/latest/properties').respond(200, 'test');

            service.get().then(function(props) {
                expect(props).toEqual('test');
            });

            $httpBackend.flush();

            service.get().then(function(props) {
                expect(props).toEqual('test');
            });

            $httpBackend.verifyNoOutstandingRequest();

            $rootScope.$digest();
        });
    });
});
