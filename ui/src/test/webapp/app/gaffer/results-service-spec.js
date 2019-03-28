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
        it('should ignore duplicate values in other', function() {
            service.update(["Foo", "Bar", "Foo"]);
            var value = service.get();
            expect(value).toEqual({"entities": [], "edges": [], "other": [Object({ class: 'String', value: 'Foo' }), Object({ class: 'String', value: 'Bar' })]});
        });
    });
});