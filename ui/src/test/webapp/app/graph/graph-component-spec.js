describe("The Graph Component", function() {

    var graph;
    var events;
    var scope;
    var vertices = [];
    var gafferSchema = {};
    var $componentController;

    var $q;

    var selectedElementsModel = {
        edges: {},
        entities: {}
    }

    var $httpBackend;
    var ctrl;

    beforeEach(module('app'));

    beforeEach(module(function($provide) {
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

    
    beforeEach(inject(function(_graph_, _events_, _$rootScope_, _$componentController_, _$q_, _$httpBackend_) {
        graph = _graph_;
        events = _events_;
        scope = _$rootScope_.$new();
        $componentController = _$componentController_;
        $q = _$q_;
        $httpBackend = _$httpBackend_;
    }));
    
    beforeEach(function() {
        $httpBackend.whenGET('config/defaultConfig.json').respond(200, {})
    });

    beforeEach(function() {
        ctrl = $componentController('graph', {$scope: scope}, {selectedElements: selectedElementsModel});
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

        beforeEach(function() {
            jasmine.clock().install();
        });

        afterEach(function() {
            jasmine.clock().uninstall();
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
            spyOn(window, 'cytoscape').and.callThrough();
            $httpBackend.whenGET('config/config.json').respond(200, {});
            ctrl.$onInit();

            $httpBackend.flush();

            expect(window.cytoscape).toHaveBeenCalled();
        });

        it('should load the graph from the results', function() {
            spyOn(ctrl, 'update').and.stub();

            spyOn(window, 'cytoscape').and.callFake(function(obj) {
                
                setTimeout(function() {
                    obj.ready();
                }, 100)
                return {
                    on: function(evt, cb) {},
                    elements: function() { return [] }
                }
            });
            
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
            
            spyOn(window, 'cytoscape').and.callFake(function(obj) {
                
                setTimeout(function() {
                    obj.ready();
                }, 100)
                return {
                    on: function(evt, cb) {},
                    elements: function() { return []; }
                }
            });
            
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
            
            spyOn(window, 'cytoscape').and.callFake(function(obj) {
                
                setTimeout(function() {
                    obj.ready();
                }, 100)
                return {
                    on: function(evt, cb) {},
                    elements: function() { return []; }
                }
            });
            
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
            
            spyOn(window, 'cytoscape').and.callFake(function(obj) {
                
                setTimeout(function() {
                    obj.ready();
                }, 100)
                return {
                    on: function(evt, cb) {},
                    elements: function() { return []; }
                }
            });
            
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
            
            spyOn(window, 'cytoscape').and.callFake(function(obj) {
                
                setTimeout(function() {
                    obj.ready();
                }, 100)
                return {
                    on: function(evt, cb) {},
                    elements: function() { return []; }
                }
            });
            
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
            spyOn(ctrl, 'update').and.stub();

            var destroySpy = jasmine.createSpy('destroySpy');

            jasmine.clock().install();
            spyOn(window, 'cytoscape').and.callFake(function(obj) {
                setTimeout(function() {
                    obj.ready();
                }, 100)
                return {
                    on: function(evt, cb) {},
                    elements: function() { return [] },
                    destroy: destroySpy
                }
            });
            
            $httpBackend.whenGET('config/config.json').respond(200, {});
            ctrl.$onInit();
            $httpBackend.flush();
            jasmine.clock().tick(101);
            scope.$digest();

            ctrl.$onDestroy();

            expect(destroySpy).toHaveBeenCalled();

            jasmine.clock().uninstall();
        });
    });

    describe('ctrl.quickHop()', function() {

    });

    describe('ctrl.removeSelected', function() {

    });

    describe('ctrl.reset()', function() {

    });

    describe('ctrl.redraw()', function() {

    });

    describe('on "incomingResults" event', function() {

    });

    describe('on "resultsCleared" event', function() {

    });

    describe('cytoscape graph events', function() {
        describe('on edge selection', function() {
    
        });
    
        describe('on entity selection', function() {
    
        });
    
        describe('on vertex selection', function() {
    
        });

        describe('on double click', function() {

        });       
    });


    // describe('after loading', function() {
    //     beforeEach(function() {
    //         graph.load(); // simulating the call performed when MainCtrl starts
    //     });

    //     describe('when adding a seed', function() {
            
    //         var operationChain
    //         var types;

    //         beforeEach(inject(function(_operationChain_, _types_) {
    //             operationChain = _operationChain_;
    //             types = _types_;
    //         }))

    //         beforeEach(function() {
    //             spyOn(operationChain, 'addInput').and.stub();
    //         });

    //         it('should also select it', function() {
    //             graph.addSeed("mySeed");
    //             expect(graph.getSelectedEntities()).toEqual({'"mySeed"': [{vertex: '"mySeed"'}]})
    //         });

    //         it('should add it to the input service', function() {
    //             spyOn(types, 'createParts').and.callFake( function(clazz, value) {
    //                 return { undefined: value };
    //             });
    //             gafferSchema = {
    //                 types: {
    //                     "vertex": {
    //                         "class": "java.lang.String"
    //                     }
    //                 }
    //             }

    //             vertices = [ 'vertex' ];

    //             graph.addSeed("test");
    //             scope.$digest();
    //             expect(operationChain.addInput).toHaveBeenCalledWith({ "valueClass": "java.lang.String", parts: {undefined: "test"} });
    //         });

    //         it('should broadcast the selectedElementsUpdate event', function() {
    //             spyOn(events, 'broadcast');
    //             graph.addSeed('mySeed');
    //             expect(events.broadcast).toHaveBeenCalledTimes(1);
    //             expect(events.broadcast.calls.first().args[1]).toEqual([{entities: { '"mySeed"': [{vertex: '"mySeed"'}]}, edges: {}}]);
    //         });

    //         it('should select it if already added', function() {
    //             // add it the first time
    //             graph.addSeed("mySeed");
    //             // deselect it
    //             graph.reset();

    //             graph.addSeed("mySeed");
    //             expect(graph.getSelectedEntities()).toEqual({'"mySeed"': [{vertex: '"mySeed"'}]})
    //         });

    //         it('should do nothing if already added and selected', function() {
    //             graph.addSeed("mySeed");
    //             expect(graph.getSelectedEntities()).toEqual({'"mySeed"': [{vertex: '"mySeed"'}]});
    //             graph.addSeed("mySeed");
    //             expect(graph.getSelectedEntities()).toEqual({'"mySeed"': [{vertex: '"mySeed"'}]});
    //         });
    //     });

    //     describe('when quick hop is clicked', function() {
    //         it('should execute a GetElements operation with the clicked node', function() {
    //             var event = {
    //                 cyTarget: {
    //                     id: function() {
    //                         return "\"vertex1\""
    //                     }
    //                 }
    //             };

    //             spyOn(loading, 'load');
    //             spyOn(query, 'addOperation');
    //             spyOn(query, 'executeQuery');
    //             graph.quickHop(event);

    //             expect(loading.load).toHaveBeenCalledTimes(1);
    //             expect(query.addOperation).toHaveBeenCalledTimes(1);
    //             var expectedOp = {
    //                  class: 'uk.gov.gchq.gaffer.operation.impl.get.GetElements',
    //                  input: [{ class: 'uk.gov.gchq.gaffer.operation.data.EntitySeed', vertex: 'vertex1' }],
    //                  options: {},
    //                  view: {
    //                     globalElements: [
    //                         {
    //                             groupBy: []
    //                         }
    //                     ]
    //                  }
    //             };

    //             expect(query.addOperation).toHaveBeenCalledWith(expectedOp);
    //             expect(query.executeQuery).toHaveBeenCalledWith({
    //                     class: 'uk.gov.gchq.gaffer.operation.OperationChain',
    //                     operations: [
    //                         expectedOp,
    //                         { class: 'uk.gov.gchq.gaffer.operation.impl.Limit', resultLimit: 1000, options: {  } },
    //                         { class: 'uk.gov.gchq.gaffer.operation.impl.output.ToSet', options: {  } }
    //                     ],
    //                     options: {  }
    //                 }, graph.deselectAll);
    //         });
    //     });
    // });
});
