describe("The Graph Component", function() {

    var graph;
    var events;
    var types;
    var scope;
    var vertices = [];
    var gafferSchema = {};
    var $componentController;

    var $q;

    var selectedElementsModel = {
        edges: [],
        entities: []
    }

    var $httpBackend;
    var ctrl;
    var injectableCytoscape;

    var entityVertexType = {'vertex': { "class": "java.lang.String"}};
    var edgeVertexType = { 'source': {'src': { "class": "java.lang.String"}}, 'destination': {'dest': { "class": "java.lang.String"}} };
    beforeEach(module('app'));

    beforeEach(module(function($provide) {
        $provide.factory('schema', function($q) {
            return {
                get: function() {
                    return $q.when(gafferSchema);
                },
                getSchemaVertices: function() {
                    return vertices;
                },
                getVertexTypeFromEntityGroup: function() {
                    return entityVertexType;
                },
                getVertexTypesFromEdgeGroup: function() {
                    return edgeVertexType
                }
            }
        });
    }));

    
    beforeEach(inject(function(_graph_, _events_, _$rootScope_, _$componentController_, _$q_, _$httpBackend_, _types_) {
        graph = _graph_;
        events = _events_;
        scope = _$rootScope_.$new();
        $componentController = _$componentController_;
        $q = _$q_;
        $httpBackend = _$httpBackend_;
        types = _types_;
    }));
    
    beforeEach(function() {
        $httpBackend.whenGET('config/defaultConfig.json').respond(200, {})
    });

    beforeEach(function() {
        ctrl = $componentController('graph', {$scope: scope}, {selectedElements: selectedElementsModel});
    });

    beforeEach(function() {
        injectableCytoscape = cytoscape({
            styleEnabled: true
        });
    });

    beforeEach(function() {
        jasmine.clock().install();
    });

    beforeEach(function() {
        spyOn(window, 'cytoscape').and.callFake(function(obj) {
            setTimeout(function() {
                obj.ready();
            }, 100)
            return injectableCytoscape
        });
    });

    beforeEach(function() {
        spyOn(types, 'createParts').and.callFake(function(clazz, value) {
            if (clazz === 'java.lang.String') {
                return {
                    undefined: value
                }
            }

            return value;
        })
    })

    afterEach(function() {
        jasmine.clock().uninstall();
    });

    describe('ctrl.$onInit()', function() {
        var config;
        var graphConf;

        var configArgs;

        beforeEach(inject(function(_config_) {
            config = _config_;
        }));

        beforeEach(function() {
            spyOn(graph, 'getGraphConfiguration').and.callFake(function() {
                return graphConf;
            });

            spyOn(graph, 'setGraphConfiguration').and.callFake(function(args) {
                configArgs = angular.copy(args);
            });
        });

        beforeEach(function() {
            graphConf = null;
        });

        it('should throw an error if no selected elements model is injected', function() {
            ctrl = $componentController('graph', {$scope: scope}); // No model injected

            expect(ctrl.$onInit).toThrow('Graph view must have selected elements injected into it');
        });

        it('should not make a call to the config if configuration is stored in the graph service', function() {
            graphConf = {};

            spyOn(config, 'get').and.returnValue($q.when({}));
            ctrl.$onInit();

            expect(config.get).not.toHaveBeenCalled();
        });

        it('should make a call to the config if the configuration in the graph service is null', function() {
            spyOn(config, 'get').and.returnValue($q.when({}));

            ctrl.$onInit();

            expect(config.get).toHaveBeenCalled();
        });

        it('should cache the configuration in the graph service', function() {
            spyOn(config, 'get').and.returnValue($q.when({}));

            ctrl.$onInit();
            scope.$digest();

            expect(graph.setGraphConfiguration).toHaveBeenCalled();
        })

        it('should merge the configured graph physics with the default graph physics', function() {
            $httpBackend.whenGET('config/config.json').respond(200, { graph: { physics: { dragCoeff: 0.00000009 }}});

            ctrl.$onInit();
            $httpBackend.flush();

            var mergedPhysics = {
                "springLength": 30,
                "springCoeff": 0.000001,
                "gravity": -4,
                "dragCoeff": 0.00000009,
                "stableThreshold": 0.000001,
                "fit": true
            }

            expect(configArgs.physics).toEqual(mergedPhysics)
        });

        it('should merge the configured style with the component\'s default', function() {
            $httpBackend.whenGET('config/config.json').respond(200, { graph: { defaultStyle: { entityWrapper: { height: 500 }}, style: {
                edges: {
                    "myEdgeType": {
                        "line-color": "blue"
                    }
                }
            }}});

            ctrl.$onInit();
            $httpBackend.flush();

            var style = {
                edges: {
                    "myEdgeType": {
                        "line-color": "blue"
                    }
                }
            };

            var mergedDefaultStyle = {
                edges: {
                    'curve-style': 'bezier',
                    'min-zoomed-font-size': 35,
                    'text-outline-color': '#538212',
                    'text-outline-width': 3,
                    'line-color': '#538212',
                    'target-arrow-color': '#538212',
                    'target-arrow-shape': 'triangle',
                    'font-size': 14,
                    'color': '#FFFFFF',
                    'width': 5
                },
                vertices: {
                    'height': 30,
                    'width': 30,
                    'min-zoomed-font-size': 20,
                    'font-size': 14,
                    'text-valign': 'center',
                    'color': '#333333',
                    'text-outline-color': '#FFFFFF',
                    'background-color': '#FFFFFF',
                    'text-outline-width': 3
                },
                entityWrapper: {
                    'height': 500,
                    'width': 60,
                    'border-width': 2,
                    "border-color": "#55555"
                }
            }

            expect(configArgs.style).toEqual(style);
            expect(configArgs.defaultStyle).toEqual(mergedDefaultStyle);
        });

        it('should just use the default if no graph configuration is specified', function() {
            $httpBackend.whenGET('config/config.json').respond(200, {});

            var defaultConfiguration = {
                name: 'cytoscape-ngraph.forcelayout',
                async: {
                    maxIterations: 1000,
                    stepsPerCycle: 50,
                    waitForStep: true
                },
                physics: {
                     "springLength": 30,
                     "springCoeff": 0.000001,
                     "gravity": -4,
                     "dragCoeff": 0.005,
                     "stableThreshold": 0.000001,
                     "fit": true
                },
                iterations: 10000,
                fit: true,
                animate: false,
                defaultStyle: {
                    edges: {
                        'curve-style': 'bezier',
                        'min-zoomed-font-size': 35,
                        'text-outline-color': '#538212',
                        'text-outline-width': 3,
                        'line-color': '#538212',
                        'target-arrow-color': '#538212',
                        'target-arrow-shape': 'triangle',
                        'font-size': 14,
                        'color': '#FFFFFF',
                        'width': 5
                    },
                    vertices: {
                        'height': 30,
                        'width': 30,
                        'min-zoomed-font-size': 20,
                        'font-size': 14,
                        'text-valign': 'center',
                        'color': '#333333',
                        'text-outline-color': '#FFFFFF',
                        'background-color': '#FFFFFF',
                        'text-outline-width': 3
                    },
                    entityWrapper: {
                        'height': 60,
                        'width': 60,
                        'border-width': 2,
                        "border-color": "#55555"
                    }
                }
            }; // copied from graph component

            ctrl.$onInit();
            $httpBackend.flush();
            expect(configArgs).toEqual(defaultConfiguration)

        });

        it('should load cytoscape', function() {
            $httpBackend.whenGET('config/config.json').respond(200, {});
            ctrl.$onInit();

            $httpBackend.flush();

            expect(window.cytoscape).toHaveBeenCalled();
        });

        it('should load the graph from the results', function() {
            spyOn(ctrl, 'update').and.stub();
            $httpBackend.whenGET('config/config.json').respond(200, {});
            ctrl.$onInit();

            $httpBackend.flush();
            jasmine.clock().tick(101);

            scope.$digest();

            expect(ctrl.update).toHaveBeenCalled();
        })

        it('should run the filter once loaded if the service holds a filter', function() {
            spyOn(ctrl, 'filter').and.stub();
            spyOn(ctrl, 'update').and.stub();
            spyOn(graph, 'getSearchTerm').and.returnValue('test');
            
            
            $httpBackend.whenGET('config/config.json').respond(200, {});
            ctrl.$onInit();

            $httpBackend.flush();

            jasmine.clock().tick(101);

            scope.$digest();

            expect(ctrl.filter).toHaveBeenCalled();
        });

        it('should not run the filter function if the searchTerm is undefined', function() {
            spyOn(ctrl, 'filter').and.stub();
            spyOn(ctrl, 'update').and.stub();
            spyOn(graph, 'getSearchTerm').and.returnValue(undefined);
            
            $httpBackend.whenGET('config/config.json').respond(200, {});
            ctrl.$onInit();

            $httpBackend.flush();

            jasmine.clock().tick(101);

            scope.$digest();

            expect(ctrl.filter).not.toHaveBeenCalled();
        });

        it('should not run the filter function if the searchTerm is an empty string', function() {
            spyOn(ctrl, 'filter').and.stub();
            spyOn(ctrl, 'update').and.stub();
            spyOn(graph, 'getSearchTerm').and.returnValue("");
            
            $httpBackend.whenGET('config/config.json').respond(200, {});
            ctrl.$onInit();

            $httpBackend.flush();

            jasmine.clock().tick(101);

            scope.$digest();

            expect(ctrl.filter).not.toHaveBeenCalled();
        });

        it('should not run the filter function if the searchTerm is null', function() {
            spyOn(ctrl, 'filter').and.stub();
            spyOn(ctrl, 'update').and.stub();
            spyOn(graph, 'getSearchTerm').and.returnValue(null);
            
            $httpBackend.whenGET('config/config.json').respond(200, {});
            ctrl.$onInit();

            $httpBackend.flush();

            jasmine.clock().tick(101);

            scope.$digest();

            expect(ctrl.filter).not.toHaveBeenCalled();
        });

        it('should subscribe to the "incomingResults" event', function() {
            spyOn(events, 'subscribe');
            ctrl.$onInit();

            expect(events.subscribe).toHaveBeenCalledWith("incomingResults", jasmine.any(Function));
        });

        it('should subscribe to the "resultsCleared" event', function() {
            spyOn(events, 'subscribe');
            ctrl.$onInit();

            expect(events.subscribe).toHaveBeenCalledWith("resultsCleared", jasmine.any(Function));
        });
    });

    describe('post initialisation', function() {
        var elements;

        beforeEach(function() {
            spyOn(ctrl, 'update').and.callThrough();
            spyOn(ctrl, 'reset').and.callThrough();
        })

        beforeEach(function() {
            $httpBackend.whenGET('config/config.json').respond(200, {});
            ctrl.$onInit();
            $httpBackend.flush();
            jasmine.clock().tick(101);
            scope.$digest();
        });

        beforeEach(function() {
            elements = {
                entities: [
                    {
                        class: 'Entity',
                        vertex: 'foo',
                        group: 'fooEntity',
                        properties: {}
                    }
                ],
                edges: [
                    {
                        class: 'Edge',
                        source: 'foo',
                        directed: true,
                        destination: 'bar',
                        group: 'foobarEdge',
                        properties: {
                            count: 42
                        }
                    }
                ]
            }
        });

        describe('ctrl.$onDestroy()', function() {
            it('should unsubscribe from the "incomingResults" event', function() {
                spyOn(events, 'unsubscribe');
                ctrl.$onDestroy();
    
                expect(events.unsubscribe).toHaveBeenCalledWith("incomingResults", jasmine.any(Function));
            })
    
            it('should unsubscribe from the "resultsCleared" event', function() {
                spyOn(events, 'unsubscribe');
                ctrl.$onDestroy();
    
                expect(events.unsubscribe).toHaveBeenCalledWith("incomingResults", jasmine.any(Function));
            });
    
            it('should destroy the cytoscape graph cleanly', function() {    
                spyOn(injectableCytoscape, 'destroy');

                ctrl.$onDestroy();
                expect(injectableCytoscape.destroy).toHaveBeenCalled();
            });
        });
    
        describe('ctrl.quickHop()', function() {
    
            var operationOptions, query, error;
            var failureFlag = false;

            var elementsToReturn;
    
            var event;
    
            beforeEach(inject(function(_operationOptions_, _query_, _error_) {
                operationOptions = _operationOptions_;
                query = _query_;
                error = _error_;
            }));
    
            beforeEach(function() {
                spyOn(query, 'executeQuery').and.callFake(function(op, onSuccess, onFailure) {
                    if (failureFlag) {
                        onFailure('error test')
                    } else {
                        events.broadcast('incomingResults', [elementsToReturn]);
                        onSuccess(elementsToReturn);
                    }
                });
            });
    
            beforeEach(function() {
                event = {
                    cyTarget: {
                        id: function() {
                            return "\"vertex1\""
                        }
                    }
                };

                elementsToReturn = {};
            });

            beforeEach(function() {
                ctrl.update(elements);
            });

            it('should broadcast an error if no event is supplied or selected elements created', function() {
                spyOn(error, 'handle').and.stub();
    
                ctrl.quickHop();
    
                expect(error.handle).toHaveBeenCalled();
            });
    
            it('should add the query to the list of queries', function() {
                spyOn(query, 'addOperation').and.stub();
                ctrl.quickHop(event);
                expect(query.addOperation).toHaveBeenCalled();
            });
    
            it('should use an event to generate the input for the Get Elements query', function() {
                ctrl.quickHop(event);
                expect(query.executeQuery.calls.argsFor(0)[0].operations[0].input[0].vertex).toEqual("vertex1");
            });
            
            it('should limit the query using the default result limit', function() {
                ctrl.quickHop(event);
                expect(query.executeQuery.calls.argsFor(0)[0].operations[1].class).toEqual("uk.gov.gchq.gaffer.operation.impl.Limit");
            });
    
            it('should deduplicate the results', function() {
                ctrl.quickHop(event);
                expect(query.executeQuery.calls.argsFor(0)[0].operations[2].class).toEqual("uk.gov.gchq.gaffer.operation.impl.output.ToSet");
            });
    
            it('should add operation options to the operations', function() {
                spyOn(operationOptions, 'getDefaultOperationOptions').and.returnValue({'foo': 'bar'})
    
                ctrl.quickHop(event);
                var operations = query.executeQuery.calls.argsFor(0)[0].operations;
    
                for (var i in operations) {
                    expect(operations[i].options).toEqual({'foo': 'bar'});
                }
            });
    
            it('should use the selected elements if not event is supplied', function() {
                ctrl.selectedElements.entities = [
                    '"id1"',
                    '"id2"'
                ]
    
                ctrl.quickHop();
    
                var input = query.executeQuery.calls.argsFor(0)[0].operations[0].input;
    
                expect(input).toEqual([{
                        class: "uk.gov.gchq.gaffer.operation.data.EntitySeed",
                        vertex: "id1"
                    },
                    {
                        class: "uk.gov.gchq.gaffer.operation.data.EntitySeed",
                        vertex: "id2"
                    }
                ]);
            });

            it('should not move the existing elements after the new elements are returned', function() {
                injectableCytoscape.layout({ 'name': 'random'});
                var oldElementPositions = injectableCytoscape.nodes().map(function(element) {
                    return {
                        key: element.id(),
                        position: element.position()
                    }
                });

                elementsToReturn = {
                    edges: [
                        {
                            class: 'Edge',
                            source: 'foo',
                            directed: true,
                            destination: 'bar2',
                            group: 'foobarEdge',
                            properties: {
                                count: 42
                            }
                        }
                    ]
                }

                ctrl.quickHop(event);

                var newElementPositions = injectableCytoscape.nodes().map(function(element) {
                    return {
                        key: element.id(),
                        position: element.position()
                    };
                });

                expect(oldElementPositions.length).toEqual(2)
                expect(newElementPositions.length).toEqual(3)

                for (var i in oldElementPositions) {
                    expect(newElementPositions[i].key).toEqual(oldElementPositions[i].key);
                    expect(newElementPositions[i].position).toEqual(oldElementPositions[i].position);
                }
    
            });

            it('should release the lock on elements after the graph has been drawn', function() {
                elementsToReturn = {
                    edges: [
                        {
                            class: 'Edge',
                            source: 'foo',
                            directed: true,
                            destination: 'bar2',
                            group: 'foobarEdge',
                            properties: {
                                count: 42
                            }
                        }
                    ]
                }

                ctrl.quickHop(event);

                injectableCytoscape.elements().map(function(element) {
                    expect(element.locked()).toBeFalsy()
                });
            });

            it('should unlock the elements if the request fails', function() {
                failureFlag = true;

                ctrl.quickHop(event);

                injectableCytoscape.elements().map(function(element) {
                    expect(element.locked()).toBeFalsy()
                });

            });
        });
    
        describe('ctrl.removeSelected()', function() {

            beforeEach(function() {
                ctrl.update(elements);
                injectableCytoscape.getElementById('"foo"').select();
            });
           
            it('should remove the selected elements', function() {
                ctrl.removeSelected();

                expect(injectableCytoscape.nodes().size()).toEqual(1);
            });
    
            it('should unselect all the elements', function() {
                expect(injectableCytoscape.elements(':selected').size()).toEqual(1);

                ctrl.removeSelected();

                expect(injectableCytoscape.elements(':selected').size()).toEqual(0);
            });
    
            it('should reset the selected elements', function() {
                ctrl.selectedElements = {
                    entities: [ 'a' ],
                    edges: [ 'a|b|true|eg' ] 
                };
    
                ctrl.removeSelected();
    
                expect(ctrl.selectedElements).toEqual({
                    entities: [],
                    edges: []
                });
            });
        });
    
        describe('ctrl.update()', function() {
            
            it('should add elements from the results to the graph', function() {
                ctrl.update(elements);
                expect(injectableCytoscape.elements().size()).toEqual(3);
            });

            it('should not error when vertex type is unknown', function() {
                entityVertexType = undefined;

                ctrl.update(elements);
                expect(injectableCytoscape.elements().size()).toEqual(3);
            });
    
            it('should use quoted strings as vertex ids for string seeds', function() {
                ctrl.update(elements);
                var ids = [];
                var nodes = injectableCytoscape.nodes();
    
                nodes.forEach(function(node) {
                    ids.push(node.id())
                });
    
                expect(ids).toContain('"foo"');
                expect(ids).toContain('"bar"');
            });
    
            it('should use stringified numbers as ids for numerical seeds', function() {
                elements.entities[0].vertex = 1;
                elements.edges[0].source = 1;
                elements.edges[0].destination = 2;
    
                ctrl.update(elements);
                var ids = [];
                var nodes = injectableCytoscape.nodes();
    
                nodes.forEach(function(node) {
                    ids.push(node.id())
                });
    
                expect(ids).toContain('1');
                expect(ids).toContain('2');
            });
    
            it('should use the stringified vertex for object seeds', inject(function(_types_) {
    
                var types = _types_;
    
                spyOn(types, 'getShortValue').and.callFake(function(val) {
                    var value = val[Object.keys(val)[0]];
                    return Object.keys(value).map(function(key){
                        return value[key]
                    }).join("|");
                });
    
                elements.entities[0].vertex = {
                    complexObject: {
                        type: 't1',
                        value: 'v1'
                    }
                };
                elements.edges[0].source = {
                    complexObject: {
                        type: 't1',
                        value: 'v1'
                    }
                };
                elements.edges[0].destination = {
                    complexObject: {
                        type: 't2',
                        value: 'v2'
                    }
                };
    
                ctrl.update(elements);
                var ids = [];
                var nodes = injectableCytoscape.nodes();
    
                nodes.forEach(function(node) {
                    ids.push(node.id())
                });
    
                expect(ids).toContain(JSON.stringify(elements.entities[0].vertex));
                expect(ids).toContain(JSON.stringify(elements.edges[0].destination));
            }));
    
            it('should use a combination of source, destination, directed and group for edge ids seperated by null characters', function() {
                ctrl.update(elements);
                var edges = injectableCytoscape.edges();
    
                expect(edges.size()).toEqual(1);
    
                edges.forEach(function(edge) {
                    expect(edge.id()).toEqual('"foo"\0"bar"\0true\0foobarEdge')
                });
            });

            it('should produce nodes with an entity property of true if updated with edges and entities containing the same id', function() {
                ctrl.update(elements);
                var node = injectableCytoscape.getElementById('"foo"');

                expect(node.data().entity).toBeTruthy();
            });
        });
    
        describe('ctrl.reset()', function() {
    
            it('should clear the graph', function() {
                ctrl.reset();
                expect(injectableCytoscape.elements().size()).toEqual(0);
            });
    
            it('should update the graph with elements from the results service', inject(function(_results_) {
                var results = _results_;
    
                var fakeResults = {
                    entities: [
                        {
                            class: 'Entity',
                            vertex: 'test',
                            group: 'testEntity',
                            properties: {}
                        }
                    ],
                    edges: [],
                    other: []
                }
    
                spyOn(results, 'get').and.returnValue(fakeResults);
    
                ctrl.reset();
                expect(ctrl.update).toHaveBeenCalledWith(fakeResults);
            }));
        });
    
        describe('ctrl.filter()', function() {

            beforeEach(function() {
                ctrl.update(elements);
            })
            
            it('should hide any vertices which don\'t match the filter', function() {
                ctrl.filter('ba');
    
                var nodes = injectableCytoscape.nodes();
    
                expect(nodes.size()).toEqual(2);
    
                var fooNode = injectableCytoscape.getElementById('"foo"');
                var barNode = injectableCytoscape.getElementById('"bar"');
    
                expect(fooNode.hasClass('filtered')).toBeTruthy();
                expect(barNode.hasClass('filtered')).toBeFalsy();
            });
        });
    
        describe('ctrl.redraw()', function() {

            beforeEach(function() {
                ctrl.update(elements);
            })
            
            beforeEach(function() {
                ctrl.filter('ba');
            });

            it('should remove all filtered elements from the graph', function() {
                ctrl.redraw();
    
                expect(injectableCytoscape.elements().size()).toEqual(1);
            });
    
            it('should re-run the layout', function() {
                spyOn(injectableCytoscape, 'layout');
    
                ctrl.redraw();
    
                expect(injectableCytoscape.layout).toHaveBeenCalled();
            });
        });
    
        describe('on "incomingResults" event', function() {
            it('should update the graph with the new results', function() {
                events.broadcast("incomingResults", ['test']);
                expect(ctrl.update).toHaveBeenCalledWith('test');
            });
        });
    
        describe('on "resultsCleared" event', function() {
            it('should reset the graph', function() {
                events.broadcast('resultsCleared', []);
    
                expect(ctrl.reset).toHaveBeenCalled();
            })
        });
    });

    describe("edge cases", function() {

        var elements = {
            entities: [
            {
                class: 'Entity',
                vertex: {
                    "type": "green",
                    "value": "v"
                },
                group: 'fooEntity',
                properties: {}
            },
            {
                class: 'Entity',
                vertex: {
                    "type": "blue",
                    "value": "v"
                },
                group: 'fooEntity',
                properties: {}
            }
        ]
        };

        beforeEach(inject(function(_schema_) {
            schema = _schema_;
        }));

        beforeEach(function() {
            $httpBackend.whenGET('config/config.json').respond(200, {
                "graph": {
                    "style": {
                        "vertexTypes": {
                            "vertex.fullStop": {
                                "style": {
                                    "background-color": "blue"
                                },
                                "fieldOverrides": {
                                    "type": {
                                        "green": {
                                            "background-color": "green"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });

            ctrl.$onInit();
            $httpBackend.flush();
            jasmine.clock().tick(101);
        })

        it('should not error when adding style for a schema vertex type containing a full stop', function() {
            spyOn(console, 'error').and.stub();
            scope.$digest();
            expect(console.error).not.toHaveBeenCalled();
        });

        it('should take on the special type css class when adding elements which have a schema vertex type containing a full stop and are of a special type', function() {          
            scope.$digest();

            spyOn(schema, 'getVertexTypeFromEntityGroup').and.returnValue({
                "vertex.fullStop": {
                    "class": "TypeValue"
                }
            });

            ctrl.update(elements);

            expect(injectableCytoscape.getElementById('{"type":"green","value":"v"}').style()["background-color"]).toEqual("green");
            
            expect(injectableCytoscape.getElementById('{"type":"blue","value":"v"}').style()["background-color"]).toEqual("blue");
        });

        it('should use correct css classes for vertices when adding edges which connect vertex types containing a full stop', function() {
            var edges = {"edges": [{
                class: 'Edge',
                source: {
                    "type": "blue",
                    "value": "v"
                },
                destination: {
                    "type": "green",
                    "value": "v"
                },
                group: "myEdge",
                directed: false,
                properties: {}
            }]};

            scope.$digest();

            spyOn(schema, 'getVertexTypesFromEdgeGroup').and.returnValue({
                "source": {
                    "vertex.fullStop": {
                        "class": "TypeValue"
                    }
                },
                "destination": {
                    "vertex.fullStop": {
                        "class": "TypeValue"
                    }
                }
            });

            ctrl.update(edges);

            expect(injectableCytoscape.getElementById('{"type":"green","value":"v"}').style()["background-color"]).toEqual("green");
            
            expect(injectableCytoscape.getElementById('{"type":"blue","value":"v"}').style()["background-color"]).toEqual("blue");
        })
    });
});
