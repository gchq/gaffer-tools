describe('The seed builder component', function() {

    var ctrl;
    var scope;
    var types, events;
    var $routeParams;
    var types;
    var error;

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


    beforeEach(inject(function(_$rootScope_, _$componentController_, _$routeParams_, _types_, _error_, _events_) {
        scope = _$rootScope_.$new();
        var $componentController = _$componentController_;
        $routeParams = _$routeParams_;
        types = _types_;
        error = _error_;
        events = _events_;

        ctrl = $componentController('seedBuilder', {$scope: scope}, {
            model: [],
            routeParam: 'input',
            usePrevious: false
        });
    }));

    it('should exist', function() {
        expect(ctrl).toBeDefined();
    });
    
    describe('ctrl.$onInit()', function() {

        var schema;
        var $q;

        beforeEach(inject(function(_schema_, _$q_) {
            schema = _schema_;
            $q = _$q_;
        }));

        beforeEach(function() {
            spyOn(schema, 'get').and.returnValue($q.when({
                "edges": {},
                "entities": {},
                "types": {
                    "vertex1": {
                        "class": "my.vertex.Class"
                    },
                    "vertex2": {
                        "class": "my.badly.configured.schema"
                    }
                }
            }));

            spyOn(schema, 'getSchemaVertices').and.returnValue(['vertex1', 'vertex2']);
            spyOn(error, 'handle');
        });

        it('should get the schema', function() {
            ctrl.$onInit();
            expect(schema.get).toHaveBeenCalledTimes(1);
        });

        it('should use the class of the first vertex in the schema', function() {
            ctrl.$onInit();
            spyOn(types, 'getFields').and.returnValue([]);      // stubbed for the purpose of this test
            scope.$digest();
            expect(ctrl.vertexClass).toEqual('my.vertex.Class');
        });

        it('should set the seed vertices to an empty string if the input is an empty array', function() {
            ctrl.$onInit();
            expect(ctrl.seedVertices).toEqual('');
        });

        it('should add a string seed from the input service to the input box', function() {
            spyOn(types, 'getFields').and.returnValue([
                {
                    "type": "text",
                    "class": "java.lang.String",
                    "required": true
                }
            ]);

            ctrl.model = [
                {
                    valueClass: 'java.lang.String',
                    parts: {
                        undefined: 'test'
                    }
                }
            ];
            ctrl.$onInit();
            scope.$digest();
            expect(ctrl.seedVertices).toEqual('test');
        });

        describe('with simple input query params', function() {
            beforeEach(function() {
                spyOn(types, 'getFields').and.returnValue([{
                     label: "Value",
                     type: "text",
                     class: "java.lang.String"
                }]);
            });

            it('should add a single seed', function() {
                $routeParams.input="seed1";
                ctrl.$onInit();
                scope.$digest();
                expect(error.handle).not.toHaveBeenCalled();
                expect(ctrl.model).toEqual([{
                    valueClass: 'my.vertex.Class',
                    parts: {
                        undefined: "seed1"
                    }
                }]);
            });

            it('should add multiple single seeds', function() {
                $routeParams.input=["seed1", "seed2"];
                ctrl.$onInit();
                scope.$digest();
                expect(error.handle).not.toHaveBeenCalled();
                expect(ctrl.model).toEqual([{
                        valueClass: 'my.vertex.Class',
                        parts: {
                            undefined: "seed1"
                        }
                    },
                    {
                        valueClass: 'my.vertex.Class',
                        parts: {
                            undefined: "seed2"
                        }
                    }
                ]);
            });

            it('should not error if adding duplicate seeds', function() {
                ctrl.seedVertices = 'seed1';
                $routeParams.input = 'seed1';
                ctrl.$onInit();
                expect(error.handle).not.toHaveBeenCalled();
            });
        });

        describe('with complex input query params', function() {
            beforeEach(function() {
                spyOn(types, 'getFields').and.returnValue([{"key": "type"}, {"key": "value"}]);
            });

            it('should add a single seed', function() {
                $routeParams.input="t1,v1";
                ctrl.$onInit();
                scope.$digest();
                expect(error.handle).not.toHaveBeenCalled();
                expect(ctrl.model).toEqual([
                    {
                        valueClass: 'my.vertex.Class',
                        parts: {"type": "t1", "value": "v1"}
                    }
                ]);
            });

            it('should add multiple single seeds', function() {
                $routeParams.input=["t1,v1", "t2,v2"];
                ctrl.$onInit();
                scope.$digest();
                expect(error.handle).not.toHaveBeenCalled();
                expect(ctrl.model).toEqual([
                    {
                        valueClass: 'my.vertex.Class',
                        parts: {"type": "t1", "value": "v1"}
                    },
                    {
                        valueClass: 'my.vertex.Class',
                        parts: {"type": "t2", "value": "v2"}
                    }
                ]);
            });
        });

        it('should add a numerical seed from the model to the input box', function() {

            spyOn(types, 'getFields').and.returnValue([
                {
                    'label': 'value',
                    'type': 'number',
                    'required': true
                }
            ])
            ctrl.model = [
                {
                    valueClass: 'java.lang.Integer',
                    parts: {
                        undefined: 3
                    }
                }
            ];
            ctrl.$onInit();
            scope.$digest();
            expect(ctrl.seedVertices).toEqual('3');
        });

        it('should add a complex seed from the model to the input box', function() {
            spyOn(types, 'getFields').and.returnValue([
                { key: 'type' },
                { key: 'subType' },
                { key: 'value' }
            ])
            ctrl.model = [
                {
                    valueClass: 'uk.gov.gchq.gaffer.types.TypeSubTypeValue',
                    parts: {
                        type: 't',
                        subType: 'st',
                        value: 'v'
                    }
                }
            ];
            ctrl.$onInit();
            scope.$digest();
            expect(ctrl.seedVertices).toEqual('t,st,v');
        });

        it('should add multiple seeds seperated by a newline', function() {
            spyOn(types, 'getFields').and.returnValue([
                {
                    'type': 'text',
                    'class': 'java.lang.String',
                    'label': ''
                }
            ]);
            ctrl.model = [
                {
                    valueClass: 'java.lang.String',
                    parts: {
                        undefined: 'test'
                    }
                },
                {
                    valueClass: 'java.lang.String',
                    parts: {
                        undefined: 'test2'
                    }
                }
            ];

            ctrl.$onInit();
            scope.$digest();
            expect(ctrl.seedVertices).toEqual('test\ntest2');
        });

        it('should subscribe to events', function() {
            spyOn(events, 'subscribe').and.stub();
            ctrl.$onInit();
            expect(events.subscribe).toHaveBeenCalledTimes(2);
            expect(events.subscribe).toHaveBeenCalledWith('onOperationUpdate', jasmine.any(Function))
            expect(events.subscribe).toHaveBeenCalledWith('onPreExecute', jasmine.any(Function))
        });
    });

    describe('ctrl.$onDestroy()', function() {
        it('should unsubscribe from events', function() {
            spyOn(events, 'unsubscribe').and.stub();
            ctrl.$onDestroy();
            expect(events.unsubscribe).toHaveBeenCalledTimes(2);
            expect(events.unsubscribe).toHaveBeenCalledWith('onOperationUpdate', jasmine.any(Function))
            expect(events.unsubscribe).toHaveBeenCalledWith('onPreExecute', jasmine.any(Function))
        })
    })

    describe('ctrl.getFields()', function() {

        it('should call types.getFields() with the vertex class as the argument', function() {
            spyOn(types, 'getFields').and.stub();
            ctrl.vertexClass = 'test';
            ctrl.getFields();
            expect(types.getFields).toHaveBeenCalledWith('test');
        });
    });

    describe('ctrl.getPlaceHolder()', function() {
        it('should tell the user to enter their seeds', function() {
            spyOn(ctrl, 'getCsvHeader').and.returnValue('type,value');
            expect(ctrl.getPlaceHolder()).toEqual('Enter your seeds, each seed on a new line \ntype,value');
        });

        it('should tell the user that the input is being provided by the output of the previous operation', function() {
            ctrl.usePrevious = true;
            expect(ctrl.getPlaceHolder()).toEqual('Input is provided by the output of the previous operation');
        });
    });

    describe('ctrl.getCsvHeader()', function() {
        it('should call types.getCsvHeader() with the vertex class as the argument', function() {
            spyOn(types, 'getCsvHeader').and.stub();
            ctrl.vertexClass = 'test';
            ctrl.getCsvHeader();
            expect(types.getCsvHeader).toHaveBeenCalledWith('test');
        });
    })

    describe('ctrl.addSeeds()', function() {
        var fields;
        var error;

        beforeEach(inject(function(_error_) {
            error = _error_;
        }));

        beforeEach(function() {
            var fakeForm = {
                multiSeedInput: {
                    $setValidity: jasmine.createSpy('$setValidity')
                }
            }
            ctrl.seedForm = fakeForm;
        })

        beforeEach(function() {
            spyOn(types, 'getFields').and.callFake(function(clazz) {
                return fields;
            });

            spyOn(error, 'handle').and.stub();
        });

        beforeEach(function() {
            fields = [{}];
        })

        it('should create string seeds from strings', function() {
            ctrl.vertexClass = 'java.lang.String';
            ctrl.seedVertices = 'test';

            fields = [
                {
                    type: 'text',
                    class: 'java.lang.String'
                }
            ]
            ctrl.addSeeds();
            expect(ctrl.model).toEqual([
                {
                    valueClass: 'java.lang.String',
                    parts: {
                        undefined: 'test'
                    }
                }
            ]);
            expect(ctrl.seedForm.multiSeedInput.$setValidity).toHaveBeenCalledWith('csv', true);
        });

        it('should create numbers from numerical strings', function() {
            ctrl.vertexClass = 'java.lang.Long';
            ctrl.seedVertices = '123';

            fields = [
                {
                    type: 'number',
                    class: 'java.lang.Long'
                }
            ]
            ctrl.addSeeds();
            expect(ctrl.model).toEqual([
                {
                    valueClass: 'java.lang.Long',
                    parts: {
                        undefined: 123
                    }
                }
            ]);
            expect(ctrl.seedForm.multiSeedInput.$setValidity).toHaveBeenCalledWith('csv', true);
        });

        it('should create a true boolean value from "true" strings', function() {
            ctrl.vertexClass = 'java.lang.Boolean';
            ctrl.seedVertices = 'true';

            fields = [{
                type: 'checkbox',
                class: 'java.lang.Boolean'
            }];
            ctrl.addSeeds();
            expect(ctrl.model).toEqual([
                {
                    valueClass: 'java.lang.Boolean',
                    parts: {
                        undefined: true
                    }
                }
            ]);
            expect(ctrl.seedForm.multiSeedInput.$setValidity).toHaveBeenCalledWith('csv', true);
        });

        it('should create a false boolean value from "false" strings', function() {
            ctrl.vertexClass = 'java.lang.Boolean';
            ctrl.seedVertices = 'false';
            fields = [{
                type: 'checkbox',
                class: 'java.lang.Boolean'
            }];

            ctrl.addSeeds();
            expect(ctrl.model).toEqual([
                {
                    valueClass: 'java.lang.Boolean',
                    parts: {
                        undefined: false
                    }
                }
            ]);
            expect(ctrl.seedForm.multiSeedInput.$setValidity).toHaveBeenCalledWith('csv', true);
        });

        it('should include fields with commas surrounded by a quotes as one field', function() {
            ctrl.vertexClass = 'java.lang.String';
            ctrl.seedVertices = '"comma,test"';
            ctrl.addSeeds();
            expect(ctrl.model).toEqual([
                {
                    valueClass: 'java.lang.String',
                    parts: {
                        undefined: 'comma,test'
                    }
                }
            ]);
            expect(ctrl.seedForm.multiSeedInput.$setValidity).toHaveBeenCalledWith('csv', true);
        });

        it('should create string seeds from numbers if field class is string', function() { 
            ctrl.vertexClass = 'java.lang.String';
            ctrl.seedVertices = '12';
            fields = [{
                type: 'number', // just to confuse things
                class: 'java.lang.String'
            }];
            ctrl.addSeeds();
            expect(ctrl.model).toEqual([
                {
                    valueClass: 'java.lang.String',
                    parts: {
                        undefined: '12'
                    }
                }
            ]);
            expect(ctrl.seedForm.multiSeedInput.$setValidity).toHaveBeenCalledWith('csv', true);
        });

        it('should create string seeds from numbers if the field class is text', function() {
            ctrl.vertexClass = 'customClass';
            ctrl.seedVertices = '12345678901234567890'; // this would round if converted to a number
            fields = [
                {
                    class: 'java.lang.Byte[]',
                    type: 'text'
                }
            ];

            ctrl.addSeeds();

            expect(ctrl.model).toEqual([
                {
                    valueClass: 'customClass',
                    parts: {
                        undefined: '12345678901234567890'
                    }
                }
            ]);
            expect(ctrl.seedForm.multiSeedInput.$setValidity).toHaveBeenCalledWith('csv', true);
            
        })

        it('should be able to handle escaped quotes', function() {
            ctrl.vertexClass = 'java.lang.String';
            ctrl.seedVertices = '"I contain a \\"quoted string\\""',
            ctrl.addSeeds();
            expect(ctrl.model).toEqual([
                {
                    valueClass: 'java.lang.String',
                    parts: {
                        undefined: 'I contain a "quoted string"'
                    }
                }
            ]);
            expect(ctrl.seedForm.multiSeedInput.$setValidity).toHaveBeenCalledWith('csv', true);
        });

        it('should be able to add escape characters', function() {
            ctrl.vertexClass = 'java.lang.String';
            ctrl.seedVertices = '"I contain a \\\\string with \\\\ escape characters"',
            ctrl.addSeeds();
            expect(ctrl.model).toEqual([
                {
                    valueClass: 'java.lang.String',
                    parts: {
                        undefined: 'I contain a \\string with \\ escape characters'
                    }
                }
            ]);
            expect(ctrl.seedForm.multiSeedInput.$setValidity).toHaveBeenCalledWith('csv', true);
        });

        it('should broadcast an error if the string contains an unclosed quote', function() {
            ctrl.vertexClass = 'java.lang.String';
            ctrl.seedVertices = '"I contain a string with only one quote',
            ctrl.addSeeds();
            expect(error.handle).toHaveBeenCalledWith('Unclosed quote for \'"I contain a string with only one quote\'', undefined)
        });

        it('should set the validity of the form to false if the string contains an unclosed quote', function() {
            ctrl.vertexClass = 'java.lang.String';
            ctrl.seedVertices = '"I contain a string with only one quote',
            ctrl.addSeeds();
            expect(ctrl.seedForm.multiSeedInput.$setValidity).toHaveBeenCalledWith('csv', false);
        });

        it('should broadcast an error if escaping the end of input', function() {
            ctrl.vertexClass = 'java.lang.String';
            ctrl.seedVertices = "\\";
            ctrl.addSeeds();
            expect(error.handle).toHaveBeenCalledWith('Illegal escape character at end of input for line: \'\\\'', undefined);
        });

        it('should set the validity of the form to false if the end of input is escaped', function() {
            ctrl.vertexClass = 'java.lang.String';
            ctrl.seedVertices = "\\";
            ctrl.addSeeds();
            expect(ctrl.seedForm.multiSeedInput.$setValidity).toHaveBeenCalledWith('csv', false);
        })

        it('should handle empty inputs', function() {
            ctrl.vertexClass = 'java.lang.String';
            ctrl.seedVertices = '',
            ctrl.addSeeds();
            expect(ctrl.model).toEqual([]);
        });

        it('should add empty strings', function() {
            ctrl.vertexClass = 'java.lang.String';
            ctrl.seedVertices = '""',
            ctrl.addSeeds();
            expect(ctrl.model).toEqual([
                {
                    valueClass: 'java.lang.String',
                    parts: {
                        undefined: ''
                    }
                }
            ]);
            expect(ctrl.seedForm.multiSeedInput.$setValidity).toHaveBeenCalledWith('csv', true);
        });

        it('should handle escaped quotes if the string is unquoted', function() {
            ctrl.vertexClass = 'java.lang.String';
            ctrl.seedVertices = 'This is a \\"test\\"';
            ctrl.addSeeds();

            expect(ctrl.model).toEqual([
                {
                    valueClass: 'java.lang.String',
                    parts: {
                        undefined: 'This is a "test"'
                    }
                }
            ]);
            expect(ctrl.seedForm.multiSeedInput.$setValidity).toHaveBeenCalledWith('csv', true);
        });

        it('should handle double backslashes if unquoted', function() {
            ctrl.vertexClass = 'java.lang.String';
            ctrl.seedVertices = 'This is a \\\\test\\\\';
            ctrl.addSeeds();

            expect(ctrl.model).toEqual([
                {
                    valueClass: 'java.lang.String',
                    parts: {
                        undefined: 'This is a \\test\\'
                    }
                }
            ]);
            expect(ctrl.seedForm.multiSeedInput.$setValidity).toHaveBeenCalledWith('csv', true);
        });

        it('should handle double backslashes if quoted', function() {
            ctrl.vertexClass = 'java.lang.String';
            ctrl.seedVertices = '"This is a \\\\test"';
            ctrl.addSeeds();

            expect(ctrl.model).toEqual([
                {
                    valueClass: 'java.lang.String',
                    parts: {
                        undefined: 'This is a \\test'
                    }
                }
            ]);
            expect(ctrl.seedForm.multiSeedInput.$setValidity).toHaveBeenCalledWith('csv', true);
        });

        it('should handle single backslashes if not quoted', function() {
            ctrl.vertexClass = 'java.lang.String';
            ctrl.seedVertices = 'This is a \\test';
            ctrl.addSeeds();

            expect(ctrl.model).toEqual([
                {
                    valueClass: 'java.lang.String',
                    parts: {
                        undefined: 'This is a test'
                    }
                }
            ]);
            expect(ctrl.seedForm.multiSeedInput.$setValidity).toHaveBeenCalledWith('csv', true);
        })

        it('should broadcast an error if an unquoted string appears before a quoted string with no separation', function() {
            ctrl.vertexClass = 'java.lang.String';
            ctrl.seedVertices = 'unquoted string "quoted String"',
            ctrl.addSeeds();
            expect(error.handle).toHaveBeenCalledWith('Unexpected \'"\' character in line \'unquoted string "quoted String"\'. Please escape with \\.', undefined)
        });

        it('should set the validity of the form to false if an unquoted string appears before a quoted string with no separation', function() {
            ctrl.vertexClass = 'java.lang.String';
            ctrl.seedVertices = 'unquoted string "quoted String"',
            ctrl.addSeeds();
            expect(ctrl.seedForm.multiSeedInput.$setValidity).toHaveBeenCalledWith('csv', false);
        })

        it('should broadcast an error if an quoted string appears before an unquoted string', function() {
            ctrl.vertexClass = 'java.lang.String';
            ctrl.seedVertices = '"quoted String" unquoted string',
            ctrl.addSeeds();
            expect(error.handle).toHaveBeenCalledWith('Unexpected \' \' character in line \'"quoted String" unquoted string\'.', undefined)
        });

        it('should set the validity of the form to false if a quoted string appears before an unquoted string with no separation', function() {
            ctrl.vertexClass = 'java.lang.String';
            ctrl.seedVertices = '"quoted String" unquoted string',
            ctrl.addSeeds();
            expect(ctrl.seedForm.multiSeedInput.$setValidity).toHaveBeenCalledWith('csv', false);
        });

        it('should re-convert numbers which should be strings', function() {
            fields = [
                {
                    class: 'java.lang.String'
                }
            ]
            ctrl.vertexClass = 'java.lang.String';
            ctrl.seedVertices = '1';
            ctrl.addSeeds();
            expect(ctrl.model).toEqual([
                {
                    valueClass: 'java.lang.String',
                    parts: {
                        undefined: '1'
                    }
                }
            ]);
            expect(ctrl.seedForm.multiSeedInput.$setValidity).toHaveBeenCalledWith('csv', true);
        });

        it('should remove duplicates', function() {
            fields = [
                {
                    class: 'java.lang.String'
                }
            ];
            ctrl.vertexClass = 'java.lang.String';
            ctrl.seedVertices='test\ntest\ntest';
            ctrl.addSeeds();
            expect(ctrl.model).toEqual([
                {
                    valueClass: 'java.lang.String',
                    parts: {
                        undefined: 'test'
                    }
                }
            ]);
            expect(ctrl.seedForm.multiSeedInput.$setValidity).toHaveBeenCalledWith('csv', true);
        });

        describe('When seeds are complex', function() {
            beforeEach(function() {
                fields = [
                    {
                        key: 'type',
                        class: 'java.lang.String'
                    },
                    {
                        key: 'subType',
                        class: 'java.lang.Long'

                    },
                    {
                        key: 'value',
                        class: 'java.lang.String'
                    }
                ];

                ctrl.vertexClass = 'TypeSubTypeValue'
            });

            it('should add undefined if part is empty', function() {
                ctrl.seedVertices = 'T,,';
                ctrl.addSeeds();
                expect(error.handle).not.toHaveBeenCalled();
                expect(ctrl.model).toEqual([{
                    valueClass: 'TypeSubTypeValue',
                    parts: {
                        'type': 'T',
                        'subType': undefined,
                        'value': undefined
                    }
                }]);
                expect(ctrl.seedForm.multiSeedInput.$setValidity).toHaveBeenCalledWith('csv', true);
            });

            it('should add empty string if parts are empty quoted strings', function() {
                ctrl.seedVertices = '"My type",,""';
                ctrl.addSeeds();
                expect(error.handle).not.toHaveBeenCalled();
                expect(ctrl.model).toEqual([{
                    valueClass: 'TypeSubTypeValue',
                    parts: {
                        'type': 'My type',
                        'subType': undefined,
                        'value': ""
                    }
                }]);
                expect(ctrl.seedForm.multiSeedInput.$setValidity).toHaveBeenCalledWith('csv', true);
            });

            it('should not add a seed if the line is empty', function() {
                ctrl.seedVertices = '';
                ctrl.addSeeds();
                expect(error.handle).not.toHaveBeenCalled();
                expect(ctrl.model).toEqual([]);
                expect(ctrl.seedForm.multiSeedInput.$setValidity).toHaveBeenCalledWith('csv', true);
            });

            it('should populate the first fields if not all fields are created', function() {
                ctrl.seedVertices = 'T';
                ctrl.addSeeds();
                expect(error.handle).not.toHaveBeenCalled();
                expect(ctrl.model).toEqual([{
                    valueClass: 'TypeSubTypeValue',
                    parts: {
                        'type': 'T',
                        'subType': undefined,
                        'value': undefined
                    }
                }]);
                expect(ctrl.seedForm.multiSeedInput.$setValidity).toHaveBeenCalledWith('csv', true);
            });

            it('should convert only the fields which are not strings', function() {
                ctrl.seedVertices = '1,2,3';
                ctrl.addSeeds();
                expect(error.handle).not.toHaveBeenCalled();
                expect(ctrl.model).toEqual([
                    {
                        valueClass: 'TypeSubTypeValue',
                        parts: {
                            type: '1',
                            subType: 2,
                            value: '3'
                        }
                    }
                ]);
                expect(ctrl.seedForm.multiSeedInput.$setValidity).toHaveBeenCalledWith('csv', true);
            });

            it('should remove duplicates', function() {
                ctrl.seedVertices='1,2,3\n1,2,3';
                ctrl.addSeeds();
                expect(error.handle).toHaveBeenCalled();
                expect(ctrl.model).toEqual([
                    {
                        valueClass: 'TypeSubTypeValue',
                        parts: {
                            type: '1',
                            subType: 2,
                            value: '3'
                        }
                    }
                ]);
                expect(ctrl.seedForm.multiSeedInput.$setValidity).toHaveBeenCalledWith('csv', true);
            });
        });
    });
});
