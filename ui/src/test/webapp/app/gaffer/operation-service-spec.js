describe('The operation service', function() {

    var service, config;
    var $q, $rootScope;

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
                    return $q.when({});
                },
                getSchemaVertices: function() {
                    return []
                }
            }
        });
    }));

    beforeEach(inject(function(_operationService_, _$q_, _$rootScope_, _config_) {
        service = _operationService_;
        $q = _$q_;
        $rootScope = _$rootScope_;
        config = _config_;
    }));

    describe('operationService.reloadOperations()', function() {
        var $httpBackend;
        var defaultAvailableOperations;
        var namedOperations;
        var error = false;
        var query;

        beforeEach(function() {
            spyOn(config, 'get').and.callFake(function() {
                return $q.when({
                    restEndpoint: 'http://gaffer/rest/latest',
                    operations: {
                    }
                });
            });
        });

        beforeEach(inject(function(_$httpBackend_, _query_) {
            $httpBackend = _$httpBackend_;
            query = _query_;
        }));

        beforeEach(function() {
            spyOn(query, 'execute').and.callFake(function(operation, onSuccess, onFailure) {
                if (error) {
                    onFailure(error)
                } else {
                    onSuccess(namedOperations);
                }
            });
        });

        describe('When the named operations are supported', function() {

            beforeEach(function() {
                $httpBackend.whenGET('http://gaffer/rest/latest/graph/operations/details').respond(200, [
                    {"name": 'uk.gov.gchq.gaffer.named.operation.GetAllNamedOperations'},
                    {"name": 'uk.gov.gchq.gaffer.operation.impl.get.GetElements'}
                ]);
            });

            beforeEach(function() {
                namedOperations = [];
                error = false;
            });

            it('should update the available operations if GetAllNamedOperations is supported', function() {
                namedOperations = [];

                service.getAvailableOperations().then(function(initial) {
                    namedOperations = [
                        {name: 'namedOp', description: 'a test', operations: '{"operations": [{ "class": "GetAllElements" }]}'}
                    ];
                    service.reloadOperations().then(function(unused) {
                        service.getAvailableOperations().then(function(newAvailableOperations) {
                            expect(newAvailableOperations).not.toEqual(initial);
                        });
                    });

                });

                $httpBackend.flush();
            });

            it('should return the available operations when the GetAllNamedOperations is supported', function() {
                service.reloadOperations().then(function(returnedOperations) {
                    service.getAvailableOperations().then(function(newAvailableOperations) {
                        expect(returnedOperations).toEqual(newAvailableOperations);
                    });
                });

                $httpBackend.flush();
            });

            it('should resolve two concurrent calls independently of each other', function() {
                returnedResults = 0;
                service.reloadOperations().then(function(firstNamedOperations) {
                    returnedResults ++;
                });
                service.reloadOperations().then(function(secondNamedOperations) {
                    returnedResults ++;
                });

                $httpBackend.flush();

                expect(returnedResults).toEqual(2);
            });

            it('should not add a GetElementsBetweenSets named operation if it contains no parameters', function() {
                namedOperations = [
                    {name: 'namedOp', operations: '{ "operations": [{"class": "GetElementsBetweenSets"}] }'}
                ];

                service.reloadOperations().then(function(available) {
                    expect(available).toEqual(defaultAvailableOperations);
                });

                $httpBackend.flush();
            });

            it('should not add a GetElementsBetweenSets named operation if it does not contain an inputB parameter', function() {
                namedOperations = [
                    {name: 'namedOp', operations: '{ "operations": [{"class": "GetElementsBetweenSets"}] }', parameters: {"notInputB": { "valueClass": "Iterable"}} }
                ];

                service.reloadOperations().then(function(available) {
                    expect(available).toEqual(defaultAvailableOperations);
                });

                $httpBackend.flush();
            });

            it('should add a GetElementsBetweenSets if it contains an inputB parameter', function() {
                namedOperations = [
                    {name: 'namedOp', operations: '{ "operations": [{"class": "GetElementsBetweenSets"}] }', parameters: {"inputB": { "valueClass": "Iterable"}} }
                ];

                service.reloadOperations().then(function(available) {
                    expect(available[4].inputB).toBeTruthy();
                });

                $httpBackend.flush();
            });

            it('should add a GetElementsBetweenSets if using fully qualified class name', function() {
                namedOperations = [
                    {name: 'namedOp', operations: '{ "operations": [{"class": "uk.gov.gchq.gaffer.accumulostore.operation.impl.GetElementsBetweenSets"}] }', parameters: {"inputB": { "valueClass": "Iterable"}} }
                ];

                service.reloadOperations().then(function(available) {
                    expect(available[4].inputB).toBeTruthy();
                });

                $httpBackend.flush();
            });

            it('should set the input type to Pair if the first named operation is GetElementsInRanges' , function() {
                namedOperations = [
                    {name: 'namedOp', operations: '{ "operations": [{"class": "uk.gov.gchq.gaffer.accumulostore.operation.impl.GetElementsInRanges"}] }', parameters: {"inputB": { "valueClass": "Iterable"}} }
                ];

                service.reloadOperations().then(function(available) {
                    expect(available[4].input).toEqual('uk.gov.gchq.gaffer.commonutil.pair.Pair');
                });

                $httpBackend.flush();
            });

            it('should set the input type to true if the operation is not listed in the config', function() {
                namedOperations = [
                    {name: 'namedOp', operations: '{ "operations": [{"class": "some.other.Operation"}] }', parameters: {"inputB": { "valueClass": "Iterable"}} }
                ];

                service.reloadOperations().then(function(available) {
                    expect(available[4].input).toBeTruthy();
                });

                $httpBackend.flush();
            });

            it('should take the input type of the operation in the config if it exists', function() {
                namedOperations = [
                    {name: 'namedOp', operations: '{ "operations": [{"class": "a.custom.Operation"}] }'}
                ];

                service.reloadOperations().then(function(available) {
                    expect(available[4].input).toEqual("uk.gov.gchq.gaffer.data.element.id.EntityId");
                });

                $httpBackend.flush();
            })

            it('should not cache the result as a reload is being forced', function() {
                service.reloadOperations().then(function(initialAvailableOperations) {
                    namedOperations = [ { name: 'test' , operations: '{"operations": [{ "class": "GetAllElements" }]}'} ];
                    service.reloadOperations().then(function(updatedAvailableOperations) {
                        expect(updatedAvailableOperations).not.toEqual(initialAvailableOperations);
                    });
                });

                $httpBackend.flush();
            });

            it('should return the available operations if the GetAllNamedOperations query fails', function() {
                error = true;

                service.reloadOperations().then(function(availableOperations) {
                    expect(availableOperations).toEqual(defaultAvailableOperations);
                });

                $httpBackend.flush();
            });
        });

        describe('When named operations are not supported', function() {

            beforeEach(function() {
                $httpBackend.expectGET('http://gaffer/rest/latest/graph/operations').respond(200, []);
            });

            it('should return available operations when the GetAllNamedOperations is not supported', function() {
                service.reloadOperations().then(function(availableOps) {
                    expect(availableOps).toEqual(defaultAvailableOperations);
                });

                $httpBackend.flush();
            });

            it('should not make query the API if GetAllNamedOperations is not supported', function() {
                service.reloadOperations().then(function(availableOps) {
                    expect(query.execute).not.toHaveBeenCalled();
                });

                $httpBackend.flush();
            });
        });

        describe('When the request to /graph/operations fails', function() {

            var error;

            beforeEach(inject(function(_error_) {
                error = _error_;
            }));

            beforeEach(function() {
                spyOn(error, 'handle').and.stub();
            });

            it('should make a call to the error service', function() {
                $httpBackend.expectGET('http://gaffer/rest/latest/graph/operations').respond(500, { simpleMessage: 'Boom!'});

                service.reloadOperations().then(function(availableOperations) {
                    // don't care for the purpose of this test
                })

                $httpBackend.flush();

                expect(error.handle).toHaveBeenCalledWith('Error getting available graph operations', { simpleMessage: 'Boom!'});
            });

            it('should return the available operations', function() {
                $httpBackend.expectGET('http://gaffer/rest/latest/graph/operations').respond(500, 'test');

                service.reloadOperations().then(function(availableOperations) {
                    expect(availableOperations).toEqual(defaultAvailableOperations);
                });

                $httpBackend.flush();
            });
        });
    });

    describe('operationService.createGetSchemaOperation()', function() {

        var options;
        var settings;

        beforeEach(inject(function(_settings_) {
            settings = _settings_;
        }));

        beforeEach(function() {
            spyOn(settings, 'getDefaultOpOptions').and.callFake(function() {
                return options;
            });
        });

        it('should inject the default operation options', function() {
            options = 'test';

            var created = service.createGetSchemaOperation();

            expect(created.options).toEqual('test');
        });

        it('should create an empty object if the default operation options are undefined', function() {
            options = undefined;
            var created = service.createGetSchemaOperation();
            expect(created.options).toEqual({});
        });

        it('should create an empty object if the default operation options are null', function() {
            options = null;

            var created = service.createGetSchemaOperation();
            expect(created.options).toEqual({});
        });
    });

    describe('operationService.createLimitOperation()', function() {
        it('should use the injected options', function() {
            var created = service.createLimitOperation('test');
            expect(created.options).toEqual('test');
        });

        it('should create an empty object if the operation options are undefined', function() {
            var created = service.createLimitOperation(undefined);
            expect(created.options).toEqual({});
        });

        it('should create an empty object if the operation options are null', function() {
            var created = service.createLimitOperation(null);
            expect(created.options).toEqual({});
        });
    });

    describe('operationService.createDeduplicateOperation()', function() {

        it('should injected operation options', function() {
            var created = service.createDeduplicateOperation('test');
            expect(created.options).toEqual('test');
        });

        it('should create an empty object if the operation options are undefined', function() {
            var created = service.createDeduplicateOperation(undefined);
            expect(created.options).toEqual({});
        });

        it('should create an empty object if the operation options are null', function() {
            var created = service.createGetSchemaOperation(null);
            expect(created.options).toEqual({});
        });
    });

    describe('operationService.createCountOperation()', function() {

        it('should inject the operation options', function() {
            var created = service.createCountOperation('test');
            expect(created.options).toEqual('test');
        });

        it('should create an empty object if the operation options are undefined', function() {
            var created = service.createCountOperation(undefined);
            expect(created.options).toEqual({});
        });

        it('should create an empty object if the operation options are null', function() {
            var created = service.createCountOperation(null);
            expect(created.options).toEqual({});
        });
    });
});
