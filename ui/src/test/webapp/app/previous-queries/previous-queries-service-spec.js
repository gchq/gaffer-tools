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

    describe('previousQueries.updateQuery()', function() {
        it('should update existing query with a new query', function() {
            // given
            var existingQueries = {
                name: 'Operation Chain',
                operations: [{
                    selectedOperation: { name: 'An Existing Query', description: 'blah' }
                }]
            };
            service.addQuery(existingQueries);

            // when
            var updatedQuery = {
                name: 'New Query', description: 'some description'
            };
            service.updateQuery(0, 0, updatedQuery);

            // then
            var expected = [{
                name: 'Operation Chain',
                operations: [{
                    selectedOperation: { name: 'New Query', description: 'some description' }
                }]
            }];
            expect(service.getQueries()).toEqual(expected);
        });

        it('should update the 2nd Operation when operationChainIndex 1 (2nd) and operationIndex is 0 (first)', function() {
            // given
            var queries = [{
                name: 'Operation Chain 1',
                operations: [{
                    selectedOperation: { name: 'Existing Query 1', description: 'apples' }
                }]
            },{
                name: 'Operation Chain 2',
                operations: [{
                    selectedOperation: { name: 'Existing Query 2', description: 'bananas' }
                }]
            }];
            service.setQueries(queries);

            // when
            var updatedQuery = {
                name: 'New Query', description: 'a new description'
            };
            service.updateQuery(1, 0, updatedQuery);

            // then
            var expected = [{
                    name: 'Operation Chain 1',
                    operations: [{ selectedOperation: { name: 'Existing Query 1', description: 'apples' } }]
                }, {
                    name: 'Operation Chain 2',
                    operations: [{ selectedOperation: { name: 'New Query', description: 'a new description' } }],
            }];
            expect(service.getQueries()).toEqual(expected);
        });

        it('should update the 1st Operation Chain when operationChainIndex is 0 (1st) and operationIndex is 0 (1st)', function() {
            // given
            var queries = [{
                name: 'Operation Chain 1',
                operations: [{
                    selectedOperation: { name: 'Existing Operation 1', description: 'apples' }
                }]
            },{
                name: 'Operation Chain 2',
                operations: [{
                    selectedOperation: { name: 'Existing Operation 2', description: 'bananas' }
                }]
            }];
            service.setQueries(queries);

            // when
            var updatedQuery = {
                name: 'New Name', description: 'new description'
            };
            service.updateQuery(0, 0, updatedQuery);

            // then
            var expected = [{
                    name: 'Operation Chain 1',
                    operations: [{ selectedOperation: { name: 'New Name', description: 'new description' } }]
                }, {
                    name: 'Operation Chain 2',
                    operations: [{ selectedOperation: { name: 'Existing Operation 2', description: 'bananas' } }],
            }];
            expect(service.getQueries()).toEqual(expected);
        });

        it('should update the 2nd Operation in an Operation Chain when operationIndex is 1 (2nd)', function() {
            // given
            var queries = [{
                name: 'Operation Chain 1',
                operations: [
                    { selectedOperation: { name: 'Existing Operation 1', description: 'apples' } },
                    { selectedOperation: { name: 'Existing Operation 2', description: 'pears' } }
                ]
            }];
            service.setQueries(queries);

            // when
            var updatedQuery = {
                name: 'New Operation Name', description: 'new description'
            };
            service.updateQuery(0, 1, updatedQuery);

            // then
            var expected = [{
                name: 'Operation Chain 1',
                operations: [
                    { selectedOperation: { name: 'Existing Operation 1', description: 'apples' } },
                    { selectedOperation: { name: 'New Operation Name', description: 'new description' } }
                ]
            }];
            expect(service.getQueries()).toEqual(expected);
        });

        it('should update the 1st Operation in an Operation Chain when operationIndex is 0 (1st)', function() {
            // given
            var queries = [{
                name: 'Operation Chain 1',
                operations: [
                    { selectedOperation: { name: 'Existing Operation 1', description: 'apples' } },
                    { selectedOperation: { name: 'Existing Operation 2', description: 'pears' } }
                ]
            }];
            service.setQueries(queries);

            // when
            var updatedQuery = {
                name: 'New Operation Name', description: 'some new description'
            };
            service.updateQuery(0, 0, updatedQuery);

            // then
            var expected = [{
                name: 'Operation Chain 1',
                operations: [
                    { selectedOperation: { name: 'New Operation Name', description: 'some new description' } },
                    { selectedOperation: { name: 'Existing Operation 2', description: 'pears' } }
                ]
            }];
            expect(service.getQueries()).toEqual(expected);
        });
    });
});
