describe('The Selected Elements Component', function() {

    beforeEach(module('app'));

    var $componentController
    var ctrl;

    var results;

    var testModel;

    beforeEach(function() {
        testModel = {
            edges: [],
            entities: []
        }
    });

    beforeEach(inject(function(_$componentController_, _results_) {
        $componentController = _$componentController_;
        results = _results_;
    }));

    beforeEach(function() {
        ctrl = $componentController('selectedElements', null, {model: testModel})
    });

    it('should exist', function() {
        var ctrl = $componentController('selectedElements');
        expect(ctrl).toBeDefined()
    });

    describe('ctrl.$onInit()', function() {

        it('should error if no model is injected into the component', function() {
            var ctrl = $componentController('selectedElements');
            expect(ctrl.$onInit).toThrow();
        });

        it('should subscribe to incoming results', inject(function(events) {
            spyOn(events, 'subscribe');

            ctrl.$onInit();

            expect(events.subscribe).toHaveBeenCalledWith('incomingResults', jasmine.any(Function));
        }));

        it('should process the results', function() {
            spyOn(results, 'get').and.returnValue({
                entities: [
                    {
                        "vertex": "foo",
                        "properties": {
                            "bar": true
                        }
                    }
                ],
                edges: []
            });

            ctrl.$onInit();

            expect(ctrl.processedResults.entities).toEqual({
                '"foo"': [
                    {
                        "vertex": "foo",
                        "properties": {
                            "bar": true
                        }
                    } 
                ]
            
            });
        });

        it('should create EdgeIds from edges', function() {
            spyOn(results, 'get').and.returnValue({
                entities: [],
                edges: [
                    {
                        source: "foo",
                        destination: "bar",
                        group: 'myEdge',
                        directed: true,
                        properties: {
                            "test": true
                        }
                    }
                ]
            });

            ctrl.$onInit();


            var expectedEdgeId ='"foo"\0"bar"\0true\0myEdge';

            expect(ctrl.processedResults.edges[expectedEdgeId]).toEqual([
                {
                    source: "foo",
                    destination: "bar",
                    group: 'myEdge',
                    directed: true,
                    properties: {
                        "test": true
                    }
                }
            ]);
        });

        it('should return the short value if the value is not a time property', function() {

            spyOn(results, 'get').and.returnValue({
                entities: [],
                edges: [
                    {
                        source: "foo",
                        destination: "bar",
                        directed: false,
                        group: "test",
                        properties: {
                            "intProp": 4,
                            "longProp": { "java.lang.Long": 32 }
                        }
                    }
                ]
            });

            ctrl.$onInit();

            expect(ctrl.processedResults.edges['"foo"\0"bar"\0false\0test']).toEqual([
                {
                    source: "foo",
                    destination: "bar",
                    directed: false,
                    group: "test",
                    properties: {
                        "intProp": 4,
                        "longProp": 32
                    }
                }
            ]);
        });

        it('should convert date properties', inject(function(time) {

            spyOn(time, 'getDateString').and.returnValue('25/12/2018');
            spyOn(time, 'isTimeProperty').and.returnValue(true);

            spyOn(results, 'get').and.returnValue({
                entities: [
                    {
                        vertex: "test",
                        group: "test",
                        properties: {
                            dateProp: {
                                "java.lang.Long": 1234567890
                            }
                        }
                    }
                
                ],
                edges: []
            });

            ctrl.$onInit();

            expect(time.getDateString).toHaveBeenCalledWith("dateProp", 1234567890)
            expect(ctrl.processedResults.entities['"test"'][0].properties.dateProp).toEqual("25/12/2018");
        }));

    });

    describe('ctrl.resolveVertex()', function() {

        var types;

        beforeEach(inject(function(_types_) {
            types = _types_;
        }));

        beforeEach(function() {
            spyOn(types, 'getShortValue').and.stub();
        });

        it('should call types.getShortValue() with the parsed string', function() {
            ctrl.resolveVertex('"test"');
            expect(types.getShortValue).toHaveBeenCalledWith("test");
        });

        it('should call types.getShortValue with a parsed number', function() {
            ctrl.resolveVertex("2");
            expect(types.getShortValue).toHaveBeenCalledWith(2);
        });

        it('should call types.getShortValue() with an object', function() {
            ctrl.resolveVertex('{"test": true}');
            expect(types.getShortValue).toHaveBeenCalledWith({test: true});
        });
    });

    describe('after "incomingResults" event', function() {
        var events;

        beforeEach(inject(function(_events_) {
            events = _events_;
        }));

        beforeEach(function() {
            ctrl.$onInit();
        });

        it('should process the results', function() {
            events.broadcast("incomingResults", [{
                entities: [
                    {
                        "vertex": "foo",
                        "properties": {
                            "bar": true
                        }
                    }
                ],
                edges: []
            }]);

            expect(ctrl.processedResults.entities).toEqual({
                '"foo"': [
                    {
                        "vertex": "foo",
                        "properties": {
                            "bar": true
                        }
                    } 
                ]
            
            });
        });

        it('should create EdgeIds from edges', function() {
            events.broadcast("incomingResults", [{
                entities: [],
                edges: [
                    {
                        source: "foo",
                        destination: "bar",
                        group: 'myEdge',
                        directed: true,
                        properties: {
                            "test": true
                        }
                    }
                ]
            }]);

            var expectedEdgeId ='"foo"\0"bar"\0true\0myEdge';

            expect(ctrl.processedResults.edges[expectedEdgeId]).toEqual([
                {
                    source: "foo",
                    destination: "bar",
                    group: 'myEdge',
                    directed: true,
                    properties: {
                        "test": true
                    }
                }
            ]);
        })

        it('should convert numerical object properties', function() {
            events.broadcast("incomingResults", [{
                entities: [],
                edges: [
                    {
                        source: "foo",
                        destination: "bar",
                        directed: false,
                        group: "test",
                        properties: {
                            "intProp": 4,
                            "longProp": { "java.lang.Long": 32 }
                        }
                    }
                ]
            }]);

            expect(ctrl.processedResults.edges['"foo"\0"bar"\0false\0test']).toEqual([
                {
                    source: "foo",
                    destination: "bar",
                    directed: false,
                    group: "test",
                    properties: {
                        "intProp": 4,
                        "longProp": 32
                    }
                }
            ]);
        });

        it('should convert date properties', inject(function(time) {

            spyOn(time, 'getDateString').and.returnValue('25/12/2018');
            spyOn(time, 'isTimeProperty').and.returnValue(true);

            events.broadcast("incomingResults", [{
                entities: [
                    {
                        vertex: "test",
                        group: "test",
                        properties: {
                            dateProp: {
                                "java.lang.Long": 1234567890
                            }
                        }
                    }
                
                ],
                edges: []
            }]);

            expect(time.getDateString).toHaveBeenCalledWith("dateProp", 1234567890)
            expect(ctrl.processedResults.entities['"test"'][0].properties.dateProp).toEqual("25/12/2018");
        }));
    });

    describe('ctrl.resolveEdge()', function() {
        it('should extract a string source and destination from an edge id', function() {
            expect(ctrl.resolveEdge('"source"\0"dest"\0true\0myEdgeGroup')).toEqual("source to dest");
        });

        it('should extract a number source and destination from an edge id', function() {
            expect(ctrl.resolveEdge('1\0' + 2 + '\0true\0myEdgeGroup')).toEqual("1 to 2");
        });

        it('should extract an object source and destination from an edge id', function() {
            var edgeId = '{ "TypeSubTypeValue": {"type": "t1", "subType": "st1", "value": "v1"}}\0{ "TypeSubTypeValue": {"type": "t2", "subType": "st2", "value": "v2"}}\0true\0unusedEdgeGroup';
            expect(ctrl.resolveEdge(edgeId)).toEqual("t1,st1,v1 to t2,st2,v2");
        });
    });
});
