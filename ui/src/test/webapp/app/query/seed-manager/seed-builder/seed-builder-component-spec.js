describe('The seed builder component', function() {

    var ctrl;
    var scope;
    var $routeParams;
    var graph;
    var types;
    var error;

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
                getSchemaVertices: function() {
                    return []
                }
            }
        });
    }));

    beforeEach(inject(function(_$rootScope_, _$componentController_, _$routeParams_, _graph_, _types_, _error_) {
        scope = _$rootScope_.$new();
        var $componentController = _$componentController_;
        ctrl = $componentController('seedBuilder', {$scope: scope});
        $routeParams = _$routeParams_;
        graph = _graph_;
        types = _types_;
        error = _error_;
    }));

    it('should exist', function() {
        expect(ctrl).toBeDefined();
    });

    it('should set the initial value of multiple seeds to false', function() {
        expect(ctrl.multipleSeeds).toBeFalsy();
    });

    describe('when initialised', function() {

        var schema;
        var $q;

        beforeEach(inject(function(_schema_, _$q_) {
            schema = _schema_;
            $q = _$q_;
        }));

        beforeEach(function() {
            spyOn(schema, 'get').and.returnValue($q.when({
                "edges": {},
                "entities": {},
                "types": {
                    "vertex1": {
                        "class": "my.vertex.Class"
                    },
                    "vertex2": {
                        "class": "my.badly.configured.schema"
                    }
                }
            }));

            spyOn(schema, 'getSchemaVertices').and.returnValue(['vertex1', 'vertex2']);
            spyOn(graph, 'addSeed');
            spyOn(error, 'handle');
        });

        describe('with simple input query params', function() {
            beforeEach(function() {
                spyOn(types, 'getFields').and.returnValue([{
                     label: "Value",
                     type: "text",
                     class: "java.lang.String"
                }]);
            });

            it('should add a single seed', function() {
                $routeParams.input="seed1";
                spyOn(types, 'createJsonValue').and.returnValue("seed1");
                ctrl.$onInit();
                scope.$digest();
                expect(error.handle).not.toHaveBeenCalled();
                expect(graph.addSeed).toHaveBeenCalledTimes(1);
                expect(graph.addSeed).toHaveBeenCalledWith("seed1")
            });

            it('should add multiple single seeds', function() {
                $routeParams.input=["seed1", "seed2"];
                spyOn(types, 'createJsonValue').and.returnValues("seed1", "seed2");
                ctrl.$onInit();
                scope.$digest();
                expect(error.handle).not.toHaveBeenCalled();
                expect(graph.addSeed).toHaveBeenCalledTimes(2);
                expect(graph.addSeed).toHaveBeenCalledWith("seed1")
                expect(graph.addSeed).toHaveBeenCalledWith("seed2")
            });
        });

        describe('with complex input query params', function() {
            beforeEach(function() {
                spyOn(types, 'getFields').and.returnValue([{"key": "type"}, {"key": "value"}]);
            });

            it('should add a single seed', function() {
                $routeParams.input="t1,v1";
                spyOn(types, 'createJsonValue').and.returnValue({"type": "t1", "value": "v1"});
                ctrl.$onInit();
                scope.$digest();
                expect(error.handle).not.toHaveBeenCalled();
                expect(graph.addSeed).toHaveBeenCalledTimes(1);
                expect(graph.addSeed).toHaveBeenCalledWith({"type": "t1", "value": "v1"})
            });

            it('should add multiple single seeds', function() {
                $routeParams.input=["t1,v1", "t2,v2"];
                spyOn(types, 'createJsonValue').and.returnValues({"type": "t1", "value": "v1"}, {"type": "t2", "value": "v2"});
                ctrl.$onInit();
                scope.$digest();
                expect(error.handle).not.toHaveBeenCalled();
                expect(graph.addSeed).toHaveBeenCalledTimes(2);
                expect(graph.addSeed).toHaveBeenCalledWith({"type": "t1", "value": "v1"})
                expect(graph.addSeed).toHaveBeenCalledWith({"type": "t2", "value": "v2"})
            });
        });

        describe('and when the schema resolves a value', function() {
            beforeEach(function() {
                spyOn(types, 'getFields').and.returnValue([{"key": "type"}, {"key": "value"}]);
                ctrl.$onInit();
            });

            it('should get the schema', function() {
                expect(schema.get).toHaveBeenCalledTimes(1);
            });

            beforeEach(function() {
                scope.$digest();
            });

            it('should check the schema vertices', function() {
                expect(schema.getSchemaVertices).toHaveBeenCalledTimes(1);
            });

            it('should set the vertex class to that of the first item in the schema vertices array', function() {
                expect(ctrl.vertexClass).toEqual("my.vertex.Class");
            });

            describe('when checking if the input exists', function() {
                describe('and the user is entering multiple seeds', function() {
                    beforeEach(function() {
                        ctrl.multipleSeeds = true;
                    });

                    it('should return true if the seed box contains a value', function() {
                        ctrl.seedVertices = 'this is my seed';
                        expect(ctrl.inputExists()).toBeTruthy();
                    });

                    it('should return false if the seed box is an empty string, regardless of the single seed value', function() {
                        ctrl.seedVertices = '';
                        expect(ctrl.inputExists()).toBeFalsy();
                        ctrl.seedVertexParts = { value: 'this is not the seed being entered'};
                        expect(ctrl.inputExists()).toBeFalsy();
                    });
                });

                describe('and the user is entering a single seed', function() {
                    beforeEach(function() {
                        ctrl.multipleSeeds = false;
                    });

                    it('should return true if one of the parts are populated', function() {
                        ctrl.seedVertexParts = { type: undefined, value: 'This is the value'};
                        expect(ctrl.inputExists()).toBeTruthy();
                    });

                    it('should return false if all of the parts are undefined or empty', function() {
                        ctrl.seedVertexParts = {type: undefined, value: ''}
                        expect(ctrl.inputExists()).toBeFalsy();
                    });

                    it('should return true if on of the parts is a false value', function() {
                        ctrl.seedVertexParts = { binaryValue: false, complexValue: ''};
                        expect(ctrl.inputExists()).toBeTruthy();
                    });
                });
            });

            describe('when getting the vertex fields', function() {
                it('should use the vertex class', function() {
                    ctrl.vertexClass = "some.java.Class";

                    ctrl.getFields();
                    expect(types.getFields).toHaveBeenCalledTimes(1);
                    expect(types.getFields).toHaveBeenCalledWith('some.java.Class')
                });
            });

            describe('when getting the vertex csv header', function() {

                beforeEach(function() {
                    spyOn(types, 'getCsvHeader');
                });

                it('should use the vertex class', function() {
                    ctrl.vertexClass = "some.java.Class";

                    ctrl.getCsvHeader();
                    expect(types.getCsvHeader).toHaveBeenCalledTimes(1);
                    expect(types.getCsvHeader).toHaveBeenCalledWith('some.java.Class')
                });
            });

            describe('when adding seeds', function() {
                beforeEach(function() {
                    spyOn(types, 'createJsonValue').and.callFake(function(clazz, parts) {
                        var toReturn = {};
                        toReturn[clazz] = parts;
                        return toReturn;
                    });
                })

                describe('via the multi-seed textarea', function() {
                    beforeEach(function() {
                        ctrl.multipleSeeds = true;
                        ctrl.vertexClass = 'someClass';
                    })

                    it('should alert the user if too few csv fields are present', function() {
                        ctrl.seedVertices = 'singleValue';
                        ctrl.addSeeds();

                        expect(error.handle).toHaveBeenCalledTimes(1);
                        expect(error.handle).toHaveBeenCalledWith("Wrong number of parameters for seed: singleValue. someClass requires 2 parameters")
                    });

                    it('should alert the user if too many csv fields are present', function() {
                        ctrl.seedVertices = 'value1,value2,value3'
                        ctrl.addSeeds();

                        expect(error.handle).toHaveBeenCalledTimes(1);
                        expect(error.handle).toHaveBeenCalledWith("Wrong number of parameters for seed: value1,value2,value3. someClass requires 2 parameters")
                    });

                    it('should add multiple seeds if the vertices contain the right number of fields', function() {
                        ctrl.seedVertices = "value1,value2\nvalue3,value4";
                        ctrl.addSeeds();

                        expect(error.handle).not.toHaveBeenCalled();
                        expect(graph.addSeed).toHaveBeenCalledTimes(2);
                        expect(graph.addSeed).toHaveBeenCalledWith({"someClass": {"type": "value1", "value": "value2"}})
                        expect(graph.addSeed).toHaveBeenCalledWith({"someClass": {"type": "value3", "value": "value4"}})
                    });

                });

                describe('via the single seed interface', function() {
                    it('should create a json wrapped object and add it to the graph', function() {
                        ctrl.vertexClass = "some.java.Class";
                        ctrl.seedVertexParts = {"type": "meaningOfLife", "value": 42 }
                        ctrl.addSeeds();
                        expect(graph.addSeed).toHaveBeenCalledTimes(1);
                        expect(graph.addSeed).toHaveBeenCalledWith({"some.java.Class": {"type": "meaningOfLife", "value": 42}});
                    });
                });
            });
        });
    });

    describe('when initialised with an empty schema', function() {

        var schema;
        var $q;

        beforeEach(inject(function(_schema_, _$q_) {
            schema = _schema_;
            $q = _$q_;
        }));

        beforeEach(function() {
            spyOn(schema, 'get').and.returnValue($q.when({}));
            spyOn(schema, 'getSchemaVertices').and.returnValue(undefined);
        });

        beforeEach(function() {
            ctrl.$onInit();
        });

        describe('and when the schema resolves a value', function() {

            var types;

            beforeEach(inject(function(_types_) {
                types = _types_;
            }));

            beforeEach(function() {
                scope.$digest();
            });

            it('should handle the case when there are no schema vertices', function() {
                expect(schema.getSchemaVertices).toHaveBeenCalledTimes(1);
            });
        });
    });
});