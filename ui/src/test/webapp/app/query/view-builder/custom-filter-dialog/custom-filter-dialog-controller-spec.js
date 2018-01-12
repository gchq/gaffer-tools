describe('The Custom Filter Dialog Controller', function() {

    var scope, $controller, $q;
    var ctrl;
    var edgeProperties, entityProperties, schema;

    var createController = function() {
        ctrl = $controller('CustomFilterDialogController', {$scope: scope});
    }

    beforeEach(module('app'));

    beforeEach(module(function($provide) {
        $provide.factory('config', function($q) {
            var get = function() {
                return $q.when({});
            }

            return {
                get: get
            }
        });

        $provide.factory('schema', function($q) {
            return {
                get: function() {
                    return $q.when(schema);
                },
                getEdgeProperties: function() {
                    return edgeProperties;
                },
                getEntityProperties: function() {
                    return entityProperties;
                }
            }
        });
    }));

    beforeEach(inject(function(_$rootScope_, _$controller_, _$q_) {
        $q = _$q_;
        $controller = _$controller_;
        scope = _$rootScope_.$new();
    }));

    describe('on startup', function() {

        beforeEach(function() {
            createController();
        })
        it('should exist', function() {
            expect(ctrl).toBeDefined();
        });

        it('should set PreAggregation to false by default', function() {
            expect(scope.filter.preAggregation).toBeFalsy();
        });

        it('should set editMode to false by default', function() {
            expect(scope.editMode).toBeFalsy();
        });
    });

    describe('When a filter is injected into the scope', function() {
        var functions;

        beforeEach(inject(function(_functions_) {
            functions = _functions_;
        }));

        beforeEach(function() {
            spyOn(functions, 'getFunctionParameters').and.callFake(function(unusedName, callback) {
                callback(['value', 'orEqualTo']);
            });
        });

        beforeEach(function() {
            scope.filterForEdit = {
                someUnrelatedField: "notRelevant",
                preAggregation: true,
                property: "aProperty",
                predicate: "a.koryphe.predicate.Class",
                parameters: {
                    "value": 42,
                    "orEqualTo": false,
                    "aStringProperty": "test",
                    "anObjectProperty": {"java.lang.Long": 123}
                }
            }
        });

        beforeEach(function() {
            createController();
        });

        it('should set the preAggregation field', function() {
            expect(scope.filter.preAggregation).toBeTruthy();
        });

        it('should set the filter predicate', function() {
            expect(scope.filter.predicate).toBeDefined();
            expect(scope.filter.predicate).toEqual('a.koryphe.predicate.Class');
        });

        it('should add all the stringified parameters', function() {
            var params = scope.filter.parameters;
            expect(params.value).toEqual('42');
            expect(params.aStringProperty).toEqual('test');
            expect(params.anObjectProperty).toEqual('{"java.lang.Long":123}');
            expect(params.orEqualTo).toEqual('false');
        });

        it('should get the parameters', function() {
            expect(functions.getFunctionParameters).toHaveBeenCalledTimes(1);
            expect(scope.filter.availableFunctionParameters).toEqual(['value', 'orEqualTo']);
        });

        it('should set editMode to true', function() {
            expect(scope.editMode).toBeTruthy();
        });
    });

    describe('$scope.search', function() {
        beforeEach(function() {
            scope.availablePredicates = [ 'function1', 'function2', 'predicate', 'anotherPredicate' ];
        });

        beforeEach(function() {
            createController();
        });

        it('should return all the predicates if the input is undefined', function() {
            expect(scope.search(undefined)).toEqual(scope.availablePredicates);
        });

        it('should return all the predicates if the input is null', function() {
            expect(scope.search(null)).toEqual(scope.availablePredicates);
        });

        it('should return all the predicates if the input is an empty string', function() {
            expect(scope.search('')).toEqual(scope.availablePredicates);
        });

        it('should return all values which start with the input when populated', function() {
            expect(scope.search('func')).toEqual(['function1', 'function2'])
        });

        it('should return all values which contain the input string', function() {
            expect(scope.search('edic')).toEqual(['predicate', 'anotherPredicate']);
        });
    });

    describe('$scope.createFriendlyName', function() {
        beforeEach(function() {
            createController();
        });

        it('should shorten a java class down to the class name', function() {
            expect(scope.createFriendlyName('java.lang.Long')).toEqual('Long');
        });
    });

    describe('$scope.getProperties', function() {

        var schema;

        beforeEach(inject(function(_schema_) {
            schema = _schema_;
        }))

        beforeEach(function() {
            spyOn(schema, 'getEntityProperties').and.returnValue(['prop1', 'prop2']);
            spyOn(schema, 'getEdgeProperties').and.returnValue(['prop3', 'prop4']);
        });

        beforeEach(function() {
            createController();
        });

        it('should call schema.getEntityProperties() if the elementType is an entity', function() {
            scope.elementType = 'entity';
            expect(scope.getProperties()).toEqual(['prop1', 'prop2']);
            expect(schema.getEntityProperties).toHaveBeenCalledTimes(1);
        });
    })


});


