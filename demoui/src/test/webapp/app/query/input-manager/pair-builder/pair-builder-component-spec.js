describe('The pair builder component', function() {

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
        ctrl = $componentController('pairBuilder', {$scope: scope});
    }));

    it('should exist', function() {
        expect(ctrl).toBeDefined();
    });

    describe('ctrl.$onInit()', function() {

        var schema;
        var $q;
        var pairs = [];

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
            scope.$digest();
            expect(ctrl.vertexClass).toEqual('my.vertex.Class');
        });

        it('should set the pairs to an empty string if the model is an empty array', function() {
            ctrl.model = [];
            ctrl.$onInit();
            expect(ctrl.pairs).toEqual('');
        });

        it('should add a string seed from the model to the input box', function() {
            ctrl.model = [
                {
                    "first": {
                        valueClass: 'java.lang.String',
                        parts: {
                            undefined: 'test'
                        }
                    },
                    "second": {
                        valueClass: 'java.lang.String',
                        parts: {
                            undefined: 'test2'
                        }
                    }
                }
            ];
            ctrl.$onInit();
            expect(ctrl.pairs).toEqual('test,test2');
        });

        describe('with simple input query params', function() {
            beforeEach(function() {
                spyOn(types, 'getFields').and.returnValue([{
                     label: "Value",
                     type: "text",
                     class: "java.lang.String"
                }]);
            });

            it('should add a single seed pair', function() {
                $routeParams.input="seed1,seed2";
                ctrl.$onInit();
                scope.$digest();
                expect(error.handle).not.toHaveBeenCalled();
                expect(ctrl.model).toEqual([{
                    first: {
                        valueClass: 'my.vertex.Class',
                        parts: {
                            undefined: "seed1"
                        }
                    },
                    second: {
                        valueClass: 'my.vertex.Class',
                        parts: {
                            undefined: 'seed2'
                        }
                    }
                }]);
            });

            it('should add multiple seed pairs', function() {
                $routeParams.input=["seed1,seed2", "seed4,seed23"];
                ctrl.$onInit();
                scope.$digest();
                expect(error.handle).not.toHaveBeenCalled();
                expect(ctrl.model).toEqual([
                    {
                        first: {
                            valueClass: 'my.vertex.Class',
                            parts: {
                                undefined: "seed1"
                            }
                        },
                        second: {
                            valueClass: 'my.vertex.Class',
                            parts: {
                                undefined: 'seed2'
                            }
                        }
                    },
                    {
                        first: {
                            valueClass: 'my.vertex.Class',
                            parts: {
                                undefined: "seed4"
                            }
                        },
                        second: {
                            valueClass: 'my.vertex.Class',
                            parts: {
                                undefined: 'seed23'
                            }
                        }
                    }
                ]);
            });
            
            it('should not error if adding duplicate seeds', function() {
                ctrl.seedVertices = 'seed1,seed2';
                $routeParams.input = 'seed1,seed2';
                ctrl.$onInit();
                expect(error.handle).not.toHaveBeenCalled();
            });
        });

        describe('with complex input query params', function() {
            beforeEach(function() {
                spyOn(types, 'getFields').and.returnValue([{"key": "type"}, {"key": "value"}]);
            });

            it('should add a single seed pair', function() {
                $routeParams.input="t1,v1,t2,v2";
                ctrl.$onInit();
                scope.$digest();
                expect(error.handle).not.toHaveBeenCalled();
                expect(ctrl.model).toEqual([
                    {
                        first: {
                            valueClass: 'my.vertex.Class',
                            parts: {"type": "t1", "value": "v1"}
                        },
                        second: {
                            valueClass: 'my.vertex.Class',
                            parts: {"type": "t2", "value": "v2"}
                        }
                    },
                    
                ]);
            });

            it('should add multiple seed pairs', function() {
                $routeParams.input=["t1,v1,t3,v3", "t2,v2,t9,v9"];
                ctrl.$onInit();
                scope.$digest();
                expect(error.handle).not.toHaveBeenCalled();
                expect(ctrl.model).toEqual([
                    {
                        first: {
                            valueClass: 'my.vertex.Class',
                            parts: {"type": "t1", "value": "v1"}
                        },
                        second: {
                            valueClass: 'my.vertex.Class',
                            parts: {"type": "t3", "value": "v3"}
                        }
                    },
                    {
                        first: {
                            valueClass: 'my.vertex.Class',
                            parts: {"type": "t2", "value": "v2"}
                        },
                        second: {
                            valueClass: 'my.vertex.Class',
                            parts: {"type": "t9", "value": "v9"}
                        }
                    }
                    
                ]);
            });
        });

        it('should add a numerical seed pair from the input service to the input box', function() {
            ctrl.model = [
                {
                    first: {
                        valueClass: 'java.lang.Integer',
                        parts: {
                            undefined: 3
                        }
                    },
                    second: {
                        valueClass: 'java.lang.Integer',
                        parts: {
                            undefined: 4
                        }
                    }
                }
            ];
            ctrl.$onInit();
            expect(ctrl.pairs).toEqual('3,4');
        });

        it('should add a complex seed pair from the input service to the input box', function() {
            spyOn(types, 'getFields').and.returnValue([
                { key: 'type' },
                { key: 'subType' },
                { key: 'value' }
            ])
            ctrl.model = [
                {
                    first: {
                        valueClass: 'uk.gov.gchq.gaffer.types.TypeSubTypeValue',
                        parts: {
                            type: 't',
                            subType: 'st',
                            value: 'v'
                        }
                    },
                    second: {
                        valueClass: 'uk.gov.gchq.gaffer.types.TypeSubTypeValue',
                        parts: {
                            type: 't2',
                            subType: 'st2',
                            value: 'v2'
                        }
                    }
                }
                
            ];
            ctrl.$onInit();
            expect(ctrl.pairs).toEqual('t,st,v,t2,st2,v2');
        });

        it('should add multiple seed pairs seperated by a newline', function() {
            ctrl.model = [
                {
                    first: {
                        valueClass: 'java.lang.String',
                        parts: {
                            undefined: 'test1'
                        }
                    },
                    second: {
                        valueClass: 'java.lang.String',
                        parts: {
                            undefined: 'test2'
                        }
                    }
                },
                {
                    first: {
                        valueClass: 'java.lang.String',
                        parts: {
                            undefined: 'test3'
                        }
                    },
                    second: {
                        valueClass: 'java.lang.String',
                        parts: {
                            undefined: 'test4'
                        }
                    }
                }
            ];

            ctrl.$onInit();
            expect(ctrl.pairs).toEqual('test1,test2\ntest3,test4');
        });

        it('should subscribe to events', function() {
            spyOn(events, 'subscribe').and.stub();
            ctrl.$onInit();
            expect(events.subscribe).toHaveBeenCalledTimes(2);
            expect(events.subscribe).toHaveBeenCalledWith('onOperationUpdate', jasmine.any(Function))
            expect(events.subscribe).toHaveBeenCalledWith('onPreExecute', jasmine.any(Function))
        });
    });

    describe('ctrl.getPlaceHolder()', function() {
        it('should tell the user to enter their pairs of seeds', function() {
            spyOn(types, 'getCsvHeader').and.returnValue('type,value');
            expect(ctrl.getPlaceHolder()).toEqual('Enter your pairs of seeds, each pair on a new line.\ntype,value,type,value');
        });

        it('should tell the user that the input is being provided by the output of the previous operation', function() {
            ctrl.usePrevious = true;
            expect(ctrl.getPlaceHolder()).toEqual('Input is provided by the output of the previous operation');
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

    describe('ctrl.createExample()', function() {
        it('should call types.getCsvHeader() with the vertex class as the argument', function() {
            spyOn(types, 'getCsvHeader').and.stub();
            ctrl.vertexClass = 'test';
            ctrl.createExample();
            expect(types.getCsvHeader).toHaveBeenCalledWith('test');
        });

        it('should default to "start,end" if the csv header is an empty string', function() {
            spyOn(types, 'getCsvHeader').and.returnValue('');
            expect(ctrl.createExample()).toEqual('start,end');
        });

        it('should print a comma seperated csv header if one exists for the input type', function() {
            spyOn(types, 'getCsvHeader').and.returnValue('type,subType,value');
            expect(ctrl.createExample()).toEqual('type,subType,value,type,subType,value');
        });
    })

    describe('ctrl.addPairs()', function() {
        var fields;
        var error;

        beforeEach(inject(function(_error_) {
            error = _error_;
        }));

        beforeEach(function() {
            var fakeForm = {
                seedPairInput: {
                    $setValidity: jasmine.createSpy('$setValidity')
                }
            }
            ctrl.pairForm = fakeForm;
        });

        beforeEach(function() {
            spyOn(types, 'getFields').and.callFake(function(clazz) {
                return fields;
            });

            spyOn(error, 'handle').and.stub();
        });

        beforeEach(function() {
            fields = [{}];
        })

        it('should create string pairs from strings', function() {
            ctrl.vertexClass = 'java.lang.String';
            ctrl.pairs = 'test,pair';
            fields = [
                {
                    class: 'java.lang.String',
                    type: 'text'
                }
            ]
            ctrl.addPairs();
            expect(ctrl.model).toEqual([
                {
                    first: {
                        valueClass: 'java.lang.String',
                        parts: {
                            undefined: 'test'
                        }
                    },
                    second: {
                        valueClass: 'java.lang.String',
                        parts: {
                            undefined: 'pair'
                        }
                    }
                }
            ]);
            expect(ctrl.pairForm.seedPairInput.$setValidity).toHaveBeenCalledWith('csv', true);
        });

        it('should create numbers from numerical strings', function() {
            ctrl.vertexClass = 'java.lang.Long';
            ctrl.pairs = '123,456';
            fields = [
                {
                    class: 'java.lang.Long',
                    type: 'number'
                }
            ]
            ctrl.addPairs();
            expect(ctrl.model).toEqual([
                {
                    first: {
                        valueClass: 'java.lang.Long',
                        parts: {
                            undefined: 123
                        }
                    },
                    second: {
                        valueClass: 'java.lang.Long',
                        parts: {
                            undefined: 456
                        }
                    }
                }
                
            ]);
            expect(ctrl.pairForm.seedPairInput.$setValidity).toHaveBeenCalledWith('csv', true);
        });

        it('should create true boolean values from boolean strings', function() {
            ctrl.vertexClass = 'java.lang.Boolean';
            ctrl.pairs = 'true,false';
            fields = [
                {
                    class: 'java.lang.Boolean',
                    type: 'checkbox'
                }
            ]
            ctrl.addPairs();
            expect(ctrl.model).toEqual([
                {
                    first: {
                        valueClass: 'java.lang.Boolean',
                        parts: {
                            undefined: true
                        }
                    },
                    second: {
                        valueClass: 'java.lang.Boolean',
                        parts: {
                            undefined: false
                        }
                    }
                }
            ]);
            expect(ctrl.pairForm.seedPairInput.$setValidity).toHaveBeenCalledWith('csv', true);
        });

        it('should include fields with commas surrounded by a quotes as one field', function() {
            ctrl.vertexClass = 'java.lang.String';
            ctrl.pairs = '"comma,test",seed';
            fields = [
                {
                    class: 'java.lang.String',
                    type: 'text'
                }
            ]
            ctrl.addPairs();
            expect(ctrl.model).toEqual([
                {
                    first: {
                        valueClass: 'java.lang.String',
                        parts: {
                            undefined: 'comma,test'
                        }
                    },
                    second: {
                        valueClass: 'java.lang.String',
                        parts: {
                            undefined: 'seed'
                        }
                    }
                }
            ]);
            expect(ctrl.pairForm.seedPairInput.$setValidity).toHaveBeenCalledWith('csv', true);
        });

        it('should create string seeds from numbers with quotes around them', function() { 
            ctrl.vertexClass = 'java.lang.String';
            ctrl.pairs = '"12","180"';
            fields = [
                {
                    class: 'java.lang.String',
                    type: 'text'
                }
            ]
            ctrl.addPairs();
            expect(ctrl.model).toEqual([
                {
                    first: {
                        valueClass: 'java.lang.String',
                        parts: {
                            undefined: '12'
                        }
                    },
                    second: {
                        valueClass: 'java.lang.String',
                        parts: {
                            undefined: '180'
                        }
                    } 
                }

                
            ]);
            expect(ctrl.pairForm.seedPairInput.$setValidity).toHaveBeenCalledWith('csv', true);
        });

        it('should be able to handle escaped quotes', function() {
            ctrl.vertexClass = 'java.lang.String';
            ctrl.pairs = '"I contain a \\"quoted string\\"",seed',
            fields = [
                {
                    class: 'java.lang.String',
                    type: 'text'
                }
            ]
            ctrl.addPairs();
            expect(ctrl.model).toEqual([
                {
                    first: {
                        valueClass: 'java.lang.String',
                        parts: {
                            undefined: 'I contain a "quoted string"'
                        }
                    }, 
                    second: {
                        valueClass: 'java.lang.String',
                        parts: {
                            undefined: 'seed'
                        }
                    }
                }
                
            ]);
            expect(ctrl.pairForm.seedPairInput.$setValidity).toHaveBeenCalledWith('csv', true);
        });

        it('should be able to add escape characters', function() {
            ctrl.vertexClass = 'java.lang.String';
            ctrl.pairs = '"I contain a \\\\string with \\\\ escape characters",test',
            fields = [
                {
                    class: 'java.lang.String',
                    type: 'text'
                }
            ]
            ctrl.addPairs();
            expect(ctrl.model).toEqual([
                {
                    first: {
                        valueClass: 'java.lang.String',
                        parts: {
                            undefined: 'I contain a \\string with \\ escape characters'
                        }
                    },
                    second: {
                        valueClass: 'java.lang.String',
                        parts: {
                            undefined: 'test'
                        }
                    }
                }
            ]);
            expect(ctrl.pairForm.seedPairInput.$setValidity).toHaveBeenCalledWith('csv', true);
        });

        it('should broadcast an error if the string contains an unclosed quote', function() {
            ctrl.vertexClass = 'java.lang.String';
            ctrl.pairs = '"I contain a string with only one quote,test',
            fields = [
                {
                    class: 'java.lang.String',
                    type: 'text'
                }
            ]
            ctrl.addPairs();
            expect(error.handle).toHaveBeenCalledWith('Unclosed quote for \'"I contain a string with only one quote,test\'', undefined)
        });

        it('should set the validity of the form to false if the string contains an unclosed quote', function() {
            ctrl.vertexClass = 'java.lang.String';
            fields = [
                {
                    class: 'java.lang.String',
                    type: 'text'
                }
            ]
            ctrl.pairs = '"I contain a string with only one quote,test',
            ctrl.addPairs();
            expect(ctrl.pairForm.seedPairInput.$setValidity).toHaveBeenCalledWith('csv', false);
        });

        it('should broadcast an error if escaping the end of input', function() {
            ctrl.vertexClass = 'java.lang.String';
            fields = [
                {
                    class: 'java.lang.String',
                    type: 'text'
                }
            ]
            ctrl.pairs = "test,\\";
            ctrl.addPairs();
            expect(error.handle).toHaveBeenCalledWith('Illegal escape character at end of input for line: \'test,\\\'', undefined);
        });

        it('should set the validity of the form to false if the end of input is escaped', function() {
            ctrl.vertexClass = 'java.lang.String';
            fields = [
                {
                    class: 'java.lang.String',
                    type: 'text'
                }
            ]
            ctrl.pairs = "test,\\";
            ctrl.addPairs();
            expect(ctrl.pairForm.seedPairInput.$setValidity).toHaveBeenCalledWith('csv', false);
        })

        it('should handle empty inputs', function() {
            ctrl.vertexClass = 'java.lang.String';
            fields = [
                {
                    class: 'java.lang.String',
                    type: 'text'
                }
            ]
            ctrl.pairs = '',
            ctrl.addPairs();
            expect(ctrl.model).toEqual([]);
        });

        it('should add empty strings', function() {
            ctrl.vertexClass = 'java.lang.String';
            fields = [
                {
                    class: 'java.lang.String',
                    type: 'text'
                }
            ]
            ctrl.pairs = '"",""',
            ctrl.addPairs();
            expect(ctrl.model).toEqual([
                {
                    first: {
                        valueClass: 'java.lang.String',
                        parts: {
                            undefined: ''
                        }
                    },
                    second: {
                        valueClass: 'java.lang.String',
                        parts: {
                            undefined: ''
                        }
                    }
                }
                
            ]);
            expect(ctrl.pairForm.seedPairInput.$setValidity).toHaveBeenCalledWith('csv', true);
        });

        it('should handle escaped quotes if the string is unquoted', function() {
            ctrl.vertexClass = 'java.lang.String';
            ctrl.pairs = 'This is a \\"test\\",seed';
            fields = [
                {
                    class: 'java.lang.String',
                    type: 'text'
                }
            ]
            ctrl.addPairs();

            expect(ctrl.model).toEqual([
                {
                    first: {
                        valueClass: 'java.lang.String',
                        parts: {
                            undefined: 'This is a "test"'
                        }
                    },
                    second: {
                        valueClass: 'java.lang.String',
                        parts: {
                            undefined: 'seed'
                        }
                    }
                }
                
            ]);
            expect(ctrl.pairForm.seedPairInput.$setValidity).toHaveBeenCalledWith('csv', true);
        });

        it('should handle double backslashes if unquoted', function() {
            ctrl.vertexClass = 'java.lang.String';
            ctrl.pairs = 'test,This is a \\\\test\\\\';
            fields = [
                {
                    class: 'java.lang.String',
                    type: 'text'
                }
            ]
            ctrl.addPairs();

            expect(ctrl.model).toEqual([
                {
                    first: {
                        valueClass: 'java.lang.String',
                        parts: {
                            undefined: 'test'
                        }
                    },
                    second: {
                        valueClass: 'java.lang.String',
                        parts: {
                            undefined: 'This is a \\test\\'
                        }
                    }
                }
                
            ]);
            expect(ctrl.pairForm.seedPairInput.$setValidity).toHaveBeenCalledWith('csv', true);
        });

        it('should handle double backslashes if quoted', function() {
            ctrl.vertexClass = 'java.lang.String';
            ctrl.pairs = '"This is a \\\\test",case';
            fields = [
                {
                    class: 'java.lang.String',
                    type: 'text'
                }
            ]
            ctrl.addPairs();

            expect(ctrl.model).toEqual([
                {
                    first: {
                        valueClass: 'java.lang.String',
                        parts: {
                            undefined: 'This is a \\test'
                        }
                    },
                    second: {
                        valueClass: 'java.lang.String',
                        parts: {
                            undefined: 'case'
                        }
                    }
                }
                
            ]);
            expect(ctrl.pairForm.seedPairInput.$setValidity).toHaveBeenCalledWith('csv', true);
        });

        it('should handle single backslashes if not quoted', function() {
            ctrl.vertexClass = 'java.lang.String';
            ctrl.pairs = 'This is a \\test,case';
            fields = [
                {
                    class: 'java.lang.String',
                    type: 'text'
                }
            ]
            ctrl.addPairs();

            expect(ctrl.model).toEqual([
                {
                    first: {
                        valueClass: 'java.lang.String',
                        parts: {
                            undefined: 'This is a test'
                        }
                    },
                    second: {
                        valueClass: 'java.lang.String',
                        parts: {
                            undefined: 'case'
                        }
                    }
                }
                
            ]);
            expect(ctrl.pairForm.seedPairInput.$setValidity).toHaveBeenCalledWith('csv', true);
        })

        it('should broadcast an error if an unquoted string appears before a quoted string with no separation', function() {
            ctrl.vertexClass = 'java.lang.String';
            ctrl.pairs = 'unquoted string "quoted String",test',
            fields = [
                {
                    class: 'java.lang.String',
                    type: 'text'
                }
            ]
            ctrl.addPairs();
            expect(error.handle).toHaveBeenCalledWith('Unexpected \'"\' character in line \'unquoted string "quoted String",test\'. Please escape with \\.', undefined)
        });

        it('should set the validity of the form to false if an unquoted string appears before a quoted string with no separation', function() {
            ctrl.vertexClass = 'java.lang.String';
            ctrl.pairs = 'unquoted string "quoted String",test',
            fields = [
                {
                    class: 'java.lang.String',
                    type: 'text'
                }
            ]
            ctrl.addPairs();
            expect(ctrl.pairForm.seedPairInput.$setValidity).toHaveBeenCalledWith('csv', false);
        })

        it('should broadcast an error if an quoted string appears before an unquoted string', function() {
            ctrl.vertexClass = 'java.lang.String';
            ctrl.pairs = '"quoted String" unquoted string,test',
            fields = [
                {
                    class: 'java.lang.String',
                    type: 'text'
                }
            ]
            ctrl.addPairs();
            expect(error.handle).toHaveBeenCalledWith('Unexpected \' \' character in line \'"quoted String" unquoted string,test\'.', undefined)
        });

        it('should set the validity of the form to false if a quoted string appears before an unquoted string with no separation', function() {
            ctrl.vertexClass = 'java.lang.String';
            ctrl.pairs = '"quoted String" unquoted string,test',
            fields = [
                {
                    class: 'java.lang.String',
                    type: 'text'
                }
            ]
            ctrl.addPairs();
            expect(ctrl.pairForm.seedPairInput.$setValidity).toHaveBeenCalledWith('csv', false);
        });

        it('should re-convert numbers which should be strings', function() {
            fields = [
                {
                    class: 'java.lang.String'
                }
            ]
            ctrl.vertexClass = 'java.lang.String';
            ctrl.pairs = '1,2';
            ctrl.addPairs();
            expect(ctrl.model).toEqual([
                {
                    first: {
                        valueClass: 'java.lang.String',
                        parts: {
                            undefined: '1'
                        }
                    },
                    second: {
                        valueClass: 'java.lang.String',
                        parts: {
                            undefined: '2'
                        }
                    }
                }
                
            ]);
            expect(ctrl.pairForm.seedPairInput.$setValidity).toHaveBeenCalledWith('csv', true);
        });

        it('should remove duplicates', function() {
            fields = [
                {
                    class: 'java.lang.String'
                }
            ];
            ctrl.vertexClass = 'java.lang.String';
            ctrl.pairs='test,case\ntest,case\ntest,case';
            ctrl.addPairs();
            expect(ctrl.model).toEqual([
                {
                    first: {
                        valueClass: 'java.lang.String',
                        parts: {
                            undefined: 'test'
                        }
                    },
                    second: {
                        valueClass: 'java.lang.String',
                        parts: {
                            undefined: 'case'
                        }
                    }
                }
                
            ]);
            expect(ctrl.pairForm.seedPairInput.$setValidity).toHaveBeenCalledWith('csv', true);
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
                ctrl.pairs = 'T,,,,,';
                ctrl.addPairs();
                expect(error.handle).not.toHaveBeenCalled();
                expect(ctrl.model).toEqual([
                    {
                        first: {
                            valueClass: 'TypeSubTypeValue',
                            parts: {
                                'type': 'T',
                                'subType': undefined,
                                'value': undefined
                            }
                        },
                        second: {
                            valueClass: 'TypeSubTypeValue',
                            parts: {
                                'type': undefined,
                                'subType': undefined,
                                'value': undefined
                            }
                        }
                    }
                ]);
                expect(ctrl.pairForm.seedPairInput.$setValidity).toHaveBeenCalledWith('csv', true);
            });

            it('should add empty string if parts are empty quoted strings', function() {
                ctrl.pairs = '"My type",,"",t,st,v';
                ctrl.addPairs();
                expect(error.handle).not.toHaveBeenCalled();
                expect(ctrl.model).toEqual([
                    {
                        first: {
                            valueClass: 'TypeSubTypeValue',
                            parts: {
                                'type': 'My type',
                                'subType': undefined,
                                'value': ""
                            }
                        },
                        second: {
                            valueClass: 'TypeSubTypeValue',
                            parts: {
                                'type': 't',
                                'subType': 'st',
                                'value': 'v'
                            }
                        }  
                    
                    }   
                ]);
                expect(ctrl.pairForm.seedPairInput.$setValidity).toHaveBeenCalledWith('csv', true);
            });

            it('should not add a seed if the line is empty', function() {
                ctrl.pairs = '';
                ctrl.addPairs();
                expect(error.handle).not.toHaveBeenCalled();
                expect(ctrl.model).toEqual([]);
                expect(ctrl.pairForm.seedPairInput.$setValidity).toHaveBeenCalledWith('csv', true);
            });

            it('should broadcast an error if not all fields are created', function() {
                ctrl.pairs = 'T';
                ctrl.addPairs();
                expect(error.handle).toHaveBeenCalledWith("Expected exactly 6 parts but line \'T\' only contains 1", 'Expected exactly 6 parts but line \'T\' only contains 1. Please wrap values containing commas in "quotes" and include empty fields');
                expect(ctrl.pairForm.seedPairInput.$setValidity).toHaveBeenCalledWith('csv', false);
            });

            it('should convert only the fields which are not strings', function() {
                ctrl.pairs = '1,2,3,4,5,6';
                ctrl.addPairs();
                expect(error.handle).not.toHaveBeenCalled();
                expect(ctrl.model).toEqual([
                    {
                        first: {
                            valueClass: 'TypeSubTypeValue',
                            parts: {
                                type: '1',
                                subType: 2,
                                value: '3'
                            }
                        },
                        second: {
                            valueClass: 'TypeSubTypeValue',
                            parts: {
                                type: '4',
                                subType: 5,
                                value: '6'
                            }
                        }
                    }
                    
                ]);
                expect(ctrl.pairForm.seedPairInput.$setValidity).toHaveBeenCalledWith('csv', true);
            });

            it('should remove duplicates', function() {
                ctrl.pairs='1,2,3,1,2,3\n1,2,3,1,2,3';
                ctrl.addPairs();
                expect(error.handle).toHaveBeenCalled();
                expect(ctrl.model).toEqual([
                    {
                        first: {
                            valueClass: 'TypeSubTypeValue',
                            parts: {
                                type: '1',
                                subType: 2,
                                value: '3'
                            }
                        },
                        second: {
                            valueClass: 'TypeSubTypeValue',
                            parts: {
                                type: '1',
                                subType: 2,
                                value: '3'
                            }
                        }
                    }
                ]);
                expect(ctrl.pairForm.seedPairInput.$setValidity).toHaveBeenCalledWith('csv', true);
            });
        });
    });
});
