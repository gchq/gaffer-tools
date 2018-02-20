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


    describe('operationService.getAvailableOperations()', function() {
        var operationsToReturn;

        beforeEach(function() {
            operationsToReturn = { defaultAvailable: 'test' };
        })

        beforeEach(function() {
            spyOn(config, 'get').and.callFake(function() {
                return $q.when({
                    operations: operationsToReturn
                });
            })
        });


        it('should return the available operations in the config', function() {

            service.getAvailableOperations().then(function(ops) {
                expect(ops).toEqual('test');
            })

            $rootScope.$digest();
        });

        it('should return the available operations once resolved without making second call to config service', function() {
            service.getAvailableOperations().then(function(ops) { // do nothing
            });
            $rootScope.$digest(); // resolve the promise

            service.getAvailableOperations().then(function(ops) {
                expect(config.get).toHaveBeenCalledTimes(1);
            });

            $rootScope.$digest();
        });

        it('should not make a second call to the config service while the first call is being resolved', function() {
            service.getAvailableOperations().then(function(ops) { // do nothing
            });

            service.getAvailableOperations().then(function(ops) {
                expect(config.get).toHaveBeenCalledTimes(1);
            });

            $rootScope.$digest();
        });

        it('should resolve an empty array if the available operations are undefined', function() {
            operationsToReturn = {};

            service.getAvailableOperations().then(function(ops) {
                expect(ops).toEqual([])
            }, function(err) {
                fail('promise should not have been rejected')
            });

            $rootScope.$digest();
        });

        it('should resolve an empty array if the operations section of the config is undefined', function() {
            operationsToReturn = undefined;

            service.getAvailableOperations().then(function(ops) {
                expect(ops).toEqual([])
            }, function(err) {
                fail('promise should not have been rejected')
            });

            $rootScope.$digest();
        });
    });

    describe('operationService.reloadNamedOperations()', function() {

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
                        defaultAvailable: defaultAvailableOperations
                    }
                });
            });
        });

        beforeEach(function() {
            defaultAvailableOperations = [ {
                name: 'test'
            }];
        })

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
                $httpBackend.whenGET('http://gaffer/rest/latest/graph/operations').respond(200, ['uk.gov.gchq.gaffer.named.operation.GetAllNamedOperations']);
            });

            beforeEach(function() {
                namedOperations = [];
                error = false;
            });

            it('should update the available operations if GetAllNamedOperations is supported', function() {
                namedOperations = [
                    {name: 'namedOp', description: 'a test'}
                ];

                service.getAvailableOperations().then(function(initial) {
                    service.reloadNamedOperations().then(function(unused) {
                        service.getAvailableOperations().then(function(newAvailableOperations) {
                            expect(newAvailableOperations).not.toEqual(initial);
                        });
                    });

                });

                $httpBackend.flush();
            });

            it('should return the available operations when the GetAllNamedOperations is supported', function() {
                service.reloadNamedOperations().then(function(returnedOperations) {
                    service.getAvailableOperations().then(function(newAvailableOperations) {
                        expect(returnedOperations).toEqual(newAvailableOperations);
                    });
                });

                $httpBackend.flush();
            });

            it('should resolve two concurrent calls independently of each other', function() {
                returnedResults = 0;
                service.reloadNamedOperations().then(function(firstNamedOperations) {
                    returnedResults ++;
                });
                service.reloadNamedOperations().then(function(secondNamedOperations) {
                    returnedResults ++;
                });

                $httpBackend.flush();

                expect(returnedResults).toEqual(2);
            });

            it('should not cache the result as a reload is being forced', function() {
                service.reloadNamedOperations().then(function(initialAvailableOperations) {
                    namedOperations = [ { name: 'test' } ];
                    service.reloadNamedOperations().then(function(updatedAvailableOperations) {
                        expect(updatedAvailableOperations).not.toEqual(initialAvailableOperations);
                    });
                });

                $httpBackend.flush();
            });

            it('should return the available operations if the GetAllNamedOperations query fails', function() {
                error = true;

                service.reloadNamedOperations().then(function(availableOperations) {
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
                service.reloadNamedOperations().then(function(availableOps) {
                    expect(availableOps).toEqual(defaultAvailableOperations);
                });

                $httpBackend.flush();
            });

            it('should not make query the API if GetAllNamedOperations is not supported', function() {
                service.reloadNamedOperations().then(function(availableOps) {
                    expect(query.execute).not.toHaveBeenCalled();
                });

                $httpBackend.flush();
            });
        });

        describe('When the request to /graph/operations fails', function() {

            beforeEach(function() {
                spyOn(window, 'alert').and.stub();
            });

            it('should alert the user if the a gaffer error comes back', function() {
                $httpBackend.expectGET('http://gaffer/rest/latest/graph/operations').respond(500, { simpleMessage: 'Boom!'});

                service.reloadNamedOperations().then(function(availableOperations) {
                    // don't care for the purpose of this test
                })

                $httpBackend.flush();

                expect(window.alert).toHaveBeenCalledWith('Error running /graph/operations: Boom!');
            });

            it('should alert the user if the error that comes back is an empty string', function() {
                $httpBackend.expectGET('http://gaffer/rest/latest/graph/operations').respond(500, '');

                service.reloadNamedOperations().then(function(availableOperations) {
                    // don't care for the purpose of this test
                })

                $httpBackend.flush();

                expect(window.alert).toHaveBeenCalledWith('Error running /graph/operations - received no response');
            });

            it('should alert the user if the error that comes back is undefined', function() {
                $httpBackend.expectGET('http://gaffer/rest/latest/graph/operations').respond(500, undefined);

                service.reloadNamedOperations().then(function(availableOperations) {
                    // don't care for the purpose of this test
                })

                $httpBackend.flush();

                expect(window.alert).toHaveBeenCalledWith('Error running /graph/operations - received no response');
            });

            it('should alert the user if the error that comes back is null', function() {
                $httpBackend.expectGET('http://gaffer/rest/latest/graph/operations').respond(500, null);

                service.reloadNamedOperations().then(function(availableOperations) {
                    // don't care for the purpose of this test
                })

                $httpBackend.flush();

                expect(window.alert).toHaveBeenCalledWith('Error running /graph/operations - received no response');
            });

            it('should log an error to the console', function() {
                 $httpBackend.expectGET('http://gaffer/rest/latest/graph/operations').respond(500, 'test');

                 spyOn(console, 'log').and.stub();

                 service.reloadNamedOperations().then(function(availableOperations) {
                     // don't care for the purpose of this test
                 });

                 $httpBackend.flush();

                 expect(console.log).toHaveBeenCalledWith('test');
            });

            it('should return the available operations', function() {
                $httpBackend.expectGET('http://gaffer/rest/latest/graph/operations').respond(500, 'test');

                service.reloadNamedOperations().then(function(availableOperations) {
                    expect(availableOperations).toEqual(defaultAvailableOperations);
                });

                $httpBackend.flush();
            })
        })
    });
});