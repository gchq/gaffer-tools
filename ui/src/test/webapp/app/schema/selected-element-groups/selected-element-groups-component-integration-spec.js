describe('The Selected Element Groups Component', function() {
    beforeEach(module('app'));
    describe('When the events service broadcasts a selected schema groups update', function() {
        var $componentController
        var events;
        var ctrl;
        var schema;
        var $q;

        beforeEach(module(function($provide) {
            $provide.factory('schema', function($q) {
                return {
                    get: function() {
                        return $q.when({});
                    }
                }
            });
        }));

        beforeEach(inject(function(_$rootScope_, _$componentController_, _events_,  _schema_, _$q_) {
            scope = _$rootScope_.$new();
            $componentController = _$componentController_;
            events = _events_;
            schema = _schema_;
            $q = _$q_;

            spyOn(schema, 'get').and.returnValue($q.when({
                "edges": {
                    "edge1": {
                        "source": "src1",
                        "destination": "dest1",
                        "directed": "true",
                        "description": "edge1 description",
                        "properties": {
                            "count" : "int"
                        }
                    },
                    "edge2": {
                        "source": "src2",
                        "destination": "dest2",
                        "directed": "false",
                        "description": "edge2 description"
                    }
                },
                "entities": {
                    "entity1": {
                        "vertex": "vertex1",
                        "description": "entity1 description"
                    },
                    "entity2": {
                        "vertex": "vertex2",
                        "description": "entity2 description"
                    }
                },
                "types": {
                    "vertex1": {
                        "class": "my.vertex.class1"
                    },
                    "vertex2": {
                        "class": "my.vertex.class1"
                    },
                    "src1": {
                        "class": "my.src.class1"
                    },
                    "dest1": {
                        "class": "my.dest.class1"
                    },
                    "src1": {
                        "class": "my.src.class2src"
                    },
                    "dest1": {
                        "class": "my.dest.class2dest"
                    },
                    "int": {
                        "class": "java.lang.Integer",
                        "description": "int description"
                    }
                }
            }));
        }));

        beforeEach(function() {
            ctrl = $componentController('selectedElementGroups');
            ctrl.$onInit();
            scope.$digest();
        });

        it('should update the selected groups', function() {
            events.broadcast('selectedSchemaElementGroupsUpdate',
                [{
                   'edges': [
                       "edge1"
                   ],
                   'vertices': [
                       "vertex2"
                   ]
                }]
           );
            expect(ctrl.selectedEntities).toEqual([{ group: 'entity2', description: "entity2 description", vertex: { name: 'vertex2', description: 'class1' }, groupBy: '', properties: [  ] }]);
            expect(ctrl.selectedEdges).toEqual([{ group: 'edge1', description: "edge1 description", source: { name: 'src1', description: 'class2src' }, destination: { name: "dest1", description: 'class2dest' }, directed: { name: "true", description: '' }, groupBy: '', properties: [ {name: "count", description: "int description" } ] }]);
        });
    });
})
