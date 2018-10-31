describe('The schema service', function() {
    var service;
    var $q;
    var $rootScope;
    var operationService;
    var query;
    var operationOptions;
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


    beforeEach(inject(function(_query_, _schema_, _$q_, _$rootScope_, _operationService_, _$httpBackend_, _operationOptions_) {
        service = _schema_;
        $q = _$q_;
        $rootScope = _$rootScope_;
        operationService = _operationService_;
        query = _query_;
        operationOptions = _operationOptions_;
        $httpBackend = _$httpBackend_;
    }));
    
    describe('schema.get()', function() {

        var gafferSchema;

        beforeEach(function() {
            gafferSchema = {
                "edges": {
                    "test": {}
                },
                "entities": {
                    "testEntity": {}
                },
                "types": {
                    "string": {}
                }
            }
        });

        beforeEach(function() {
            // As this service calls update on startup, we make sure this fails to keep the model clean
            $httpBackend.expectPOST('http://localhost:8080/rest/graph/operations/execute').respond(400, undefined);
            $httpBackend.flush();
            $httpBackend.resetExpectations();
        });

        it('should run a GetSchema operation if no previous calls have been made', function() {

            $httpBackend.whenPOST('http://localhost:8080/rest/graph/operations/execute').respond(200, gafferSchema);

            service.get().then(function(returnedSchema) {
                expect(returnedSchema).toEqual(gafferSchema);
            });

            $httpBackend.flush();
        });
        
        it('should only run GetSchema once if two calls are made', function() {
            // will error if called twice
            $httpBackend.expectPOST('http://localhost:8080/rest/graph/operations/execute').respond(200, gafferSchema);

            var assertTheSchemaIsCorrect = function(returnedSchema) {
                expect(returnedSchema).toEqual(gafferSchema);
            }
            service.get().then(assertTheSchemaIsCorrect);
            service.get().then(assertTheSchemaIsCorrect);

            $httpBackend.flush();

        });

        it('should return a pre-existing schema wrapped in a promise if a call is made once the schema is resolved', function() {
            $httpBackend.expectPOST('http://localhost:8080/rest/graph/operations/execute').respond(200, gafferSchema);

            service.get();

            $httpBackend.flush();
            $httpBackend.resetExpectations();

            service.get().then(function(returnedSchema) {
                expect(returnedSchema).toEqual(gafferSchema);
            });

            $rootScope.$digest();

        });

        it('should use the default operation options if returned in the operation service', function() {

            spyOn(operationService, 'createGetSchemaOperation').and.returnValue({
                class: 'GetSchema',
                options: {
                    'a': 'b'
                }
            });

            spyOn(query, 'execute').and.stub();

            service.get();

            expect(query.execute.calls.argsFor(0)[0].options).toEqual({'a': 'b'})
        });

        it('should call the operation options async method to make sure the operation options are the correct defaults', function() {
            spyOn(operationService, 'createGetSchemaOperation').and.returnValue({
                class: 'GetSchema',
                options: {}
            });

            spyOn(operationOptions, 'getDefaultOperationOptionsAsync').and.returnValue($q.when({'a': 'b'}));
            spyOn(query, 'execute').and.stub();
            service.get();

            $rootScope.$digest();

            expect(operationOptions.getDefaultOperationOptionsAsync).toHaveBeenCalled();
            expect(query.execute.calls.argsFor(0)[0].options).toEqual({'a': 'b'})

        });

        it('should resolve all promises if the schema is returned successfully', function() {
            $httpBackend.expectPOST('http://localhost:8080/rest/graph/operations/execute').respond(200, gafferSchema);

            var promisesResolved = 0;

            var callback = function(schema) {
                promisesResolved++;
            }

            service.get().then(callback);
            service.get().then(callback);
            service.get().then(callback);

            $httpBackend.flush();

            expect(promisesResolved).toEqual(3);
        });

        it('should reject all promises if the operation fails', function() {
            $httpBackend.expectPOST('http://localhost:8080/rest/graph/operations/execute').respond(400, 'uh oh');

            var promisesRejected = 0;

            var callback = function(error) {
                promisesRejected++;
            }

            service.get().then(null, callback);
            service.get().then(null, callback);
            service.get().then(null, callback);

            $httpBackend.flush();

            expect(promisesRejected).toEqual(3);
        });

        it('should reject all promises if the query.execute method errors', function() {
            spyOn(query, 'execute').and.throwError();

            var promisesRejected = 0;

            var callback = function(error) {
                promisesRejected++;
            }

            service.get().then(null, callback);
            service.get().then(null, callback);
            service.get().then(null, callback);

            $rootScope.$digest();

            expect(promisesRejected).toEqual(3);

        });

        it('should set entities to an empty object if undefined', function() {
            $httpBackend.expectPOST('http://localhost:8080/rest/graph/operations/execute').respond(200, {});

            service.get().then(function(returnedSchema) {
                var expected = {};
                expect(returnedSchema.entities).toEqual(expected)
            });

            $httpBackend.flush();
        });

        it('should set edges to an empty object if undefined', function() {
            $httpBackend.expectPOST('http://localhost:8080/rest/graph/operations/execute').respond(200, {});

            service.get().then(function(returnedSchema) {
                var expected = {};
                expect(returnedSchema.edges).toEqual(expected)
            });

            $httpBackend.flush();
        });

        it('should set types to an empty object if undefined', function() {
            $httpBackend.expectPOST('http://localhost:8080/rest/graph/operations/execute').respond(200, {});

            service.get().then(function(returnedSchema) {
                var expected = {};
                expect(returnedSchema.types).toEqual(expected)
            });

            $httpBackend.flush();
        });

        // it('should make a http call using the rest api to get the schema', function() {
        //     $httpBackend.whenGET('http://localhost:8080/rest/graph/config/schema').respond(200, {"edges": "test"});
        //     service.get().then(function(schema) {
        //         expect(schema).toEqual({"edges": "test", "entities": {}, "types": {}});
        //     });

        //     $httpBackend.flush();
        // });

        // it('should not make a second http call once returned', function() {
        //     $httpBackend.whenGET('http://localhost:8080/rest/graph/config/schema').respond(200, {"edges": "test"});
        //     service.get();

        //     $httpBackend.flush();
        //     $httpBackend.resetExpectations()

        //     service.get().then(function(schema) {
        //         expect(schema).toEqual({"edges": "test", "entities": {}, "types": {}});
        //     });

        //     $rootScope.$digest();
        // });
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