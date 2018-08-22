describe('The Quick Query Component', function() {
    var ctrl;
    var $componentController;

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

    beforeEach(inject(function(_$componentController_) {
        $componentController = _$componentController_;
    }));

    beforeEach(function() {
        ctrl = $componentController('quickQuery');
    });

    describe('ctrl.$onInit()', function() {
        var config;
        var scope;
        var $q;
        var configToReturn = {};
        var schemaToReturn = {}

        beforeEach(inject(function(_$rootScope_, _config_, _$q_, _schema_) {
            var $rootScope = _$rootScope_;
            scope = $rootScope.$new();
            ctrl = $componentController('quickQuery', { $scope: scope});
            config = _config_;
            schema = _schema_;
            $q = _$q_;
        }));

        beforeEach(function() {
            spyOn(config, 'get').and.callFake(function() {
                return $q.when(configToReturn);
            });

            spyOn(schema, 'get').and.callFake(function() {
                return $q.when(schemaToReturn);
            });
        });

        beforeEach(function() {
            configToReturn = {};
        });

        describe('When not configured', function() {
           
            beforeEach(function() {
                ctrl.$onInit();
                scope.$digest();
            })

            it('should use a default description' , function() {
                expect(ctrl.description).toEqual('Get related Elements');
            });

            it('should use a default placeholder', function() {
                expect(ctrl.placeholder).toEqual('Quick query');
            });

            it('should use a default operation', function() {
                expect(ctrl.query).toBeDefined();
            });
        });

        it('should use a placeholder if configured', function() {
            configToReturn = {
                "quickQuery": {
                    "placeholder": "test"
                }
            }

            ctrl.$onInit();
            scope.$digest();

            expect(ctrl.placeholder).toEqual('test');
        });

        it('should not overwrite the default placeholder', function() {
            configToReturn = {
                "quickQuery": {}
            }

            ctrl.$onInit();
            scope.$digest();

            expect(ctrl.placeholder).toEqual('Quick query');
        });

        it('should use a configured description if defined', function() {
            configToReturn = {
                'quickQuery': {
                    'description': 'test'
                }
            };

            ctrl.$onInit();
            scope.$digest();

            expect(ctrl.description).toEqual('test');
        });

        it('should use the default description if not defined', function() {
            configToReturn = {
                'quickQuery': {}
            };

            ctrl.$onInit();
            scope.$digest();

            expect(ctrl.description).toEqual('Get related Elements');
        });

        it('should use a configured operation if defined', function() {
            configToReturn = {
                'quickQuery': {
                    'operation': {
                        'class': 'GetAdjacentIds',
                        'input': [ "${input}" ],
                        'view': {
                            'globalElements': [
                                {
                                    'groupBy': []
                                }
                            ]
                        }
                    }
                }
            };

            ctrl.$onInit();
            scope.$digest();

            expect(ctrl.query).toEqual(JSON.stringify(configToReturn.quickQuery.operation));
        });

        it('should use the default operation if not defined', function() {
            configToReturn = {
                'quickQuery': {}
            };

            ctrl.$onInit();
            scope.$digest();

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
            configToReturn = {
                'quickQuery' : {
                    'operation': {
                        'class': 'GetAllElements'
                    }
                }
            };

            expect(function() {
                ctrl.$onInit();
                scope.$digest();
            }).toThrowError('Quick query operation configuration is invalid. Operation must contain the string "${input}" (with quotes)');
        });

        it('should set dedupe to true if not specified in the config', function() {
            configToReturn = {
                'quickQuery': {}
            };

            ctrl.$onInit();
            scope.$digest();

            expect(ctrl.dedupe).toBeTruthy();
        });

        it('should set dedupe to false if specified in the config', function() {
            configToReturn = {
                'quickQuery': {
                    'deduplicate': false
                }
            };

            ctrl.$onInit();
            scope.$digest();

            expect(ctrl.dedupe).toBeFalsy()
        });

        it('should set options flag to false if useDefaultOperationOptions is not specified in the config', function() {
            configToReturn = {
                'quickQuery': {}
            }

            ctrl.$onInit();
            scope.$digest();

            expect(ctrl.options).toBeFalsy();
        });

        it('should set the options flag according to the useDefaultOperationOptions if specified', function() {
            configToReturn = {
                'quickQuery': {
                    'useDefaultOperationOptions': true
                }
            }

            ctrl.$onInit();
            scope.$digest();

            expect(ctrl.options).toBeTruthy();
        });

        it('should set limit to true if not specified in the config', function() {
            configToReturn = {
                'quickQuery': {}
            };

            ctrl.$onInit();
            scope.$digest();

            expect(ctrl.limit).toBeTruthy();
        });

        it('should set limit to false if specified in the config', function() {
            configToReturn = {
                'quickQuery': {
                    'limit': false
                }
            };

            ctrl.$onInit();
            scope.$digest();

            expect(ctrl.limit).toBeFalsy();
        });

        it('should use the schema to get the vertex class', function() {
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

            spyOn(schema, 'getSchemaVertices').and.returnValue(['vertexType1', 'vertexType2']);

            ctrl.$onInit();
            scope.$digest();

            expect(ctrl.vertexClass).toEqual('my.vertex.Class');
        });
    });

    describe('ctrl.search()', function() {

        var fields, limit;
        var types, query, settings;

        beforeEach(function() {
            ctrl.dedupe = false;
            ctrl.limit = false;
        });

        beforeEach(inject(function(_types_, _query_, _settings_) {
            types = _types_;
            query = _query_;
            settings = _settings_;
        }));

        beforeEach(function() {
            spyOn(types, 'getFields').and.callFake(function(unused) {
                return fields;
            });

            spyOn(query, 'executeQuery').and.stub();

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

        it('should use the default operation options on the operation chain if the options flag is set to true and options have been set', function() {
            ctrl.options = true;
            spyOn(settings, 'getDefaultOpOptions').and.returnValue({'foo': 'bar'});

            fields = [
                {
                    type: 'text',
                    class: 'java.lang.String',
                    required: true
                }
            ];

            ctrl.searchText = "test";

            ctrl.search();

            expect(query.executeQuery.calls.argsFor(0)[0].options).toEqual({'foo': 'bar'})
        });

        it('should not use the default operation options if no options have been defined', function() {
            ctrl.options = true;
            spyOn(settings, 'getDefaultOpOptions').and.returnValue({});

            fields = [
                {
                    type: 'text',
                    class: 'java.lang.String',
                    required: true
                }
            ];

            ctrl.searchText = "test";

            ctrl.search();

            expect(query.executeQuery.calls.argsFor(0)[0].options).toBeUndefined();
        
        });

        it('should not add the default operation options if the options flag is set to false', function() {
            ctrl.options = false;
            spyOn(settings, 'getDefaultOpOptions').and.returnValue({'foo': 'bar'});

            fields = [
                {
                    type: 'text',
                    class: 'java.lang.String',
                    required: true
                }
            ];

            ctrl.searchText = "test";

            ctrl.search();

            expect(query.executeQuery.calls.argsFor(0)[0].options).toBeUndefined();
        });
    });
});