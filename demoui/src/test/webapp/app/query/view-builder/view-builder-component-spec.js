describe('The View Builder Component', function() {
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
                    return $q.when({});
                },
                getEdgeProperties: function(str) {
                    return undefined;
                },
                getEntityProperties: function(str) {
                    return undefined;
                }
            }
        });
    }));

    describe('The Controller', function() {
        var $componentController;
        var scope;

        beforeEach(inject(function(_$componentController_, _$rootScope_) {
            $componentController = _$componentController_;
            scope = _$rootScope_.$new();
        }));

        it('should exist', function() {
            var ctrl = $componentController('viewBuilder');
            expect(ctrl).toBeDefined();
        });

        beforeEach(function() {
            ctrl = $componentController('viewBuilder', {$scope: scope}, {model: { viewEdges: [], viewEntities: [], entityFilters: {}, edgeFilters: {}}});
        });

        describe('ctrl.$onInit()', function() {
            var schema;
            var $q;
            var toReturn = {};

            beforeEach(inject(function(_schema_, _$q_) {
                schema = _schema_;
                $q = _$q_;
            }));

            beforeEach(function() {
                spyOn(schema, 'get').and.callFake(function() {
                    return $q.when(toReturn);
                })
            });

            it('should make a request to the schema service to ensure the schema is loaded', function() {
                ctrl.$onInit();
                expect(schema.get).toHaveBeenCalled();
            });

            it('should set the schema edges in the controller', function() {
                toReturn = {"edges": "my edge values" };
                ctrl.$onInit();
                scope.$digest();
                expect(ctrl.schemaEdges).toEqual("my edge values");
            });

            it('should set the schema entities in the controller', function() {
                toReturn = {"entities": "my entity values" };
                ctrl.$onInit();
                scope.$digest();
                expect(ctrl.schemaEntities).toEqual("my entity values");
            });
        });

        describe('ctrl.noMore()', function() {
            var schema;
            var edgesWithProperties = [];
            var entitiesWithProperties = [];

            beforeEach(inject(function(_schema_) {
                schema = _schema_;
            }));

            beforeEach(function() {
                spyOn(schema, 'getEdgeProperties').and.callFake(function(group) {
                    if (edgesWithProperties.indexOf(group) !== -1) {
                        return {"prop1": "string"};
                    }
                    return undefined;
                });

                spyOn(schema, 'getEntityProperties').and.callFake(function(group) {
                    if (entitiesWithProperties.indexOf(group) !== -1) {
                        return {"prop1": "string"};
                    }
                    return undefined;
                });
            });

            describe('when the input is an edge', function() {

                beforeEach(function() {
                    ctrl.model.viewEdges = [ 'edge1', 'edge2', 'edge3'];
                    edgesWithProperties = ctrl.model.viewEdges;
                });

                it('should return true if it is the last edge in the view with properties', function() {
                    expect(ctrl.noMore('edge3')).toBeTruthy();
                });

                it('should return true if there are more edges but they don\'t have properties', function() {
                    edgesWithProperties = ['edge1', 'edge2'];
                    expect(ctrl.noMore('edge2')).toBeTruthy();
                });

                it('should return false if it is not the last edge with properties', function() {
                    expect(ctrl.noMore('edge2')).toBeFalsy();
                });
            });

            describe('when the input is an entity', function() {

                beforeEach(function() {
                    ctrl.model.viewEntities = ['entity1', 'entity2', 'entity3']
                    entitiesWithProperties = ctrl.model.viewEntities;
                    ctrl.model.viewEdges = ['edge1'];
                    edgesWithProperties = [];
                });

                it('should return false if there are edges with properties', function() {
                    edgesWithProperties = ctrl.model.viewEdges;
                    expect(ctrl.noMore('entity3')).toBeFalsy();
                });

                it('should return true if there are more edges but they don\'t have properties and there are no more entities', function() {
                    expect(ctrl.noMore('entity3')).toBeTruthy();
                });

                it('should return false if there are more entities with properties', function() {
                    expect(ctrl.noMore('entity2')).toBeFalsy();
                });

                it('should return true if there are more entities but they don\'t have properties', function() {
                    entitiesWithProperties = ['entity1'];
                    expect(ctrl.noMore('entity1')).toBeTruthy();
                });
            });
        });

        describe('ctrl.createViewElementsLabel()', function() {

            it('should return the list of element groups separated by a comma', function() {
                var elements = ['group1', 'group2', 'group3']
                expect(ctrl.createViewElementsLabel(elements)).toEqual('group1, group2, group3');
            });

            it('should return the first item if there is only one', function() {
                var elements = ['test'];
                expect(ctrl.createViewElementsLabel(elements)).toEqual('test');
            });

            it('should display the initial message if the elements are undefined', function() {
                expect(ctrl.createViewElementsLabel(undefined, 'edges')).toEqual('Only include these edges');
            });

            it('should display the initial message if the elements are an empty array', function() {
                expect(ctrl.createViewElementsLabel([], 'entities')).toEqual('Only include these entities');
            });

            it('should display the initial message if the elements are null', function() {
                expect(ctrl.createViewElementsLabel(null, 'edges')).toEqual('Only include these edges');
            });

            it('should throw an exception if the elements and elementType are undefined', function() {
                expect(function() { ctrl.createViewElementsLabel(undefined, undefined)}).toThrow('Cannot create label without either the elements or element type')
            });
        });

        describe('ctrl.createFilterLabel()', function() {
            var basicFilter;
            var types;

            beforeEach(inject(function(_types_) {
                types = _types_;
            }));

            beforeEach(function() {
                basicFilter = {
                    property: 'prop1',
                    predicate: 'a.predicate.called.IsMoreThan',
                    parameters: {
                        value: {
                            valueClass: 'java.lang.Long',
                            parts: {
                                undefined: 10
                            }
                        },
                        orEqualTo: {
                            valueClass: 'java.lang.Boolean',
                            parts: {
                                undefined: false
                            }
                        }
                    },
                    preAggregation: true
                };
            });

            beforeEach(function() {
                spyOn(types, 'getShortValue').and.callFake(function(value) {
                    if (angular.isObject(value)) {
                        return value[Object.keys(value)[0]];
                    }
                    return value;
                })
            });

            it('should start with the property name', function() {
                expect(ctrl.createFilterLabel(basicFilter).indexOf('prop1')).toEqual(0);
            });

            it('should then state the class name of the predicate', function() {
                expect(ctrl.createFilterLabel(basicFilter).indexOf('IsMoreThan')).toEqual(6);
            });

            it('should then summarise the predicate fields', function() {
                expect(ctrl.createFilterLabel(basicFilter)).toContain('value=10');
                expect(ctrl.createFilterLabel(basicFilter)).toContain('orEqualTo=false');
            });

            it('should end with a statement indicating when the filter should be applied', function() {
                expect(ctrl.createFilterLabel(basicFilter)).toMatch(/.*before being summarised$/);
                basicFilter.preAggregation = false;
                expect(ctrl.createFilterLabel(basicFilter)).toMatch(/.*after being summarised$/);
            });
        });

        describe('ctrl.deleteFilter()', function() {
    
            beforeEach(function() {
                ctrl.model.entityFilters = {
                    "testGroup": [
                        "first.filter",
                        "second.filter"
                    ]
                };
            });
    
            it('should delete a filter from a list', function() {
                ctrl.deleteFilter("testGroup", "entity", 0);
                expect(ctrl.model.entityFilters["testGroup"][0]).toEqual("second.filter");
            });
        });
    });
});
