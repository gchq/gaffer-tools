describe('The type service', function() {

    var $rootScope;

    var service;

    beforeEach(module('app'));

    beforeEach(module(function($provide) {
        $provide.factory('config', function($q) {

            return {
                get: function() {
                    return $q.when({
                        "types": {
                            'a.custom.Class': {
                                fields: [
                                    {
                                        key: 'test1'
                                    },
                                    {
                                        key: 'test2'
                                    }
                                ]
                            },
                            'some.java.Class': {
                                fields: 'test'
                            },
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
                            "java.lang.Integer": {
                                "fields": [
                                    {
                                        "type": "number",
                                        "step": "1",
                                        "class": "java.lang.Integer",
                                        "required": true
                                    }
                                ]
                            },
                            "a.class.which.ends.in.Set": {
                                "fields": [
                                    {
                                        "type": "number",
                                        "step": 1,
                                        "class": "java.lang.Long",
                                        "key": "fieldA",
                                        "required": true
                                    },
                                    {
                                        "type": "text",
                                        "class": "java.lang.String",
                                        "key": "fieldB"
                                    }
                                ]
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
                                "fields": [
                                    {
                                        "label": "Value",
                                        "type": "text",
                                        "key": "value",
                                        "class": "java.lang.String",
                                        "required": true
                                    },
                                    {
                                        "label": "Type",
                                        "type": "text",
                                        "key": "type",
                                        "class": "java.lang.String"
                                    },
                                    {
                                        "label": "Sub Type",
                                        "type": "text",
                                        "key": "subType",
                                        "class": "java.lang.String"
                                    }
                                ],
                                "wrapInJson": true
                            },
                            "com.clearspring.analytics.stream.cardinality.HyperLogLogPlus": {
                                "fields": [
                                    {
                                        "label": "cardinality",
                                        "type": "number",
                                        "key": "hyperLogLogPlus.cardinality",
                                        "class": "java.lang.Integer",
                                        "step": 1,
                                        "required": true
                                    }
                                ],
                                "wrapInJson": true,
                                "custom": true
                            },
                            "this.is.a.custom.object": {
                                "fields": [
                                    {
                                        "label": "isItATest",
                                        "type": "boolean",
                                        "key": "customObject.isItATest",
                                        "class": "java.lang.Boolean",
                                        "step": 1,
                                        "required": true
                                    }
                                ],
                                "wrapInJson": true,
                                "custom": true
                            },
                            "this.is.a.custom.object2": {
                                "fields": [
                                    {
                                        "label": "field1",
                                        "type": "boolean",
                                        "key": "customObject.field1",
                                        "class": "java.lang.Boolean",
                                        "step": 1,
                                        "required": true
                                    },
                                    {
                                        "label": "field2",
                                        "type": "text",
                                        "key": "customObject.field2",
                                        "class": "java.lang.String",
                                        "step": 1,
                                        "required": true
                                    }
                                ],
                                "wrapInJson": true,
                                "custom": true
                            },
                            "JSON": {
                                "fields" : [
                                    {
                                        "label": "JSON",
                                        "type": "textarea",
                                        "class": ""
                                    }
                                ],
                                "wrapInJson": false
                            }
                        }
                    });
                }
            }
        });

        $provide.factory('schema', function($q) {
            return {
                get: function() {
                    return $q.when({});
                }
            }
        });
    }));

    beforeEach(inject(function(_$rootScope_, _types_) {
        $rootScope = _$rootScope_;
        service = _types_;
    }));

    beforeEach(function() {
        $rootScope.$digest();
    });



    describe('types.getFields()', function() {
        var defaultFields = [
            {
                label: 'Value',
                type: 'text',
                class: "java.lang.String"
            }
        ];


        it('should return a default if the type does not exist in the config', function() {
            var fields = service.getFields("an unknown class");
            expect(fields).toBeDefined();
            expect(fields).toEqual(defaultFields);
        });

        it('should return a default if the class is undefined', function() {
            var fields = service.getFields(undefined);
            expect(fields).toBeDefined();
            expect(fields).toEqual(defaultFields);
        });

        it('should return a default if the class is null', function() {
            var fields = service.getFields(null);
            expect(fields).toBeDefined();
            expect(fields).toEqual(defaultFields);
        });

        it('should return fields from an existing type', function() {
            var fields = service.getFields('some.java.Class');
            expect(fields).toEqual('test');
        });
    });

    describe('types.createValue()', function() {
        it('should return the value of the parts generated by createParts() without the json', function() {
            var value = service.createValue('java.lang.Long', {undefined: 200}); // see types.createParts()
            expect(value).toEqual(200);
        });

        it('should return the value of a number', function() {
            var value = service.createValue('java.lang.Short', 20);
            expect(value).toEqual(20);
        });

        it('should return the value of a String', function() {
            var value = service.createValue('java.lang.String', 'test');
            expect(value).toEqual('test');
        })

        it('should return a json parsed object if the value is JSON', function() {
            var value = service.createValue('JSON', {undefined: '{"java.lang.Long": 204}'});
            expect(value).toEqual({"java.lang.Long": 204});
        });

        it('should return the value of the parts generated by createParts when the class is java.lang.Integer', function() {
            var value = service.createValue('java.lang.Integer', {undefined: 42}); // see types.createParts();
            expect(value).toEqual(42);
        });

        it('should return the value of a the parts generated by java.lang.String', function() {
            var value = service.createValue('java.lang.String', {undefined: 'test'}) // see types.createParts();
            expect(value).toEqual('test');
        });

        it('should return the keys and values of POJOs', function() {
            value = service.createValue('uk.gov.gchq.gaffer.types.TypeSubTypeValue', {type: 'vehicle', subType: 'car', value: 'hatchback'});
            expect(value).toEqual({type: 'vehicle', subType: 'car', value: 'hatchback'})
        });

        it('should create custom objects', function() {
            value = service.createValue('com.clearspring.analytics.stream.cardinality.HyperLogLogPlus', {'hyperLogLogPlus.cardinality': 30});
            var expected = {
                "hyperLogLogPlus": {
                    "cardinality": 30
                }
            };

            expect(value).toEqual(expected);
        });

        it('should create list objects without needing to use the config', function() {
            value = service.createValue('java.util.ArrayList', {undefined: ['this', 'is', 'a', 'test']});
            expect(value).toEqual(['this', 'is', 'a', 'test']);
        });

        it('should create set objects without needing to use the config', function() {
            value = service.createValue('java.util.TreeSet', {undefined: [1, 2, 3, 4]});
            expect(value).toEqual([1, 2, 3, 4]);
        });

        it('should create map objects,  without needing to use the config', function() {
            value = service.createValue('java.util.HashMap', {undefined: {"marco": "polo", "swings": "roundabouts"}});
            expect(value).toEqual({"marco": "polo", "swings": "roundabouts"});
        });

        it('should return undefined if the parts have not been set', function() {
            var value = service.createValue('java.lang.Long', {});
            expect(value).toBeUndefined();
        });
    });

    describe('types.isKnown()', function() {
        it('should return true if the given class exists in the types', function() {
            expect(service.isKnown('java.lang.Long')).toBeTruthy();
        });

        it('should return false if the given class name does not exist in the schema', function() {
            expect(service.isKnown('java.util.ArrayList')).toBeFalsy();
        })
    });

    describe('types.getSimpleClassNames()', function() {
        it('should return a map of simple class names to fully qualified class names', function() {
            var expected = {
                "Class": "some.java.Class",
                "Long": "java.lang.Long",
                "Integer": "java.lang.Integer",
                "Set": "a.class.which.ends.in.Set",
                "String": "java.lang.String",
                "TypeSubTypeValue": "uk.gov.gchq.gaffer.types.TypeSubTypeValue",
                "HyperLogLogPlus": "com.clearspring.analytics.stream.cardinality.HyperLogLogPlus",
                "object": 'this.is.a.custom.object',
                "object2": 'this.is.a.custom.object2',
                "JSON": "JSON"
            };

            expect(service.getSimpleClassNames()).toEqual(expected);
        })
    })

    describe('types.createJsonValue()', function() {
        it('should create a long value with the JSON', function() {
            var value = service.createJsonValue('java.lang.Long', {undefined: 12});
            var expected = {'java.lang.Long': 12};

            expect(value).toEqual(expected);
        });

        it('should create an integer without the JSON', function() {
            var value = service.createJsonValue('java.lang.Integer', {undefined: 220});
            var expected = 220;

            expect(value).toEqual(expected);
        });

        it('should create a string without the JSON', function() {
            var value = service.createJsonValue('java.lang.String', {undefined: "This is a test"});
            var expected = "This is a test";

            expect(value).toEqual(expected);
        });

        it('should create POJOs wrapped in JSON', function() {
            var value = service.createJsonValue('uk.gov.gchq.gaffer.types.TypeSubTypeValue', {type: 'T', subType: 'ST', value: 'V'});
            var expected = {
                "uk.gov.gchq.gaffer.types.TypeSubTypeValue": {
                    "type": "T",
                    "subType": "ST",
                    "value": "V"
                }
            }

            expect(value).toEqual(expected);
        });

        it('should create custom Objects wrapped in JSON', function() {
            value = service.createJsonValue('com.clearspring.analytics.stream.cardinality.HyperLogLogPlus', {'hyperLogLogPlus.cardinality': 30});

            var expected = {
                'com.clearspring.analytics.stream.cardinality.HyperLogLogPlus': {
                    "hyperLogLogPlus": {
                        "cardinality": 30
                    }
                }
            }

            expect(value).toEqual(expected);
        });

        it('should create JSON wrapped list objects without adding it to the config', function() {
            value = service.createJsonValue('java.util.ArrayList', {undefined: ['this', 'is', 'a', 'test']});
            expect(value).toEqual({'java.util.ArrayList': ['this', 'is', 'a', 'test']});
        });

        it('should create JSON wrapped set objects without adding it to the config', function() {
            value = service.createJsonValue('java.util.TreeSet', {undefined: [1, 2, 3, 4]});
            expect(value).toEqual({'java.util.TreeSet': [1, 2, 3, 4]});
        });

        it('should create JSON wrapped map objects without adding it to the config', function() {
            value = service.createJsonValue('java.util.HashMap', {undefined: {"marco": "polo", "swings": "roundabouts"}});
            expect(value).toEqual({'java.util.HashMap': {"marco": "polo", "swings": "roundabouts"}});
        });
    });

    describe('types.createParts()', function() {

        it('should use an undefined key for a long', function() {
            var value = service.createParts('java.lang.Long', 200);
            var expected = {undefined: 200};

            expect(value).toEqual(expected);
        });

        it('should use an undefined key for a json wrapped long', function() {
            var value = service.createParts('java.lang.Long', {'java.lang.Long': 200});
            var expected = {undefined: 200};

            expect(value).toEqual(expected);
        });

        it('should use an undefined key for an integer', function() {
            var value = service.createParts('java.lang.Integer', 30);
            var expected = { undefined: 30 };

            expect(value).toEqual(expected);
        });

        it('should use an undefined key for a string', function() {
            var value = service.createParts('java.lang.String', 'hello world');
            var expected = { undefined: 'hello world' };

            expect(value).toEqual(expected);
        });

        it('should use the specified keys for POJOs', function() {
            var value = service.createParts('uk.gov.gchq.gaffer.types.TypeSubTypeValue', {'type': 't', 'subType': 'st', 'value': 'v'});
            var expected = {'type': 't', 'subType': 'st', 'value': 'v'};

            expect(value).toEqual(expected);
        });

        it('should use the keys present in incomplete POJOs', function() {
            var value = service.createParts('uk.gov.gchq.gaffer.types.TypeSubTypeValue', {'uk.gov.gchq.gaffer.types.TypeSubTypeValue': {'value': 'v'}})
            var expected = {
                'type': undefined,
                'subType': undefined,
                'value': 'v'
            }

            expect(value).toEqual(expected);
        });

        it('should use the specified keys for custom objects', function() {
            var value = service.createParts('com.clearspring.analytics.stream.cardinality.HyperLogLogPlus', { "hyperLogLogPlus": { "cardinality": 30 }})
            var expected = {'hyperLogLogPlus.cardinality': 30};

            expect(value).toEqual(expected);
        });

        it('should use the specified keys for json wrapped custom objects', function() {
            var value = service.createParts('com.clearspring.analytics.stream.cardinality.HyperLogLogPlus', {'com.clearspring.analytics.stream.cardinality.HyperLogLogPlus': { "hyperLogLogPlus": { "cardinality": 30 }}})
            var expected = {'hyperLogLogPlus.cardinality': 30};

            expect(value).toEqual(expected);
        });

        it('should use an undefined key for Lists', function() {
            var value = service.createParts('java.util.ArrayList', [1, 2, 3]);
            var expected = {undefined: [1, 2, 3]};

            expect(value).toEqual(expected);
        });

        it('should use an undefined key for JSON wrapped Lists', function() {
            var value = service.createParts('java.util.ArrayList', {'java.util.ArrayList': [1, 2, 3]});
            var expected = {undefined: [1, 2, 3]};

            expect(value).toEqual(expected);
        });

        it('should use an undefined key for Maps', function() {
            var value = service.createParts('java.util.HashMap', {1: 'one', 2: 'two', 3: 'three'});
            var expected = {undefined: {1: 'one', 2: 'two', 3: 'three'}};
            expect(value).toEqual(expected);
        });

        it('should use an undefined key for JSON wrapped Maps', function() {
            var value = service.createParts('java.util.HashMap', {'java.util.HashMap': {1: 'one', 2: 'two', 3: 'three'}});
            var expected = {undefined: {1: 'one', 2: 'two', 3: 'three'}};
            expect(value).toEqual(expected);
        });

        it('should use an undefined key for Sets', function() {
            var value = service.createParts('java.util.TreeSet', [1, 2, 3]);
            var expected = {undefined: [1, 2, 3]};

            expect(value).toEqual(expected);
        });

        it('should use an undefined key for JSON wrapped Sets', function() {
            var value = service.createParts('java.util.TreeSet', {'java.util.TreeSet': [1, 2, 3]});
            var expected = {undefined: [1, 2, 3]};

            expect(value).toEqual(expected);
        });
    });

    describe('types.getShortValue()', function() {
        it('should return a string as itself', function() {
            var value = service.getShortValue('test');
            expect(value).toEqual('test');
        });

        it('should return a number as itself', function() {
            var value = service.getShortValue(1);
            expect(value).toEqual(1);
        });

        it('should return null as itself', function() {
            var value = service.getShortValue(null);
            expect(value).toEqual(null);
        });

        it('should return undefined as itself', function() {
            var value = service.getShortValue(undefined);
            expect(value).toEqual(undefined);
        });

        it('should return a long as the numeric value', function() {
            var value = service.getShortValue({"java.lang.Long": 42});
            expect(value).toEqual(42);
        });

        it('should return a comma delimited representation of POJOs', function() {
            var value = service.getShortValue({'uk.gov.gchq.gaffer.types.TypeSubTypeValue': {'type': 't', 'subType': 'st', 'value': 'v'}})
            expect(value).toEqual('v,t,st');
        });

        it('should return a comma delimited representation of POJOs which end with the word "Set"', function() {
            var value = service.getShortValue({"a.class.which.ends.in.Set": {
                "fieldA": {"java.lang.Long": 200},
                "fieldB": "foo"
            }});

            expect(value).toEqual("200,foo");
        })

        it('should create a custom short value for custom types', function() {
            var value = service.getShortValue({'com.clearspring.analytics.stream.cardinality.HyperLogLogPlus': { "hyperLogLogPlus": { "cardinality": 30 }}})
            expect(value).toEqual(30);
        });

        it('should work for ArrayLists without having to add to the types config', function() {
            var value = service.getShortValue({"java.util.ArrayList": [1, 2, 3]});
            expect(value).toEqual('1, 2, 3');
        });

        it('should work for HashSets without having to add the types config ', function() {
            var value = service.getShortValue({"java.util.HashSet": ['a', 'b', 'c']});
            expect(value).toEqual('a, b, c');
        });

        it('should work for HashMaps without having to add the types to the config', function() {
            var value = service.getShortValue({"java.util.HashMap": {"key": "value", "another key": "a different value"}});
            expect(value).toEqual('key: value, another key: a different value');
        });

        it('should work for arrays', function() {
            var value = service.getShortValue(['hello', 'world']);
            expect(value).toEqual('hello, world');
        });

        it('should return singular value from objects containing only one value', function() {
            var value = service.getShortValue({'this.is.a.custom.object': { "customObject": { "isItATest": true }}});
            expect(value).toEqual(true);
        });

        it('should return values in a string from objects containing two or more values', function() {
            var value = service.getShortValue({'this.is.a.custom.object2': { "customObject": { "field1": true, "field2": "foo" }}});
            expect(value).toEqual("field1: true, field2: foo");
        });
    });

    describe('types.getCsvHeader()', function() {
        it('should return an empty string if the label and key is undefined', function() {
            var value = service.getCsvHeader('java.lang.Integer');
            expect(value).toEqual('');
        });

        it('should return the label of custom fields', function() {
            var value = service.getCsvHeader('com.clearspring.analytics.stream.cardinality.HyperLogLogPlus');
            expect(value).toEqual('cardinality');
        });

        it('should return a comma separated list of field labels when there are multiple fields', function() {
            var value = service.getCsvHeader('uk.gov.gchq.gaffer.types.TypeSubTypeValue');
            expect(value).toEqual('Value,Type,Sub Type');
        });

        it('should return a defined key if the label is undefined', function() {
            var value = service.getCsvHeader('a.custom.Class');
            expect(value).toEqual('test1,test2');
        });

    });




});
