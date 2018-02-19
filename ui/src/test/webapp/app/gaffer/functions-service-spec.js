describe('The functions service', function() {
    var service;
    var $rootScope, $httpBackend;

    beforeEach(module('app'));

    beforeEach(module(function($provide) {
        $provide.factory('config', function($q) {
            var get = function() {
                return $q.when({ restEndpoint: "http://localhost:8080/rest/latest"});
            }

            return {
                get: get
            }
        });
        $provide.factory('schema', function($q) {
            return {
                get: function() {
                    return $q.when({});
                },
                getSchemaVertices: function() {
                    return []
                }
            }
        });
    }));

    beforeEach(inject(function(_functions_, _$rootScope_, _$httpBackend_) {
        service = _functions_;
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
    }));

    describe('functions.getFunctions()', function() {
        // deferred until #399 is completed
    });

    describe('functions.getFunctionParameters()', function() {
        var fields;

        var onSuccess = function(serialisedFields) {
            fields = serialisedFields;
        }

        afterEach(function() {
            $httpBackend.resetExpectations();
        });

        it('should call the get serialised fields endpoint with the class name', function() {
            $httpBackend.expectGET('http://localhost:8080/rest/latest/graph/config/serialisedFields/a.java.Class').respond(200, '["a", "b", "c"]')
            service.getFunctionParameters('a.java.Class', onSuccess);
            $httpBackend.flush();
            expect(fields).toEqual(['a', 'b', 'c']);
        });

        it('should log the error if something goes wrong with the request', function() {
            spyOn(console, 'log').and.stub();

            $httpBackend.expectGET('http://localhost:8080/rest/latest/graph/config/serialisedFields/a.java.Class').respond(500, '{"simpleMessage": "something went really wrong"}');
            service.getFunctionParameters('a.java.Class', onSuccess);
            $httpBackend.flush();
            expect(console.log).toHaveBeenCalledWith({"simpleMessage": "something went really wrong"});
        });

        it('should alert the user if something goes wrong with the request', function() {
            spyOn(window, 'alert').and.stub();

            $httpBackend.expectGET('http://localhost:8080/rest/latest/graph/config/serialisedFields/a.java.Class').respond(500, '{"simpleMessage": "something went really wrong"}');
            service.getFunctionParameters('a.java.Class', onSuccess);
            $httpBackend.flush();
            expect(window.alert).toHaveBeenCalledWith('Failed to get serialised fields for a.java.Class.\nsomething went really wrong');
        });

        it('should alert the user if the error that comes back is an empty string', function() {
            spyOn(window, 'alert').and.stub();
            $httpBackend.expectGET('http://localhost:8080/rest/latest/graph/config/serialisedFields/a.java.Class').respond(500, '');
            service.getFunctionParameters('a.java.Class', onSuccess);
            $httpBackend.flush();
            expect(window.alert).toHaveBeenCalledWith('Failed to get serialised fields for a.java.Class.\n');
        });

        it('should alert the user if the error that comes back is null', function() {
            spyOn(window, 'alert').and.stub();
            $httpBackend.expectGET('http://localhost:8080/rest/latest/graph/config/serialisedFields/a.java.Class').respond(500, null);
            service.getFunctionParameters('a.java.Class', onSuccess);
            $httpBackend.flush();
            expect(window.alert).toHaveBeenCalledWith('Failed to get serialised fields for a.java.Class.\n');
        });

        it('should alert the user if the error that comes back is undefined', function() {
            spyOn(window, 'alert').and.stub();
            $httpBackend.expectGET('http://localhost:8080/rest/latest/graph/config/serialisedFields/a.java.Class').respond(500, undefined);
            service.getFunctionParameters('a.java.Class', onSuccess);
            $httpBackend.flush();
            expect(window.alert).toHaveBeenCalledWith('Failed to get serialised fields for a.java.Class.\n');
        });
    });
});