describe('The previous queries service', function() {
    var service;

    beforeEach(module('app'));

    beforeEach(inject(function(_previousQueries_) {
        service = _previousQueries_;
    }));

    beforeEach(function() {
        service.setQueries([]);
    })

    describe('previousQueries.addQuery()', function() {

        it('should add an operation chain to a query', function() {
            // when 
            service.addQuery('test');

            // then
            expect(service.getQueries()).toEqual(['test']);
        });

        it('should add the operation to the start of the array', function() {
            // given
            service.setQueries(['abc', 'def', 'ghi'])

            // when
            service.addQuery('jkl');

            // then
            expect(service.getQueries()).toEqual(['jkl', 'abc', 'def', 'ghi']);
        });

        it('should not allow the object to be edited by the caller, once added', function() {
            // given
            var operation = {
                operations: 'test'
            }
            service.setQueries([]);
            service.addQuery(operation);

            // when
            operation['name'] = 'mutable';

            // then
            expect(service.getQueries()[0].name).toBeUndefined();

        });
    });

    describe('previousQueries.getQueries()', function() {
        it('should not allow manipulation of the object outside the service', function() {
            // given
            service.setQueries([{
                name: 'thing'
            }]);

            var outsideScope = service.getQueries();

            // when
            outsideScope.push('test');

            // then
            expect(service.getQueries().length).toEqual(1);

        });
    });

    describe('previousQueries.setQueries()', function() {
        it('should not allow manipulation outside the service scope', function() {
            // given
            var operations = ['a', 'b', 'c']
            service.setQueries(operations);

            // when
            operations.push('d');

            // then
            expect(service.getQueries()).toEqual(['a', 'b', 'c'])

        });
    });
});
