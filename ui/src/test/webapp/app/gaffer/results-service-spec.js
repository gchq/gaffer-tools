describe('The results service', function() {

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
                                    },
                                    {
                                        "label": "Value",
                                        "type": "text",
                                        "key": "value",
                                        "class": "java.lang.String",
                                        "required": true
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

    beforeEach(inject(function(_results_) {
        service = _results_;
    }));

    it('should exist', function() {
        expect(service).toBeDefined();
    });

    describe('results.get()', function() {
        it('should get the initial results if not updated', function() {
            var value = service.get();
            expect(value).toEqual({"entities": [], "edges": [], "other": []});
        });

        it('should get updated results', function() {
            service.update(["Foo", "Bar", "FooBar"]);
            var value = service.get();
            expect(value).toEqual({"entities": [], "edges": [], "other": [Object({ class: 'String', value: 'Foo' }), Object({ class: 'String', value: 'Bar' }), Object({ class: 'String', value: 'FooBar' })]});
        });
    });

    describe('results.update()', function() {
        it('should ignore duplicate values in other', function() {
            var edge1 = {"class":"uk.gov.gchq.gaffer.data.element.Edge","group":"RoadHasJunction","source":"M32","destination":"M32:2","directed":true,"matchedVertex":"DESTINATION","properties":{}};
            var edge2 = {"class":"uk.gov.gchq.gaffer.data.element.Edge","group":"RoadHasJunction","source":"M31","destination":"M32:2","directed":true,"matchedVertex":"DESTINATION","properties":{}};
            var edge3 = {"class":"uk.gov.gchq.gaffer.data.element.Edge","group":"RoadHasJunction","source":"M32","destination":"M32:2","directed":true,"matchedVertex":"DESTINATION","properties":{}};
            service.update([edge1, edge2, edge3]);
            var value = service.get();
            expect(value).toEqual(Object({ entities: [ ], edges: [ 
                Object({ class: 'uk.gov.gchq.gaffer.data.element.Edge', group: 'RoadHasJunction', source: 'M32', destination: 'M32:2', directed: true, matchedVertex: 'DESTINATION', properties: Object({ }) }),
                Object({ class: 'uk.gov.gchq.gaffer.data.element.Edge', group: 'RoadHasJunction', source: 'M31', destination: 'M32:2', directed: true, matchedVertex: 'DESTINATION', properties: Object({ }) })], other: [ ]}));
        });
    });
});