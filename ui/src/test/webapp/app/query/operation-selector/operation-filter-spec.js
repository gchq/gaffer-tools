describe('the operation filter', function() {

    var operationFilter;

    beforeEach(module('app'));

    beforeEach(inject(function(_operationFilterFilter_) {
        operationFilter = _operationFilterFilter_;
    }));

    it('should return all the operations if the search text is null', function() {
        expect(operationFilter([1, 2, 3], null)).toEqual([1, 2, 3]);
    });

    it('should return all the operations if the search is undefined', function() {
        expect(operationFilter([1, 2, 3], undefined)).toEqual([1, 2, 3]);
    });

    it('should return all the operations if the search is an empty string', function() {
        expect(operationFilter([1, 2, 3], "")).toEqual([1, 2, 3]);
    });

    it('should return all the operations whose formatted name matches the search terms', function() {
        var ops = [
            {
                formattedName: 'test',
                formattedDescription: 'an operation'
            },
            {
                formattedName: 'similar to test',
                formattedDescription: ''
            },
            {
                formattedName: 'unrelated',
                formattedDescription: 'thing that has nothing to do with the first two'
            }
        ];

        var expected = [ 
            {
                formattedName: 'test',
                formattedDescription: 'an operation'
            },
            {
                formattedName: 'similar to test',
                formattedDescription: ''
            }
        ]

        expect(operationFilter(ops, 'test')).toEqual(expected);
    });

    it('should return operations which contain all the words in the search query', function() {
        var ops = [
            {
                formattedName: 'test',
                formattedDescription: 'an operation'
            },
            {
                formattedName: 'similar to test',
                formattedDescription: ''
            },
            {
                formattedName: 'unrelated',
                formattedDescription: 'thing that has nothing to do with the first two'
            }
        ];

        var expected = [
            {
                formattedName: 'similar to test',
                formattedDescription: ''
            }
        ];

        expect(operationFilter(ops, 'similar test')).toEqual(expected);
    });

    it('should return an empty array if no operations match the search term', function() {
        var ops = [
            {
                formattedName: 'test',
                formattedDescription: 'an operation'
            },
            {
                formattedName: 'similar to test',
                formattedDescription: ''
            },
            {
                formattedName: 'unrelated',
                formattedDescription: 'thing that has nothing to do with the first two'
            }
        ];

        expect(operationFilter(ops, 'randomy random')).toEqual([]);
    });

    it('should not return operations which contain some words but don\'t match the search term', function() {
        var ops = [
            {
                formattedName: 'foo',
                formattedDescription: 'a foo operation'
            },
            {
                formattedName: 'bar',
                formattedDescription: ''
            },
            {
                formattedName: 'test',
                formattedDescription: 'a test operation'
            }
        ];

        var expected = [ 
            {
                formattedName: 'test',
                formattedDescription: 'a test operation'
            }
        ];

        expect(operationFilter(ops, 'test operation')).toEqual(expected);

    });

    it('should prioritise hits in the operation title', function() {
        var ops = [
            {
                formattedName: 'similar to test',
                formattedDescription: 'keyword in the description'
            },
            {
                formattedName: 'test keyword',
                formattedDescription: 'an operation'
            },
            {
                formattedName: 'unrelated',
                formattedDescription: 'thing that has nothing to do with the first two'
            }
        ];

        var expected = [
            {
                formattedName: 'test keyword',
                formattedDescription: 'an operation'
            },
            {
                formattedName: 'similar to test',
                formattedDescription: 'keyword in the description'
            },
        ]

        expect(operationFilter(ops, 'keyword')).toEqual(expected);
    });

});
