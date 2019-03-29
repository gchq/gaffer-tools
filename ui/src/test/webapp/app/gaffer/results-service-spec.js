describe('The results service', function() {

    var service;

    beforeEach(module('app'));

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
        it('should ignore duplicate values in entities', function() {
            // For ease of reading, both are equal.
            var entity1 = {"class":"uk.gov.gchq.gaffer.data.element.Entity","group":"Cardinality","vertex":"M32:M4 (19)","properties":{"hllp":{"com.clearspring.analytics.stream.cardinality.HyperLogLogPlus":{"hyperLogLogPlus":{"hyperLogLogPlusSketchBytes":"","cardinality":3}}},"count":{"java.lang.Long":432},"edgeGroup":{"java.util.TreeSet":["JunctionLocatedAt","RoadHasJunction","RoadUse"]}}};
            var entity2 = {"class":"uk.gov.gchq.gaffer.data.element.Entity","group":"Cardinality","vertex":"M32:M4 (19)","properties":{"hllp":{"com.clearspring.analytics.stream.cardinality.HyperLogLogPlus":{"hyperLogLogPlus":{"hyperLogLogPlusSketchBytes":"","cardinality":3}}},"count":{"java.lang.Long":432},"edgeGroup":{"java.util.TreeSet":["JunctionLocatedAt","RoadHasJunction","RoadUse"]}}};
            service.update([entity1, entity2]);
            var value = service.get();
            expect(value).toEqual(Object({
                entities: [ {"class":"uk.gov.gchq.gaffer.data.element.Entity","group":"Cardinality","vertex":"M32:M4 (19)","properties":{"hllp":{"com.clearspring.analytics.stream.cardinality.HyperLogLogPlus":{"hyperLogLogPlus":{"hyperLogLogPlusSketchBytes":"","cardinality":3}}},"count":{"java.lang.Long":432},"edgeGroup":{"java.util.TreeSet":["JunctionLocatedAt","RoadHasJunction","RoadUse"]}}} ], edges: [ ], other: [ ] }));
        });

        it('should ignore duplicate values in edges', function() {
            // For ease of reading, edge 1 & 3 are duplicates. Differing by Source.
            var edge1 = {"class":"uk.gov.gchq.gaffer.data.element.Edge","group":"RoadHasJunction","source":"M32","destination":"M32:2","directed":true,"matchedVertex":"DESTINATION","properties":{}};
            var edge2 = {"class":"uk.gov.gchq.gaffer.data.element.Edge","group":"RoadHasJunction","source":"M31","destination":"M32:2","directed":true,"matchedVertex":"DESTINATION","properties":{}};
            var edge3 = {"class":"uk.gov.gchq.gaffer.data.element.Edge","group":"RoadHasJunction","source":"M32","destination":"M32:2","directed":true,"matchedVertex":"DESTINATION","properties":{}};
            service.update([edge1, edge2, edge3]);
            var value = service.get();
            expect(value).toEqual(Object({ entities: [ ], edges: [ 
                Object({ class: 'uk.gov.gchq.gaffer.data.element.Edge', group: 'RoadHasJunction', source: 'M32', destination: 'M32:2', directed: true, matchedVertex: 'DESTINATION', properties: Object({ }) }),
                Object({ class: 'uk.gov.gchq.gaffer.data.element.Edge', group: 'RoadHasJunction', source: 'M31', destination: 'M32:2', directed: true, matchedVertex: 'DESTINATION', properties: Object({ }) })], other: [ ]}));
        });

        it('should ignore duplicate values in other', function() {
            service.update(['Foo', 'Bar', 'Foo']);
            var value = service.get();
            expect(value).toEqual(Object({ entities: [ ], edges: [ ], other: [Object({ class: 'String', value: 'Foo' }), Object({ class: 'String', value: 'Bar' })]}));
        });
    });
});