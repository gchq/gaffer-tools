describe("The Graph Service", function() {

    var graph;
    var events;
    var scope;
    var vertices = [];
    var gafferSchema = {};
    var loading;
    var query;

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
                    return $q.when(gafferSchema);
                },
                getSchemaVertices: function() {
                    return vertices;
                }
            }
        });
    }));

    beforeEach(inject(function(_graph_, _events_, _$rootScope_, _loading_, _query_) {
        graph = _graph_;
        events = _events_;
        scope = _$rootScope_.$new();
        loading = _loading_;
        query = _query_;
    }));

    describe('when loading', function() {

        var resolvedValue;

        beforeEach(function(done) {
            graph.load().then(function(graphObject) {
                resolvedValue = graphObject;
                done();
            });

            setTimeout(function() {
                scope.$apply();
            }, 1000)
        });

        it('should load cytoscape and return the cytoscape graph object', function() {
            expect(resolvedValue).toBeDefined();
        });
    });

    describe('after loading', function() {
        beforeEach(function() {
            graph.load(); // simulating the call performed when MainCtrl starts
        });

        describe('when adding a seed', function() {
            
            var input;
            var types;

            beforeEach(inject(function(_input_, _types_) {
                input = _input_;
                types = _types_;
            }))

            beforeEach(function() {
                spyOn(input, 'addInput').and.stub();
            });

            it('should also select it', function() {
                graph.addSeed("mySeed");
                expect(graph.getSelectedEntities()).toEqual({'"mySeed"': [{vertex: '"mySeed"'}]})
            });

            it('should add it to the input service', function() {
                spyOn(types, 'createParts').and.callFake( function(clazz, value) {
                    return { undefined: value };
                });
                gafferSchema = {
                    types: {
                        "vertex": {
                            "class": "java.lang.String"
                        }
                    }
                }

                vertices = [ 'vertex' ];

                graph.addSeed("test");
                scope.$digest();
                expect(input.addInput).toHaveBeenCalledWith({ "valueClass": "java.lang.String", parts: {undefined: "test"} });
            });

            it('should broadcast the selectedElementsUpdate event', function() {
                spyOn(events, 'broadcast');
                graph.addSeed('mySeed');
                expect(events.broadcast).toHaveBeenCalledTimes(1);
                expect(events.broadcast.calls.first().args[1]).toEqual([{entities: { '"mySeed"': [{vertex: '"mySeed"'}]}, edges: {}}]);
            });

            it('should select it if already added', function() {
                // add it the first time
                graph.addSeed("mySeed");
                // deselect it
                graph.reset();

                graph.addSeed("mySeed");
                expect(graph.getSelectedEntities()).toEqual({'"mySeed"': [{vertex: '"mySeed"'}]})
            });

            it('should do nothing if already added and selected', function() {
                graph.addSeed("mySeed");
                expect(graph.getSelectedEntities()).toEqual({'"mySeed"': [{vertex: '"mySeed"'}]});
                graph.addSeed("mySeed");
                expect(graph.getSelectedEntities()).toEqual({'"mySeed"': [{vertex: '"mySeed"'}]});
            });
        });

        describe('when quick hop is clicked', function() {
            it('should execute a GetElements operation with the clicked node', function() {
                var event = {
                    cyTarget: {
                        id: function() {
                            return "\"vertex1\""
                        }
                    }
                };

                spyOn(loading, 'load');
                spyOn(query, 'addOperation');
                spyOn(query, 'executeQuery');
                graph.quickHop(event);

                expect(loading.load).toHaveBeenCalledTimes(1);
                expect(query.addOperation).toHaveBeenCalledTimes(1);
                var expectedOp = {
                     class: 'uk.gov.gchq.gaffer.operation.impl.get.GetElements',
                     input: [{ class: 'uk.gov.gchq.gaffer.operation.data.EntitySeed', vertex: 'vertex1' }],
                     options: {},
                     view: {
                        globalElements: [
                            {
                                groupBy: []
                            }
                        ]
                     }
                };

                expect(query.addOperation).toHaveBeenCalledWith(expectedOp);
                expect(query.executeQuery).toHaveBeenCalledWith({
                        class: 'uk.gov.gchq.gaffer.operation.OperationChain',
                        operations: [
                            expectedOp,
                            { class: 'uk.gov.gchq.gaffer.operation.impl.Limit', resultLimit: 100, options: {  } },
                            { class: 'uk.gov.gchq.gaffer.operation.impl.output.ToSet', options: {  } }
                        ],
                        options: {  }
                    }, graph.deselectAll);
            });
        });
    });


})
