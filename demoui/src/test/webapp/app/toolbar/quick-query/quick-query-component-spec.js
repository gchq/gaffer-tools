describe('The Quick Query Component', function() {
    var ctrl;
    var scope;
    var $componentController, $httpBackend, $q;

    beforeEach(module('app'));

    beforeEach(module(function($provide) {
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

    beforeEach(inject(function(_$componentController_, _$httpBackend_, _$q_, _$rootScope_) {
        $componentController = _$componentController_;
        $httpBackend = _$httpBackend_;
        $q = _$q_;
        var $rootScope = _$rootScope_;
        scope = $rootScope.$new();
    }));



    beforeEach(function() {
        $httpBackend.whenGET('config/defaultConfig.json').respond(200, {
            "quickQuery": {
              "defaultOperation": {
                "class": "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
                "input": [
                  "${input}"
                ],
                "view": {
                  "globalElements": [
                    {
                      "groupBy": []
                    }
                  ]
                }
              },
              "deduplicate": true,
              "limit": true,
              "description": "Get related Elements",
              "useDefaultOperationOptions": false
            },
        })
    })

    beforeEach(function() {
        ctrl = $componentController('quickQuery', {$scope: scope});
    });

    describe('ctrl.$onInit()', function() {
        var types;
        var schemaToReturn = {}

        beforeEach(inject(function(_$rootScope_, _schema_, _types_) {
            schema = _schema_;
            types = _types_
        }));

        beforeEach(function() {
            spyOn(schema, 'get').and.callFake(function() {
                return $q.when(schemaToReturn);
            });
        });

        describe('When not configured', function() {

        beforeEach(function() {
                $httpBackend.whenGET('config/config.json').respond(200, {});
        });

            beforeEach(function() {
                ctrl.$onInit();
                $httpBackend.flush();
            })

            it('should use a default description' , function() {
                expect(ctrl.description).toEqual('Get related Elements');
            });

            it('should use a default placeholder', function() {
                expect(ctrl.placeholder).toEqual('Quick Query');
            });

            it('should use a default operation', function() {
                expect(ctrl.query).toBeDefined();
            });
        });

        it('should use a placeholder if configured', function() {
            $httpBackend.whenGET('config/config.json').respond(200, {
                "quickQuery": {
                    "placeholder": "test"
                }
            });

            schemaToReturn = {
                "types": {
                    "vertex": {
                        "class": "vertexClass"
                    }
                }
            }

            spyOn(types, 'getCsvHeader').and.returnValue("placeholder should not contain csv header");

            spyOn(schema, 'getSchemaVertices').and.returnValue(['vertex'])

            ctrl.$onInit();
            $httpBackend.flush();

            expect(ctrl.placeholder).toEqual('test');
        });

        it('should use the phrase "Quick Query" if not defined in the config and no csv header exists', function() {
            $httpBackend.whenGET('config/config.json').respond(200, {
                "quickQuery": {}
            });

            schemaToReturn = {
                "types": {
                    "vertex": {
                        "class": "vertexClass"
                    }
                }
            }

            spyOn(types, 'getCsvHeader').and.returnValue("");
            spyOn(schema, 'getSchemaVertices').and.returnValue(['vertex'])

            ctrl.$onInit();
            $httpBackend.flush();

            expect(ctrl.placeholder).toEqual('Quick Query');
        });

        it('should use the phrase "Quick Query" followed by an csv header if one exists', function() {
            $httpBackend.whenGET('config/config.json').respond(200, {
                "quickQuery": {}
            });

            schemaToReturn = {
                "types": {
                    "vertex": {
                        "class": "vertexClass"
                    }
                }
            }

            spyOn(types, 'getCsvHeader').and.returnValue("insert csv header here");
            spyOn(schema, 'getSchemaVertices').and.returnValue(['vertex'])

            ctrl.$onInit();
            $httpBackend.flush();

            expect(ctrl.placeholder).toEqual('Quick Query eg. insert csv header here');
        });

        it('should use a configured description if defined', function() {
            $httpBackend.whenGET('config/config.json').respond(200, {
                'quickQuery': {
                    'description': 'test'
                }
            });

            ctrl.$onInit();
            $httpBackend.flush();

            expect(ctrl.description).toEqual('test');
        });

        it('should use the default description if not defined', function() {
            $httpBackend.whenGET('config/config.json').respond(200, {
                'quickQuery': {}
            });

            ctrl.$onInit();
            $httpBackend.flush();

            expect(ctrl.description).toEqual('Get related Elements');
        });

        it('should use a configured operation if defined', function() {
            var userDefinedOperation = {
                'class': 'GetAdjacentIds',
                'input': [ "${input}" ],
                'view': {
                    'globalElements': [
                        {
                            'groupBy': []
                        }
                    ]
                }
            };

            $httpBackend.whenGET('config/config.json').respond(200, {
                'quickQuery': {
                    'operation': userDefinedOperation
                }
            });

            ctrl.$onInit();
            $httpBackend.flush();

            expect(ctrl.query).toEqual(JSON.stringify(userDefinedOperation));
        });

        it('should use the default operation if not defined', function() {
            $httpBackend.whenGET('config/config.json').respond(200, {
                'quickQuery': {}
            });

            ctrl.$onInit();
            $httpBackend.flush();

            var defaultQuery = JSON.stringify({
                "class": "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
                "input": [
                    "${input}"
                ],
                "view": {
                    "globalElements": [
                        {
                            "groupBy": []
                        }
                    ]
                }
            });

            expect(ctrl.query).toEqual(defaultQuery);
        });

        it('should throw an error if the configured operation does not contain the string "${input}"', function() {
            $httpBackend.whenGET('config/config.json').respond(200, {
                'quickQuery' : {
                    'operation': {
                        'class': 'GetAllElements'
                    }
                }
            });

            expect(function() {
                ctrl.$onInit();
                $httpBackend.flush();
            }).toThrowError('Quick query operation configuration is invalid. Operation must contain the string "${input}" (with quotes)');
        });

        it('should set dedupe to true if not specified in the config', function() {
            $httpBackend.whenGET('config/config.json').respond(200, {
                'quickQuery': {}
            });

            ctrl.$onInit();
            $httpBackend.flush();

            expect(ctrl.dedupe).toBeTruthy();
        });

        it('should set dedupe to false if specified in the config', function() {
            $httpBackend.whenGET('config/config.json').respond(200, {
                'quickQuery': {
                    'deduplicate': false
                }
            });

            ctrl.$onInit();
            $httpBackend.flush();

            expect(ctrl.dedupe).toBeFalsy()
        });

        it('should set options flag to false if useDefaultOperationOptions is not specified in the config', function() {
            $httpBackend.whenGET('config/config.json').respond(200, {
                'quickQuery': {}
            });

            ctrl.$onInit();
            $httpBackend.flush();

            expect(ctrl.options).toBeFalsy();
        });

        it('should set the options flag according to the useDefaultOperationOptions if specified', function() {
            $httpBackend.whenGET('config/config.json').respond(200, {
                'quickQuery': {
                    'useDefaultOperationOptions': true
                }
            });

            ctrl.$onInit();
            $httpBackend.flush();

            expect(ctrl.options).toBeTruthy();
        });

        it('should set limit to true if not specified in the config', function() {
            $httpBackend.whenGET('config/config.json').respond(200, {
                'quickQuery': {}
            });

            ctrl.$onInit();
            $httpBackend.flush();

            expect(ctrl.limit).toBeTruthy();
        });

        it('should set limit to false if specified in the config', function() {
            $httpBackend.whenGET('config/config.json').respond(200, {
                'quickQuery': {
                    'limit': false
                }
            });

            ctrl.$onInit();
            $httpBackend.flush();

            expect(ctrl.limit).toBeFalsy();
        });

        it('should use the schema to get the vertex class', function() {
            $httpBackend.whenGET('config/config.json').respond(200, {});
            schemaToReturn = {
                types: {
                    'vertexType1': {
                        class: 'my.vertex.Class'
                    },
                    'vertexType2': {
                        class: 'my.vertex.Class'
                    }
                }
            };

            spyOn(types, 'getCsvHeader').and.returnValue("");
            spyOn(schema, 'getSchemaVertices').and.returnValue(['vertexType1', 'vertexType2']);

            ctrl.$onInit();
            $httpBackend.flush();

            expect(ctrl.vertexClass).toEqual('my.vertex.Class');
        });
    });

    describe('ctrl.search()', function() {
        var $mdToast;
        var fields, limit;
        var types, query, settings, operationOptions;
        var results = [];
        var navigation;

        beforeEach(function() {
            ctrl.dedupe = false;
            ctrl.limit = false;
        });

        beforeEach(inject(function(_types_, _query_, _settings_, _$mdToast_, _navigation_, _operationOptions_) {
            types = _types_;
            query = _query_;
            settings = _settings_;
            $mdToast = _$mdToast_;
            navigation = _navigation_;
            operationOptions = _operationOptions_;
        }));

        beforeEach(function() {
            spyOn(types, 'getFields').and.callFake(function(unused) {
                return fields;
            });

            spyOn(query, 'executeQuery').and.callFake(function(ops, onComplete) {
                onComplete(results);
            });

            spyOn(settings, 'getResultLimit').and.callFake(function() {
                return limit;
            })
        });

        beforeEach(function() { // copied from the default query
            ctrl.query = JSON.stringify({
                "class": "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
                "input": [
                    "${input}"
                ],
                "view": {
                    "globalElements": [
                        {
                            "groupBy": []
                        }
                    ]
                }
            });
        })

        var createOperationChain = function(input) {

            var seed = {
                class: 'uk.gov.gchq.gaffer.operation.data.EntitySeed',
                vertex: input
            };            

            var chain = {
                class: 'uk.gov.gchq.gaffer.operation.OperationChain',
                operations: [
                    {
                        "class": "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
                        "input": [
                            seed
                        ],
                        "view": {
                            "globalElements": [
                                {
                                    "groupBy": []
                                }
                            ]
                        }
                    }
                ]
            }

            if (ctrl.dedupe) {
                chain.operations.push({
                    class: "uk.gov.gchq.gaffer.operation.impl.output.ToSet",
                    options: {}
                });
            }

            if (ctrl.limit) {
                chain.operations.push({
                    class: "uk.gov.gchq.gaffer.operation.impl.Limit",
                    resultLimit: limit,
                    options: {}
                });
            }

            return chain;
        }

        it('should insert a string seed into the query and execute it', function() {
            fields = [
                {
                    type: 'text',
                    class: 'java.lang.String',
                    required: true
                }
            ];

            ctrl.searchText = "test";

            var expectedOperation = createOperationChain("test");

            ctrl.search();

            expect(query.executeQuery).toHaveBeenCalledWith(expectedOperation, jasmine.any(Function));

        });

        it('should insert a string seed into the query even if it is a number', function() {
            fields = [
                {
                    type: 'text',
                    class: 'java.lang.String',
                    required: true
                }
            ];

            ctrl.searchText = '42';

            ctrl.search();

            ctrl.vertexClass = 'java.lang.String';
            var expectedOperation = createOperationChain('42');
            ctrl.search();

            expect(query.executeQuery).toHaveBeenCalledWith(expectedOperation, jasmine.any(Function));
        });

        it('should insert a numerical seed into the query and execute it', function() {
            fields = [
                {
                    type: 'number',
                    class: 'java.lang.Integer',
                    required: true
                }
            ];

            ctrl.searchText = '42';

            ctrl.search();

            ctrl.vertexClass = 'java.lang.Integer';
            var expectedOperation = createOperationChain(42);
            ctrl.search();

            expect(query.executeQuery).toHaveBeenCalledWith(expectedOperation, jasmine.any(Function));
        });

        it('should insert a complex seed (comma separated) into the query and execute it', function() {
            fields = [
                {
                    type: 'text',
                    class: 'java.lang.String',
                    key: 'type'
                },
                {
                    type: 'text',
                    class: 'java.lang.String',
                    key: 'subType'
                },
                {
                    type: 'text',
                    class: 'java.lang.String',
                    key: 'value'
                }
            ];

            ctrl.vertexClass = 'uk.gov.gchq.gaffer.types.TypeSubTypeValue';
            ctrl.searchText = "t,st,v";

            spyOn(types, 'createJsonValue').and.callFake(function(typeClass, parts, stringify) {
                var toReturn = {};

                toReturn[typeClass] = parts;
                return toReturn;
            })
            ctrl.search();

            var expectedOperation = createOperationChain({"uk.gov.gchq.gaffer.types.TypeSubTypeValue": { "type": "t", "subType": "st", "value": "v"}});

            expect(query.executeQuery).toHaveBeenCalledWith(expectedOperation, jasmine.any(Function))
        });

        it('should add the operation to the query service', function() {
            spyOn(query, 'addOperation');

            fields = [
                {
                    type: 'text',
                    class: 'java.lang.String',
                    required: true
                }
            ];

            ctrl.searchText = "test";

            var expectedQuery = createOperationChain("test");
            ctrl.search();

            expect(query.addOperation).toHaveBeenCalledWith(expectedQuery);
        });

        it('should add a deduplicate operation to the chain, if dedupe is set to true', function() {
            fields = [
                {
                    type: 'text',
                    class: 'java.lang.String',
                    required: true
                }
            ];

            ctrl.searchText = "test";
            ctrl.dedupe = true;

            var expectedOperation = createOperationChain("test");
            ctrl.search();

            expect(query.executeQuery).toHaveBeenCalledWith(expectedOperation, jasmine.any(Function))

        });

        it('should add a limit operation to the chain if limit is set to true', function() {
            fields = [
                {
                    type: 'text',
                    class: 'java.lang.String',
                    required: true
                }
            ];

            ctrl.searchText = "test";
            ctrl.limit = true;

            var expectedOperation = createOperationChain("test");
            ctrl.search();

            expect(query.executeQuery).toHaveBeenCalledWith(expectedOperation, jasmine.any(Function));
        });

        it('should use the limit set in the settings service in the limit operation', function() {
            limit = 3000;

            fields = [
                {
                    type: 'text',
                    class: 'java.lang.String',
                    required: true
                }
            ];

            ctrl.searchText = "test";
            ctrl.dedupe = true
            ctrl.limit = true;

            ctrl.search();
            expect(query.executeQuery.calls.argsFor(0)[0].operations[2].resultLimit).toEqual(3000)
        });

        it('should not overwrite predefined operation options', function() {
            ctrl.options = true;
            spyOn(operationOptions, 'getDefaultOperationOptions').and.returnValue({'foo': 'bar'});

            fields = [
                {
                    type: 'text',
                    class: 'java.lang.String',
                    required: true
                }
            ];

            ctrl.searchText = "test";

            var operation = JSON.parse(ctrl.query);
            operation.options = {
                'preset': 'value'
            }

            ctrl.query = JSON.stringify(operation);

            ctrl.search();

            expect(query.executeQuery.calls.argsFor(0)[0].operations[0].options).toEqual({'preset': 'value'});
        
        });

        it('should not add the default operation options if the options flag is set to false', function() {
            ctrl.options = false;
            spyOn(operationOptions, 'getDefaultOperationOptions').and.returnValue({'foo': 'bar'});

            fields = [
                {
                    type: 'text',
                    class: 'java.lang.String',
                    required: true
                }
            ];

            ctrl.searchText = "test";

            ctrl.search();

            expect(query.executeQuery.calls.argsFor(0)[0].operations[0].options).toBeUndefined();
        });

        it('should add the operations to every operation in the chain if configured', function() {
            ctrl.options = true;
            ctrl.dedupe = true;
            ctrl.limit = true;
            spyOn(operationOptions, 'getDefaultOperationOptions').and.returnValue({'foo': 'bar'});

            fields = [
                {
                    type: 'text',
                    class: 'java.lang.String',
                    required: true
                }
            ];

            ctrl.searchText = "test";

            ctrl.search();

            var operationArray = query.executeQuery.calls.argsFor(0)[0].operations;
            for (var i in operationArray) {
                var op = operationArray[i];
                expect(op.options).toEqual({'foo': 'bar'})
            }
        });

        it('should reset the input string when results are returned', function() {
            ctrl.searchText = "test";

            fields = [
                {
                    type: 'text',
                    class: 'java.lang.String',
                    required: true
                }
            ];

            ctrl.search();

            expect(ctrl.searchText).toEqual("");
        });

        it('should show a toast to the user informing them of the number of results returned', function() {
            spyOn($mdToast, 'show').and.returnValue($q.when(null));

            ctrl.searchText = "test";

            results = ['a', 'b', 'c'];

            fields = [
                {
                    type: 'text',
                    class: 'java.lang.String',
                    required: true
                }
            ];

            ctrl.search();

            expect($mdToast.show.calls.first().args[0]._options.textContent).toEqual('3 results returned')

        });

        it('should show a toast to the user informing them results have been returned if the results don\'t come back in an array', function() {
            spyOn($mdToast, 'show').and.returnValue($q.when(null));

            ctrl.searchText = "test";

            results = 42;

            fields = [
                {
                    type: 'text',
                    class: 'java.lang.String',
                    required: true
                }
            ];

            ctrl.search();

            expect($mdToast.show.calls.first().args[0]._options.textContent).toEqual('results returned')
        });

        it('should navigate to the results page if the user clicks "view results"', function() {
            spyOn($mdToast, 'show').and.returnValue($q.when('ok'));
            spyOn(navigation, 'goTo');
            ctrl.searchText = "test";

            results = ['a', 'b', 'c'];

            fields = [
                {
                    type: 'text',
                    class: 'java.lang.String',
                    required: true
                }
            ];

            ctrl.search();
            scope.$digest();

            expect(navigation.goTo).toHaveBeenCalledWith('results')
        });
    });
});
