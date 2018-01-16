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

        describe('When created', function() {

            var view;

            beforeEach(inject(function(_view_) {
                view = _view_;
            }));

            it('should use the view service to populate the view edges', function() {
                spyOn(view, 'getViewEdges').and.returnValue(['my', 'schema', 'groups']);
                var ctrl = $componentController('viewBuilder');
                expect(ctrl.viewEdges).toEqual(['my', 'schema', 'groups'])
            });

            it('should use the view service to populate the view entities', function() {
                spyOn(view, 'getViewEntities').and.returnValue(['the', 'view', 'groups']);
                var ctrl = $componentController('viewBuilder');
                expect(ctrl.viewEntities).toEqual(['the', 'view', 'groups'])
            });

            it('should use the view service to populate the edge filters', function() {
                var serviceFilters = {
                    "group1": { "preAgg": [ "filter1", "filter2"] }
                }
                spyOn(view, 'getEdgeFilters').and.returnValue(serviceFilters);
                var ctrl = $componentController('viewBuilder');
                expect(ctrl.edgeFilters).toEqual(serviceFilters);
            });

            it('should use the view service to populate the entity filters', function() {
                var serviceFilters = {
                    "group1": { "preAgg": [ "filter1", "filter2"] }
                }
                spyOn(view, 'getEntityFilters').and.returnValue(serviceFilters);
                var ctrl = $componentController('viewBuilder');
                expect(ctrl.entityFilters).toEqual(serviceFilters);
            });
        });

        describe('ctrl.$onInit()', function() {

            var schema;
            var ctrl;
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
            })

            beforeEach(function() {
                ctrl = $componentController('viewBuilder', {$scope: scope});
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

            var ctrl;

            var schema;
            var edgesWithProperties = [];
            var entitiesWithProperties = [];

            beforeEach(inject(function(_schema_) {
                schema = _schema_;
            }));

            beforeEach(function() {
                edgesWithProperties = [];
                entitiesWithProperties = [];
            });

            beforeEach(function() {
                spyOn(schema, 'getEdgeProperties').and.callFake(function(group) {
                    if (edgesWithProperties.indexOf(group) !== -1) {
                        return {"prop1": "string"};
                    };
                    return undefined;
                });

                spyOn(schema, 'getEntityProperties').and.callFake(function(group) {
                    if (entitiesWithProperties.indexOf(group) !== -1) {
                        return {"prop1": "string"};
                    };
                    return undefined;
                });
            });

            beforeEach(function() {
                ctrl = $componentController('viewBuilder');
            });

            describe('when the input is an edge', function() {

                beforeEach(function() {
                    ctrl.viewEdges = [ 'edge1', 'edge2', 'edge3'];
                    edgesWithProperties = ctrl.viewEdges;
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
                    ctrl.viewEntities = ['entity1', 'entity2', 'entity3']
                    entitiesWithProperties = ctrl.viewEntities;
                    ctrl.viewEdges = ['edge1'];
                });

                it('should return false if there are edges with properties', function() {
                    edgesWithProperties = ctrl.viewEdges;
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
    });
})