describe('The common service', function() {
    var service;

    beforeEach(module('app'));

    beforeEach(inject(function(_common_) {
        service = _common_;
    }));

    describe('common.endsWith()', function() {
        it('should return true if a string ends with the suffix', function() {
            expect(service.endsWith('The truth', 'th')).toBeTruthy();
        });

        it('should return false if the string does not end with the suffix', function() {
            expect(service.endsWith('The truth', 'ru')).toBeFalsy();
        });

        it('should be case sensitive', function() {
            expect(service.endsWith('The truth', 'TH')).toBeFalsy();
        });
    });

    describe('common.startsWith()', function() {
        it('should return true if a string starts with the prefix', function() {
            expect(service.startsWith('The truth', 'The')).toBeTruthy();
        });

        it('should return false if a string start with the prefix', function() {
            expect(service.startsWith('The truth', 'he')).toBeFalsy();
        });

        it('should be case sensitive', function() {
            expect(service.startsWith('The truth', 'THE')).toBeFalsy();
        });
    });

    describe('common.parseVertex()', function() {
        it('should return strings with quotes around them', function() {
            expect(service.parseVertex('test')).toEqual('"test"');
        });

        it('should return objects as a string representation of the objects', function() {
            var vertex = {'uk.gov.gchq.gaffer.types.TypeSubTypeValue': {'type': 'T', 'subType': 'ST', 'value': 'V'}};
            var expected = JSON.stringify(vertex);

            expect(service.parseVertex(vertex)).toEqual(expected);
        });

        it('should wrap numbers in strings', function() {
            expect(service.parseVertex(1)).toEqual('1');
        });

        it('should return null as null', function() {
            expect(service.parseVertex(null)).toEqual(null);
        });

        it('should return undefined as undefined', function() {
            expect(service.parseVertex(undefined)).toEqual(undefined);
        });
    });

    describe('common.parseUrl()', function() {
        it('should append http:// to the url if it doesn\'t exist', function() {
            expect(service.parseUrl('localhost')).toEqual('http://localhost');
        });

        it('should not append http:// to the url if it starts with http:// already', function() {
            expect(service.parseUrl('http://42.42.42.42:1234')).toEqual('http://42.42.42.42:1234');
        });

        it('should not change https:// to http:// in a url', function() {
            expect(service.parseUrl('https://some.random.ip.address')).toEqual('https://some.random.ip.address');
        });
    });

    describe('common.objectContainsValue()', function() {
        it('should return true if an object contains the field specified', function() {
            var obj = {'field': false}
            expect(service.objectContainsValue(obj, 'field')).toBeTruthy();
        });

        it('should return false if an object does not contain the field specified', function() {
            var obj = {'field': false};
            expect(service.objectContainsValue(obj, 'unknown')).toBeFalsy();
        });
    });

    describe('common.arrayContainsValue()', function() {
        it('should return true if an array contains a given string', function() {
            var arr = ['this', 'is', 'a', 'test'];
            expect(service.arrayContainsValue(arr, 'test')).toBeTruthy();
        });

        it('should return true if an array contains a number', function() {
            var arr = [1, 2, 3, 4];
            expect(service.arrayContainsValue(arr, 3)).toBeTruthy();
        });

        it('should return false if a value is not in the array', function() {
            var arr = ['this', 'is', 'another', 'test'];
            expect(service.arrayContainsValue(arr, 'a')).toBeFalsy();
        });
    });

    describe('common.arrayContainsObject()', function() {
        it('should return true if an object is contained within array', function() {
            var obj = {'field': { 'level': { 'anotherLevel': true, 'differentField': 12}}}
            var arr = [ obj, {'field': true}, undefined, null];

            expect(service.arrayContainsObject(arr, obj)).toBeTruthy();
        });

        it('should return true if the object is a copy of a given object', function() {
            var obj = {'field': { 'level': { 'anotherLevel': true, 'differentField': 12}}}
            var matching = {'field': { 'level': { 'anotherLevel': true, 'differentField': 12}}}
            var arr = [ obj, {'field': true}, undefined, null];

            expect(service.arrayContainsObject(arr, matching)).toBeTruthy();
        })

        it('should return false if the array does not contain an object', function() {
            var obj = {'field': { 'level': { 'anotherLevel': true, 'differentField': 12}}}
            var nonMatching = {'field': { 'level': { 'anotherLevel': false, 'differentField': 12}}}
            var arr = [ obj, {'field': true}, undefined, null];

            expect(service.arrayContainsObject(arr, nonMatching)).toBeFalsy();
        });
    });

    describe('common.arrayContainsObjectWithValue()', function() {
        it('should return true if the array contains an object with a given property matching a given value', function() {
            var obj = {'field': true, 'anotherField': 2, 'test': 'test'};
            var arr = [ {'field': true}, undefined, null, 1, 'test', true, false, obj];

            expect(service.arrayContainsObjectWithValue(arr, 'test', 'test')).toBeTruthy();
        });

        it('should return false if the value is different to the value given', function() {
            var obj = {'field': true, 'anotherField': 2, 'test': 'test'};
            var arr = [ {'field': true}, undefined, null, 1, 'test', true, false, obj];

            expect(service.arrayContainsObjectWithValue(arr, 'test', 'value')).toBeFalsy();
        });

        it('should return false if the value if different to the key does not exist in any of the objects', function() {
            var obj = {'field': true, 'anotherField': 2, 'test': 'test'};
            var arr = [ {'field': true}, undefined, null, 1, 'test', true, false, obj];

            expect(service.arrayContainsObjectWithValue(arr, 'madeUpField', 'test')).toBeFalsy();
        });
    })

    describe('common.pushValueIfUnique()', function() {
        it('should add value to array if it does not already exist', function() {
            var arr = ['this', 'is', 'a'];
            service.pushValueIfUnique('test', arr);
            expect(arr).toEqual(['this', 'is', 'a', 'test']);
        });

        it('should not add value to array if it already exists', function() {
            var arr = ['this', 'is', 'a', 'test'];
            service.pushValueIfUnique('test', arr);
            expect(arr).toEqual(['this', 'is', 'a', 'test']);
        });

        it('should not add value to array if the array is undefined', function() {
            var arr = undefined;
            service.pushValueIfUnique('test', arr);
            expect(arr).toEqual(undefined);
        });
    })

    describe('common.pushValuesIfUnique()', function() {
        it('should add values to array if they do not already exist', function() {
            var arr = ['this', 'is', 'a'];
            service.pushValuesIfUnique(['is', 'a', 'test'], arr);
            expect(arr).toEqual(['this', 'is', 'a', 'test']);
        });

        it('should not add values to array if the array is undefined', function() {
            var arr = undefined;
            service.pushValuesIfUnique(['test'], arr);
            expect(arr).toEqual(undefined);
        });

        it('should not add values to array if the values are undefined', function() {
            var arr = ['this', 'is', 'a'];
            service.pushValuesIfUnique(undefined, arr);
            expect(arr).toEqual(['this', 'is', 'a']);
        });
    })

    describe('common.pushObjectIfUnique()', function() {
        it('should add object to array if it does not already exist', function() {
            var obj = {'field': { 'level': { 'anotherLevel': true, 'differentField': 12}}}
            var arr = [ {'field': true}, undefined, null];
            service.pushObjectIfUnique(obj, arr);
            expect(arr).toEqual([ {'field': true}, undefined, null, obj]);
        });

        it('should not add object to array if it already exists', function() {
            var obj = {'field': { 'level': { 'anotherLevel': true, 'differentField': 12}}}
            var arr = [ {'field': true}, obj, undefined, null];
            service.pushObjectIfUnique(obj, arr);
            expect(arr).toEqual([ {'field': true}, obj, undefined, null]);
        });

        it('should not add object to array if the array is undefined', function() {
            var obj = {'field': { 'level': { 'anotherLevel': true, 'differentField': 12}}}
            var arr = undefined;
            service.pushObjectIfUnique(obj, arr);
            expect(arr).toEqual(undefined);
        });
    })

    describe('common.pushObjectsIfUnique()', function() {
        it('should add objects to array if it does not already exist', function() {
            var obj1 = {'field': { 'level': { 'anotherLevel': true, 'differentField': 12}}}
            var obj2 = {'field': { 'level': { 'anotherLevel': true, 'differentField': 13}}}
            var arr = [ {'field': true}, undefined, null];
            service.pushObjectsIfUnique([obj1, obj2], arr);
            expect(arr).toEqual([ {'field': true}, undefined, null, obj1, obj2]);
        });

        it('should not add objects to array if the array is undefined', function() {
            var obj1 = {'field': { 'level': { 'anotherLevel': true, 'differentField': 12}}}
            var obj2 = {'field': { 'level': { 'anotherLevel': true, 'differentField': 13}}}
            var arr = undefined;
            service.pushObjectsIfUnique([obj1, obj2], arr);
            expect(arr).toEqual(undefined);
        });

        it('should not add objects to array if the objects array is undefined', function() {
            var arr = [ {'field': true}, undefined, null];
            service.pushObjectsIfUnique(undefined, arr);
            expect(arr).toEqual([ {'field': true}, undefined, null]);
        });
    })

    describe('common.concatUniqueValues()', function() {
        it('should concat 2 arrays and deduplicate the results', function() {
            var arr1 = ['this', 'is', 'a'];
            var arr2 = ['is', 'a', 'test'];
            var result = service.concatUniqueValues(arr1, arr2);
            expect(arr1).toEqual(['this', 'is', 'a']);
            expect(arr2).toEqual(['is', 'a', 'test']);
            expect(result).toEqual(['this', 'is', 'a', 'test']);
        });
    })

    describe('common.concatUniqueObjects()', function() {
        it('should concat 2 arrays and deduplicate the results', function() {
            var arr1 = [{'field': 1},{'field': 2}];
            var arr2 = [{'field': 2}, {'field': 3}];
            var result = service.concatUniqueObjects(arr1, arr2);
            expect(arr1).toEqual([{'field': 1},{'field': 2}]);
            expect(arr2).toEqual([{'field': 2}, {'field': 3}]);
            expect(result).toEqual([{'field': 1}, {'field': 2}, {'field': 3}]);
        });
    })
});
