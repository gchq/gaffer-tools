describe('The functions service', function() {
    var service, error;
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

    beforeEach(inject(function(_functions_, _$rootScope_, _$httpBackend_, _error_) {
        service = _functions_;
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        error = _error_
    }));

    beforeEach(function() {
        spyOn(error, 'handle').and.stub();
    })

    describe('functions.getFunctions()', function() {
        var predicates;

        var onSuccess = function(functions) {
            predicates = functions;
        }

        afterEach(function() {
            $httpBackend.resetExpectations();
        });

        it('should call the functions endpoint with the given class name', function() {
            $httpBackend.expectGET('http://localhost:8080/rest/latest/graph/config/filterFunctions/a.java.Class').respond(200, ['a', 'b', 'c']);
            service.getFunctions('a.java.Class', onSuccess);
            $httpBackend.flush();
            expect(predicates).toEqual(['a', 'b', 'c']);
        });

        it('should make a call to the error message with the context and error', function() {
            $httpBackend.expectGET('http://localhost:8080/rest/latest/graph/config/filterFunctions/a.java.Class').respond(500, {"simpleMessage": "something went really wrong"});
            service.getFunctions('a.java.Class', onSuccess);
            $httpBackend.flush();
            expect(error.handle).toHaveBeenCalledWith('Could not retrieve filter functions for a.java.Class', {"simpleMessage": "something went really wrong"});
        });
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
            $httpBackend.expectGET('http://localhost:8080/rest/latest/graph/config/serialisedFields/a.java.Class/classes').respond(200, {"a": 1, "b": 2, "c": 3})
            service.getFunctionParameters('a.java.Class', onSuccess);
            $httpBackend.flush();
            expect(fields).toEqual({"a": 1, "b": 2, "c": 3});
        });

        it('should make a call to the error message with the context and error if the query fails', function() {
            $httpBackend.expectGET('http://localhost:8080/rest/latest/graph/config/serialisedFields/a.java.Class/classes').respond(500, {"simpleMessage": "something went badly wrong"});
            service.getFunctionParameters('a.java.Class', onSuccess);
            $httpBackend.flush();
            expect(error.handle).toHaveBeenCalledWith('Could not get serialised fields for a.java.Class', {"simpleMessage": "something went badly wrong"});
        });
    });
});
