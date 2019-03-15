describe('The operation service', function() {

    var service, config;
    var $q, $httpBackend;

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

    beforeEach(inject(function(_operationService_, _$q_, _config_, _$httpBackend_) {
        service = _operationService_;
        $q = _$q_;
        config = _config_;
        $httpBackend = _$httpBackend_;
    }));

    beforeEach(function() {
        spyOn(config, 'get').and.callFake(function() {
            return $q.when({
                restEndpoint: 'http://gaffer/rest/latest',
                operations: {
                }
            });
        });
    });

    describe('reloadOperations()', function() {
        var namedOperations;
        var error = false;
        var query;
        var types;

        beforeEach(inject(function(_query_, _types_) {
            query = _query_;
            types = _types_;
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

        beforeEach(function() {
            spyOn(types, 'isKnown').and.returnValue(false);
        })

        describe('When the named operations are supported', function() {

            beforeEach(function() {
                $httpBackend.whenGET('http://gaffer/rest/latest/graph/operations/details').respond(200, [
                    {"name": 'uk.gov.gchq.gaffer.named.operation.GetAllNamedOperations'},
                    {"name": 'uk.gov.gchq.gaffer.operation.impl.get.GetElements', "fields": [ { name: 'input', className: 'java.lang.Object[]'} ] },
                    { "name": "uk.gov.gchq.gaffer.accumulostore.operation.impl.GetElementsBetweenSets", "fields": [ { name: "inputB", className: "java.lang.Object[]" } ] }
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
                    {operationName: 'namedOp', operations: '{ "operations": [{"class": "GetElementsBetweenSets"}] }'}
                ];

                service.reloadOperations().then(function(available) {
                    expect(available.length).toEqual(3);
                });

                $httpBackend.flush();
            });

            it('should not add a GetElementsBetweenSets named operation if it does not contain an inputB parameter', function() {
                namedOperations = [
                    {operationName: 'namedOp', operations: '{ "operations": [{"class": "GetElementsBetweenSets"}] }', parameters: {"notInputB": { "valueClass": "Iterable"}} }
                ];

                service.reloadOperations().then(function(available) {
                    expect(available.length).toEqual(3);
                });

                $httpBackend.flush();
            });

            it('should add a GetElementsBetweenSets Named operation if it contains an inputB parameter', function() {
                namedOperations = [
                    {operationName: 'namedOp', operations: '{ "operations": [{"class": "GetElementsBetweenSets"}] }', parameters: {"inputB": { "valueClass": "Iterable"}} }
                ];

                service.reloadOperations().then(function(available) {
                    expect(available[3]['fields'].inputB).toBeTruthy();
                });

                $httpBackend.flush();
            });

            it('should add a GetElementsBetweenSets if using fully qualified class name', function() {
                namedOperations = [
                    {operationName: 'namedOp', operations: '{ "operations": [{"class": "uk.gov.gchq.gaffer.accumulostore.operation.impl.GetElementsBetweenSets"}] }', parameters: {"inputB": { "valueClass": "Iterable"}} }
                ];

                service.reloadOperations().then(function(available) {
                    expect(available[3]['fields'].inputB).toBeTruthy();
                });

                $httpBackend.flush();
            });

            it('should use the input type of the first operation in the chain of a named operation', function() {
                namedOperations = [
                    {
                        operationName: 'test',
                        operations: '{ "operations": [ {"class": "uk.gov.gchq.gaffer.operation.impl.get.GetElements"}] }'
                    }
                ];

                service.reloadOperations().then(function(available) {
                    expect(available[3].fields.input.className).toEqual('java.lang.Object[]');
                });

                $httpBackend.flush();
            });

            it('should set the input type to undefined if the first operation is not known to the UI', function() {
                namedOperations = [
                    {operationName: 'namedOp', operations: '{ "operations": [{"class": "some.other.Operation"}] }', parameters: {"inputB": { "valueClass": "Iterable"}} }
                ];

                service.reloadOperations().then(function(available) {
                    expect(available[3].fields.input).toBeUndefined()
                });

                $httpBackend.flush();
            });

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
                    expect(availableOperations.length).toEqual(3);
                });

                $httpBackend.flush();
            });
        });

        describe('When named operations are not supported', function() {

            var defaultAvailableOperations = [
                {"name": 'uk.gov.gchq.gaffer.operation.impl.get.GetElements', "fields": [ { name: 'input', className: 'java.lang.Object[]'} ] },
                { "name": "uk.gov.gchq.gaffer.accumulostore.operation.impl.GetElementsBetweenSets", "fields": [ { name: "inputB", className: "java.lang.Object[]" } ] }
            ]

            beforeEach(function() {
                $httpBackend.expectGET('http://gaffer/rest/latest/graph/operations/details').respond(200, defaultAvailableOperations);
            });

            it('should return available operations when the GetAllNamedOperations is not supported', function() {
                service.reloadOperations().then(function(availableOps) {
                    expect(availableOps.length).toEqual(2);
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

        describe('When the request to /graph/operations/details fails', function() {

            var error;

            beforeEach(inject(function(_error_) {
                error = _error_;
            }));

            beforeEach(function() {
                spyOn(error, 'handle').and.stub();
            });

            it('should make a call to the error service', function() {
                $httpBackend.expectGET('http://gaffer/rest/latest/graph/operations/details').respond(500, { simpleMessage: 'Boom!'});

                service.reloadOperations().then(function(availableOperations) {
                    // don't care for the purpose of this test
                    expect(error.handle).toHaveBeenCalledWith('Unable to load operations', { simpleMessage: 'Boom!'});
                })

                $httpBackend.flush();

            });

            it('should return an empty array', function() {
                $httpBackend.expectGET('http://gaffer/rest/latest/graph/operations/details').respond(500, 'test');

                service.reloadOperations().then(function(availableOperations) {
                    expect(availableOperations).toEqual([]);
                });

                $httpBackend.flush();
            });
        });
    });

    describe('createGetSchemaOperation()', function() {

        var options;
        var operationOptions;

        beforeEach(inject(function(_operationOptions_) {
            operationOptions = _operationOptions_;
        }));

        beforeEach(function() {
            spyOn(operationOptions, 'getDefaultOperationOptions').and.callFake(function() {
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

    describe('createLimitOperation()', function() {
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

    describe('createDeduplicateOperation()', function() {

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

    describe('createCountOperation()', function() {

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

    describe('ifOperationSupported()', function() {

        var error;

        beforeEach(inject(function(_error_) {
            error = _error_;
        }));

        var successCallback = jasmine.createSpy("success");

        var failureCallback  = jasmine.createSpy("failure");

        var testOperation = "test";


        it('should run the success callback if the operation is supported', function() {
            $httpBackend.whenGET('http://gaffer/rest/latest/graph/operations').respond(200, [ 'test' ])
            service.ifOperationSupported(testOperation, successCallback, failureCallback);


            $httpBackend.flush();

            expect(successCallback).toHaveBeenCalled();
        });

        it('should run the failure callback if the operation is not supported', function() {
            $httpBackend.whenGET('http://gaffer/rest/latest/graph/operations').respond(200, [ 'notTest' ])
            service.ifOperationSupported(testOperation, successCallback, failureCallback);

            $httpBackend.flush();

            expect(failureCallback).toHaveBeenCalled();
        });

        it('should run the failure callback if the call to the rest service fails', function() {
            $httpBackend.whenGET('http://gaffer/rest/latest/graph/operations').respond(500)
            service.ifOperationSupported(testOperation, successCallback, failureCallback);

            $httpBackend.flush();

            expect(failureCallback).toHaveBeenCalled();
        });

        it('should make a call to the error service is the operation is not supported', function() {

            spyOn(error, 'handle').and.stub();

            $httpBackend.whenGET('http://gaffer/rest/latest/graph/operations').respond(500, {message: "ouch"})
            service.ifOperationSupported(testOperation, successCallback, failureCallback);

            $httpBackend.flush();

            expect(error.handle).toHaveBeenCalledWith("Error getting available graph operations", {message: "ouch"});
        });
    });
});
