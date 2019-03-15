describe('The Seed Builder', function() {
    var ctrl;
    var events;
    var types;
    var error;

    var fakeTypes;
    var OPERATION_UPDATE_EVENT = 'onOperationUpdate';

    beforeEach(module('app'));

    beforeEach(inject(function(_$componentController_, _events_, _types_, _error_) {
        events = _events_;
        types = _types_;
        error = _error_;
        ctrl = _$componentController_('seedBuilder', null, {
            model: [],
        });
    }));

    beforeEach(function() {
        fakeTypes = {
            "java.lang.Long": {
                "fields": [
                    {
                        "type": "number",
                        "step": "1",
                        "class": "java.lang.Long",
                        "required": true
                    }
                ],
                "wrapInJson": true
            },
            "java.lang.String": {
                "fields": [
                    {
                        "type": "text",
                        "class": "java.lang.String",
                        "required": true
                    }
                ]
            },
            "uk.gov.gchq.gaffer.types.TypeSubTypeValue": {
                "wrapInJson": true,
                "fields": [
                    {
                        "type": "text",
                        "class": "java.lang.String",
                        "key": "type",
                        "label": "type"
                    },
                    {
                        "type": "text",
                        "class": "java.lang.String",
                        "key": "subType",
                        "label": "subType"
                    },
                    {
                        "type": "text",
                        "class": "java.lang.String",
                        "key": "value",
                        "label": "value",
                        "required": true
                    }
                ]
            }
        }
    })

    beforeEach(function() {
        spyOn(types, 'getFields').and.callFake(function(clazz) {
            if (!clazz) {
                return undefined;
            }
            return fakeTypes[clazz].fields;
        });
        spyOn(error, 'handle').and.stub();
    });

    beforeEach(function() {
        ctrl.$onInit();
    });

    
    var fireEvent = function(newInput) {
        ctrl.model = newInput;
        events.broadcast(OPERATION_UPDATE_EVENT, []);
    }

    var assertNoErrors = function() {
        expect(error.handle).not.toHaveBeenCalled();
    }

    it('should reset a text box when it receives a single string as input', function() {
        ctrl.vertexClass = 'java.lang.String';
        fireEvent([{
            valueClass: 'java.lang.String',
            parts: {
                undefined: "test"
            }
        }]);

        expect(ctrl.seedVertices).toEqual('test')
        assertNoErrors();
    });

    it('should reset the text box when it receives a single number as input', function() {
        ctrl.vertexClass = 'java.lang.Long';
        fireEvent([{
            valueClass: 'java.lang.Long',
            parts: {
                undefined: 1000
            }
        }]);

        expect(ctrl.seedVertices).toEqual('1000')
        assertNoErrors();
    });

    it('should reset the text box when it receives a complex object as input', function() {
        ctrl.vertexClass = 'uk.gov.gchq.gaffer.types.TypeSubTypeValue';
        fireEvent([{
            valueClass: 'uk.gov.gchq.gaffer.types.TypeSubTypeValue',
            parts: {
                'type': 't',
                'subType': 'st',
                'value': 'v'
            }
        }]);

        expect(ctrl.seedVertices).toEqual('t,st,v');
        assertNoErrors();
    });

    it('should wrap string fields which contain a comma with a quote', function() {
        ctrl.vertexClass = 'uk.gov.gchq.gaffer.types.TypeSubTypeValue';
        fireEvent([{
            valueClass: 'uk.gov.gchq.gaffer.types.TypeSubTypeValue',
            parts: {
                'type': 'type, with a comma',
                'subType': 'st',
                'value': 'v'
            }
        }]);

        expect(ctrl.seedVertices).toEqual('"type, with a comma",st,v');
        assertNoErrors();
    });

    it('should wrap string fields which appear as numbers with quotes', function() {
        ctrl.vertexClass = 'java.lang.String';
        fireEvent([{
            valueClass: 'java.lang.String',
            parts: {
                undefined: "100"
            }
        }]);

        expect(ctrl.seedVertices).toEqual('"100"');
        assertNoErrors();
    });

    it('should add commas if field is null', function() {
        ctrl.vertexClass = 'uk.gov.gchq.gaffer.types.TypeSubTypeValue'
        fireEvent([{
            valueClass: 'uk.gov.gchq.gaffer.types.TypeSubTypeValue',
            parts: {
                'type': 't1',
                'subType': null,
                'value': 'v1'
            }
        }]);

        expect(ctrl.seedVertices).toEqual('t1,,v1');
    });

    it('should add commas if the field is undefined', function() {
        ctrl.vertexClass = 'uk.gov.gchq.gaffer.types.TypeSubTypeValue'
        fireEvent([{
            valueClass: 'uk.gov.gchq.gaffer.types.TypeSubTypeValue',
            parts: {
                'type': undefined,
                'subType': 'st2',
                'value': 'v1'
            }
        }]);

        expect(ctrl.seedVertices).toEqual(',st2,v1');
    });

    it('should add commas if the last field is undefined', function() {
        ctrl.vertexClass = 'uk.gov.gchq.gaffer.types.TypeSubTypeValue';
        fireEvent([{
            valueClass: 'uk.gov.gchq.gaffer.types.TypeSubTypeValue',
            parts: {
                'type': 'defined',
                'subType': 'defined',
                'value': undefined
            }
        }]);

        expect(ctrl.seedVertices).toEqual('defined,defined,');
    });

    it('should add an empty string if no string fields are returned', function() {
        ctrl.vertexClass = 'java.lang.String';
        fireEvent([]);
        expect(ctrl.seedVertices).toEqual('');
    });

    it('should escape quotes in strings', function() {
        ctrl.vertexClass = 'java.lang.String';
        fireEvent([
            {
                valueClass: 'java.lang.String',
                parts: {
                    undefined: 'a string containing "quotes"'
                }
            }
        ]);

        expect(ctrl.seedVertices).toEqual('a string containing \\"quotes\\"');
    });

    it('should escape backslashes in strings', function() {
        ctrl.vertexClass = 'java.lang.String';
        fireEvent([
            {
                valueClass: 'java.lang.String',
                parts: {
                    undefined: 'a string containing \\backslashes\\'
                }
            }
        ]);

        expect(ctrl.seedVertices).toEqual('a string containing \\\\backslashes\\\\');
    });

    it('should add an empty string if no complex fields are returned', function() {
        ctrl.vertexClass = 'uk.gov.gchq.gaffer.types.TypeSubTypeValue';
        fireEvent([]);
        expect(ctrl.seedVertices).toEqual('');
    });

    it('should add multiple seeds and separate them', function() {
        ctrl.vertexClass = 'uk.gov.gchq.gaffer.types.TypeSubTypeValue'
        fireEvent([{
            valueClass: 'uk.gov.gchq.gaffer.types.TypeSubTypeValue',
            parts: {
                'type': 't1',
                'subType': 'st1',
                'value': 'v1'
            }
        },
        {
            valueClass: 'uk.gov.gchq.gaffer.types.TypeSubTypeValue',
            parts: {
                'type': 't2',
                'subType': 'st2',
                'value': 'v2'
            }
        }]);

        expect(ctrl.seedVertices).toEqual('t1,st1,v1\nt2,st2,v2');
        assertNoErrors();
    });

    it('should add the seeds if it receives a "onPreExecute" event', function() {
        expect(ctrl.model).toEqual([]);
        ctrl.vertexClass='java.lang.String';
        ctrl.seedVertices = 'M5\nM32:1';
        events.broadcast('onPreExecute', []);
        expect(ctrl.model).toEqual([
            {
                valueClass: 'java.lang.String',
                parts: {
                    undefined: 'M5'
                }
            },
            {
                valueClass: 'java.lang.String',
                parts: {
                    undefined: 'M32:1'
                }
            }
        ])

    })


})
