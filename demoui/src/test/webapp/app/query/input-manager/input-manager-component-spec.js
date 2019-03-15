describe('The Input Manager Component', function() {
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
                    return [];
                }
            }
        });
    }));

    describe('The Controller', function() {
        var $componentController;
        var events;
        var scope;

        var ctrl;

        var createControllerWithBindings = function(bindings) {
            ctrl = $componentController('inputManager', {$scope: scope}, bindings);
        }

        beforeEach(inject(function(_$rootScope_, _$componentController_, _events_) {
            $componentController = _$componentController_;
            events = _events_;
            scope = _$rootScope_.$new();
        }));

        it('should exist', function() {
            var ctrl = $componentController('inputManager');
            expect(ctrl).toBeDefined();
        });

        describe('ctrl.$onInit()', function() {

            it('should throw an error if the model is not defined', function() {
                var ctrl = $componentController('inputManager');
                expect(ctrl.$onInit).toThrow('Input manager must be initialised with a model.');
            });


            it('should subscribe to the "onOperationUpdate event"', function() {
                spyOn(events, 'subscribe').and.stub();
                createControllerWithBindings({model: {}});
                ctrl.$onInit();
                expect(events.subscribe).toHaveBeenCalledWith('onOperationUpdate', jasmine.any(Function));
            });

            it('should set the usePrevious flag to true if the initial value for the input is null', function() {
                createControllerWithBindings({model: {input: null}});
                ctrl.$onInit();
                expect(ctrl.usePreviousOutput).toBeTruthy();
            });

            it('should set the usePrevious flag to false if the initial value for the input is an array', function() {
                createControllerWithBindings({model: {input: []}});
                ctrl.$onInit();
                expect(ctrl.usePreviousOutput).toBeFalsy();
            });
        });

        describe('ctrl.onCheckboxChange()', function() {
            beforeEach(function() {
                createControllerWithBindings({model: {}});
            });

            it('should set the inputs to empty arrays if the usePrevious flag is false', function() {
                ctrl.usePreviousOutput = false;
                ctrl.onCheckboxChange();
                expect(ctrl.model.input).toEqual([]);
                expect(ctrl.model.inputPairs).toEqual([]);
            });

            it('should set the inputs to null values if the usePreviousFlag is true', function() {
                ctrl.usePreviousOutput = true;
                ctrl.onCheckboxChange();
                expect(ctrl.model.input).toEqual(null);
                expect(ctrl.model.inputPairs).toEqual(null);
            });
        });

        describe('ctrl.useResults()', function() {
            var schema, results, types;
            var $q;

            var testResults;

            beforeEach(inject(function(_schema_, _$q_, _results_, _types_) {
                schema = _schema_;
                $q = _$q_;
                results = _results_;
                types = _types_;
            }));

            beforeEach(function() {
                spyOn(schema, 'get').and.returnValue($q.when({
                    types: {
                        'string': {
                            class: 'java.lang.String'
                        }
                    }
                }));

                spyOn(schema, 'getSchemaVertices').and.returnValue([
                    'string',
                    'string'
                ]);

                spyOn(results, 'get').and.callFake(function() {
                    return testResults;
                });

                spyOn(types, 'createParts').and.callFake(function(clazz, value) {
                    return {undefined: value}   // mocking the type service behaviour for strings
                });
            });

            beforeEach(function() {
                createControllerWithBindings({model: {input: []}});
            })

            it('should add the vertex of entities', function() {
                testResults = {
                    entities: [
                        {
                            'vertex': 'a'
                        },
                        {
                            'vertex': 'b'
                        }
                    ]
                };

                ctrl.useResults();
                scope.$digest();
                expect(ctrl.model.input).toEqual([
                    {
                        valueClass: 'java.lang.String',
                        parts: {
                            undefined: 'a'
                        }
                    },
                    {
                        valueClass: 'java.lang.String',
                        parts: {
                            undefined: 'b'
                        }
                    }
                ]);

            });

            it('should use the source and destination of edges', function() {
                testResults = {
                    edges: [
                        {
                            source: 'a',
                            destination: 'b'
                        },
                        {
                            source: 'c',
                            destination: 'd'
                        }
                    ]
                }

                ctrl.useResults();
                scope.$digest();
                expect(ctrl.model.input).toEqual([
                    {
                        valueClass: 'java.lang.String',
                        parts: {undefined: 'a'}
                    },
                    {
                        valueClass: 'java.lang.String',
                        parts: {undefined: 'b'}
                    },
                    {
                        valueClass: 'java.lang.String',
                        parts: {undefined: 'c'}
                    },
                    {
                        valueClass: 'java.lang.String',
                        parts: {undefined: 'd'}
                    }
                ]);
            });

            it('should use entity seeds discovered in other', function() {
                testResults = {
                    other: [
                        {
                            class: 'some.other.Object',
                            property: 'irrelevantProperty'
                        },
                        {
                            class: 'not.a.entity.Seed',
                            vertex: 'unused'
                        },
                        {
                            class: undefined,
                            vertex: null
                        },
                        {
                            class: 'uk.gov.gchq.gaffer.operation.data.EntitySeed',
                            vertex: 'test'
                        }
                    ]
                }

                ctrl.useResults();
                scope.$digest();

                expect(ctrl.model.input).toEqual([
                    {
                        valueClass: 'java.lang.String',
                        parts: {
                            undefined: 'test'
                        }
                    }
                ]);
            });

            it('should not add duplicate values', function() {
                testResults = {
                    entities: [
                        {
                            vertex: 'a'
                        }
                    ],
                    edges: [
                        {
                            source: 'a',
                            destination: 'b',
                        },
                        {
                            source: 'b',
                            destination: 'c'
                        }
                    ],
                    other: [
                        {
                            class: 'uk.gov.gchq.gaffer.operation.data.EntitySeed',
                            vertex: 'a'
                        },
                        {
                            class: 'uk.gov.gchq.gaffer.operation.data.EntitySeed',
                            vertex: 'd'
                        }
                    ]
                }

                ctrl.useResults();
                scope.$digest();

                expect(ctrl.model.input).toEqual([
                    {
                        valueClass: 'java.lang.String',
                        parts: {
                            undefined: 'a'
                        }
                    },
                    {
                        valueClass: 'java.lang.String',
                        parts: {
                            undefined: 'b'
                        }
                    },
                    {
                        valueClass: 'java.lang.String',
                        parts: {
                            undefined: 'c'
                        }
                    },
                    {
                        valueClass: 'java.lang.String',
                        parts: {
                            undefined: 'd'
                        }
                    }
                ]);
            });

            it('should not add values which already exist in the input', function() {
                testResults = {
                    entities: [
                        {
                            'vertex': 'a'
                        },
                        {
                            'vertex': 'b'
                        }
                    ]
                };

                ctrl.model.input = [
                    {
                        valueClass: 'java.lang.String',
                        parts: {
                            undefined: 'a'
                        }
                    }
                ];

                ctrl.useResults();
                scope.$digest();

                expect(ctrl.model.input).toEqual([
                    {
                        valueClass: 'java.lang.String',
                        parts: {
                            undefined: 'a'
                        }
                    },
                    {
                        valueClass: 'java.lang.String',
                        parts: {
                            undefined: 'b'
                        }
                    }
                ]);
            });
        });
    });
});
