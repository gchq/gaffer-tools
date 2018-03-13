describe('The Schema group filter', function() {

    var schemaFilter;

    beforeEach(module('app'));

    beforeEach(inject(function(_schemaGroupFilterFilter_) {
        schemaFilter = _schemaGroupFilterFilter_;
    }));

    it('should return the input if it is null', function() {
        expect(schemaFilter(null, 'str')).toBeNull();
    });

    it('should return the input if it is undefined', function() {
        expect(schemaFilter(undefined, 'str')).not.toBeDefined();
    });

    it('should return the input if the search is undefined', function() {
        var data = {
            "group": {
                "description": "an element group"
            }
        };

        expect(schemaFilter(data, undefined)).toEqual(data);
    });

    it('should return the input if the search is null', function() {
        var data = {
            "group": {
                "description": "an element group"
            }
        };

        expect(schemaFilter(data, null)).toEqual(data);
    });

    it('should return items where the group matches the search string', function() {
        var data = {
            "anEdge": {
                "description": "an element which represents stuff"
            },
            "test": {
                "description": "a test for a filter"
            },
            "group": {
                "description": "an element group"
            }
        };

        expect(schemaFilter(data, "test")).toEqual({"test": { "description": "a test for a filter"}});
    });

    it('should match groups regardless of case', function() {
        var data = {
            "anEdge": {
                "description": "an element which represents stuff"
            },
            "test": {
                "description": "a test for a filter"
            },
            "group": {
                "description": "an element group"
            }
        };

        expect(schemaFilter(data, "edge")).toEqual({"anEdge": {"description": "an element which represents stuff"}});
    });

    it('should return items where the group matches the items description', function() {
        var data = {
            "anEdge": {
                "description": "an element which represents stuff"
            },
            "test": {
                "description": "a test for a filter"
            },
            "group": {
                "description": "an element group"
            }
        };

        expect(schemaFilter(data, "element")).toEqual({
            "anEdge": {"description": "an element which represents stuff"},
            "group": {"description": "an element group"}
        });
    });

    it('should handle scenarios where there is no description', function() {
        var data = {
            "anEdge": {},
            "test": {},
            "group": {}
        };

        expect(schemaFilter(data, "e")).toEqual({"anEdge": {}, "test": {}});
    });
});
