describe('The schema service', function() {
    var service;
    var $q;
    var $rootScope;
    var config;
    var $httpBackend;

    beforeEach(module('app'));

    beforeEach(module(function($provide) {
        $provide.factory('config', function($q) {
            var get = function() {
                return $q.when({
                    restEndpoint: 'http://localhost:8080/rest'
                });
            }

            return {
                get: get
            }
        });
    }));


    beforeEach(inject(function(_schema_, _$q_, _$rootScope_, _config_, _$httpBackend_) {
        service = _schema_;
        $q = _$q_;
        $rootScope = _$rootScope_;
        config = _config_;
        $httpBackend = _$httpBackend_;
    }));

    describe('schema.get()', function() {

        it('should make a http call using the rest api to get the schema', function() {
            $httpBackend.whenGET('http://localhost:8080/rest/graph/config/schema').respond(200, {"edges": "test"});
            service.get().then(function(schema) {
                expect(schema).toEqual({"edges": "test", "entities": {}, "types": {}});
            });

            $httpBackend.flush();
        });

        it('should not make a second http call once returned', function() {
            $httpBackend.whenGET('http://localhost:8080/rest/graph/config/schema').respond(200, {"edges": "test"});
            service.get();

            $httpBackend.flush();
            $httpBackend.resetExpectations()

            service.get().then(function(schema) {
                expect(schema).toEqual({"edges": "test", "entities": {}, "types": {}});
            });

            $rootScope.$digest();
        });
    });

    describe('schema.update()', function() {
        beforeEach(function() {
            $httpBackend.expectGET('http://localhost:8080/rest/graph/config/schema').respond(200, {});
            $httpBackend.flush();
            $httpBackend.resetExpectations();
        });

        it('should try to use the GetSchema operation first', function() {
            $httpBackend.whenPOST('http://localhost:8080/rest/graph/operations/execute').respond(200, {"entities": "test"});
            service.update().then(function(schema) {
                expect(schema).toEqual({"edges": {}, "entities": "test", "types": {}});
            });

            $httpBackend.flush();
        });

        it('should try and use the /graph/config/schema endpoint if the operation fails', function() {
            $httpBackend.whenPOST('http://localhost:8080/rest/graph/operations/execute').respond(500, {data: "something went wrong"});
            $httpBackend.whenGET('http://localhost:8080/rest/graph/config/schema').respond(200, {"types": "valid schema"});
            service.update().then(function(schema) {
                expect(schema).toEqual({"edges": {}, "entities": {}, "types": "valid schema"});
            });

            $httpBackend.flush();
        });
    });

    describe('schema.getVertexTypesFromEdgeGroup()', function() {
        beforeEach(function() {
            $httpBackend.expectGET('http://localhost:8080/rest/graph/config/schema').respond(200, {
                "edges": {
                    "edgeGroup1": {
                        "source": "string",
                        "destination": "number"
                    }
                },
                "types": {
                    "string": {
                        "class": "java.lang.String"
                    },
                    "number": {
                        "class": "java.lang.Long"
                    }
                }
            });

            $httpBackend.flush();
            $httpBackend.resetExpectations();
        });

        it('should return the source and destination vertex types with their definitions', function() {
            var result = service.getVertexTypesFromEdgeGroup("edgeGroup1");

            expect(result.source).toEqual({
                "string": {
                    "class": "java.lang.String"
                }
            });

            expect(result.destination).toEqual({
                "number": {
                    "class": "java.lang.Long"
                }
            });
        });

        it('should return an empty source/destination if the edge group is not recognised', function() {
            var result = service.getVertexTypesFromEdgeGroup("unknownGroup");
            expect(result).toEqual({
                source: null,
                destination: null
            });
        });
    });

    describe('schema.getVertexTypeFromEntityGroup()', function() {

        beforeEach(function() {
            $httpBackend.expectGET('http://localhost:8080/rest/graph/config/schema').respond(200, {
                "entities": {
                    "entityGroup": {
                        "vertex": "string"
                    }
                },
                "types": {
                    "string": {
                        "class": "java.lang.String"
                    }
                }
            });

            $httpBackend.flush();
            $httpBackend.resetExpectations();
        });

        it('should return the vertex type and it\'s schema definition', function() {
            var result = service.getVertexTypeFromEntityGroup('entityGroup')

            expect(result).toEqual({
                "string": {
                    "class": "java.lang.String"
                }
            });
        });

        it('should return null if the entity group is unknown', function() {
            var result = service.getVertexTypeFromEntityGroup('unknown');
            expect(result).toEqual(null);
        });
    });


    describe('before the schema is initially loaded', function() {
        describe('schema.getVertexTypeFromEntityGroup()', function() {
            it('should return null', function() {
                var result = service.getVertexTypeFromEntityGroup('anyValue');
                expect(result).toBeNull();
            });
        });

        describe('schema.getVertexTypesFromEdgeGroup()', function() {
            it('should return null source and destination', function() {
                var result = service.getVertexTypesFromEdgeGroup('anyValue');
                expect(result).toEqual({
                    source: null,
                    destination: null
                })
            })
        })
    })

    
});