describe('The Custom Filter Dialog Controller', function() {

    var scope, $controller, $q;
    var ctrl;
    var edgeProperties, entityProperties, schema;

    var createController = function() {
        ctrl = $controller('CustomFilterDialogController', {$scope: scope});
    }

    var createControllerWithBindings = function(bindings) {
        ctrl = $controller('CustomFilterDialogController', {$scope: scope}, bindings);
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
            var filterForEdit = {
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

            createControllerWithBindings({filterForEdit: filterForEdit});
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

    describe('$scope.search()', function() {
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

    describe('$scope.createFriendlyName()', function() {
        beforeEach(function() {
            createController();
        });

        it('should shorten a java class down to the class name', function() {
            expect(scope.createFriendlyName('java.lang.Long')).toEqual('Long');
        });
    });

    describe('$scope.getProperties()', function() {

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

        it('should call schema.getEdgeProperties() if the elementType is an edge', function() {
            scope.elementType = 'edge';
            expect(scope.getProperties()).toEqual(['prop3', 'prop4']);
            expect(schema.getEdgeProperties).toHaveBeenCalledTimes(1);
        });

        it('should throw an exception if the elementType is null', function() {
            scope.elementType = null;
            expect(scope.getProperties).toThrow('Element type can be "edge" or "entity" but not null');
            expect(schema.getEdgeProperties).not.toHaveBeenCalled();
            expect(schema.getEntityProperties).not.toHaveBeenCalled();
        });

        it('should throw an exception if the elementType is undefined', function() {
            scope.elementType = undefined;
            expect(scope.getProperties).toThrow('Element type can be "edge" or "entity" but not undefined');
            expect(schema.getEdgeProperties).not.toHaveBeenCalled();
            expect(schema.getEntityProperties).not.toHaveBeenCalled();
        });

        it('should throw an exception if the elementType is a string other than "edge" or "entity"', function() {
            scope.elementType = "An unexpected string";
            expect(scope.getProperties).toThrow('Element type can be "edge" or "entity" but not "An unexpected string"');
            expect(schema.getEdgeProperties).not.toHaveBeenCalled();
            expect(schema.getEntityProperties).not.toHaveBeenCalled();
        });

        it('should throw an exception if the elementType is an object', function() {
            scope.elementType = { foo: "bar" };
            expect(scope.getProperties).toThrow('Element type can be "edge" or "entity" but not {"foo":"bar"}');
            expect(schema.getEdgeProperties).not.toHaveBeenCalled();
            expect(schema.getEntityProperties).not.toHaveBeenCalled();
        });
    });

    describe('$scope.showWarning()', function() {

        beforeEach(function() {
            createController();
        });

        beforeEach(function() {
            scope.propertyClass = 'java.lang.Object';
        });

        beforeEach(function() {
            scope.filter.availableFunctionParameters = ['prop1', 'prop2'];
        });

        it('should return true when there are function parameters and the property is a complex object', function() {
            expect(scope.showWarning()).toBeTruthy();
        });

        it('should return false when the filter is undefined', function() {
            scope.filter = undefined;
            expect(scope.showWarning()).toBeFalsy();
        });

        it('should return false when the filters available function parameters are undefined', function() {
            scope.filter.availableFunctionParameters = undefined;
            expect(scope.showWarning()).toBeFalsy();
        });

        it('should return false when the filters available function parameters are an empty array', function() {
            scope.filter.availableFunctionParameters = [];
            expect(scope.showWarning()).toBeFalsy();
        });

        it('should return false when the propertyClass is undefined', function() {
            scope.propertyClass = undefined;
            expect(scope.showWarning()).toBeFalsy();
        });
    });

    describe('$scope.resetForm()', function() {

        var formReset = false;

        beforeEach(function() {
            createController();
        });

        beforeEach(function() {
            scope.filterForm = {
                $setUntouched: function() {
                    formReset = true;
                }
            }

            scope.filter = {
                property: 'someProperty',
                predicate: 'uk.gov.gchq.gaffer.SomePredicate',
                availableFunctionParameters: [ "property1", "property2" ],
                preAggregation: true,
                parameters: { "property1": true }
            }
        });

        beforeEach(function() {
            scope.resetForm();
        });

        it('should reset the form to an untouched state', function() {
            expect(formReset).toBeTruthy();
        });

        it('should reset the filter', function() {
            expect(scope.filter).toEqual({ preAggregation: false });
        })
    });

    describe('$scope.cancel()', function() {
        var $mdDialog;

        beforeEach(inject(function(_$mdDialog_) {
            $mdDialog = _$mdDialog_;
        }));

        beforeEach(function() {
            spyOn($mdDialog, 'cancel');
        });

        beforeEach(function() {
            createController();
        });

        it('should cancel the dialog', function() {
            scope.cancel();
            expect($mdDialog.cancel).toHaveBeenCalledTimes(1);
        });
    });

    describe('$scope.submit()', function() {

        var $mdDialog;

        beforeEach(inject(function(_$mdDialog_) {
            $mdDialog = _$mdDialog_;
        }))

        beforeEach(function() {
            createControllerWithBindings({filterForEdit: { preAggregation: true, property: 'prop', predicate: 'pred' }, elementType: 'edge', group: 'testGroup', onSubmit: function(filter, group, elementType) {
                // do nothing
            }});
        });

        it('should call the injected onSubmit function', function() {
            spyOn(scope, 'onSubmit');
            scope.submit();
            expect(scope.onSubmit).toHaveBeenCalled();
            expect(scope.onSubmit).toHaveBeenCalledWith({ preAggregation: true, property: 'prop', predicate: 'pred', parameters: {}}, 'testGroup', 'edge');
        });

        it('should hide the $mdDialog box', function() {
            spyOn($mdDialog, 'hide');
            scope.submit();
            expect($mdDialog.hide).toHaveBeenCalledTimes(1);
        });
    });

    describe('$scope.addAnother()', function() {
        beforeEach(function() {
            createControllerWithBindings({filterForEdit: { preAggregation: true, property: 'prop', predicate: 'pred' }, elementType: 'edge', group: 'testGroup', onSubmit: function(filter, group, elementType) {
                // do nothing
            }});
        });

        beforeEach(function() {
            spyOn(scope, 'resetForm');
        });

        it('should call the injected onSubmit function', function() {
            spyOn(scope, 'onSubmit');
            scope.addAnother();
            expect(scope.onSubmit).toHaveBeenCalled();
            expect(scope.onSubmit).toHaveBeenCalledWith({ preAggregation: true, property: 'prop', predicate: 'pred', parameters: {}}, 'testGroup', 'edge');
        });

        it('should reset the form', function() {
            scope.addAnother();
            expect(scope.resetForm).toHaveBeenCalledTimes(1);
        });
    });

    describe('$scope.getFlexValue()', function() {
        beforeEach(function() {
            createController();
        });

        it('should return 100 if the availableFunctionParameters length is 1', function() {
            scope.filter = { availableFunctionParameters: ["test"] };
            expect(scope.getFlexValue()).toEqual(100);
        });

        it('should return 50 if the availableFunctionParameters length is 2', function() {
            scope.filter = { availableFunctionParameters: ['test1', 'test2'] };
            expect(scope.getFlexValue()).toEqual(50);
        });

        it('should return 33 if the availableFunctionParameters length is 3', function() {
            scope.filter = { availableFunctionParameters: ['test1', 'test2', 'test3'] };
            expect(scope.getFlexValue()).toEqual(33)
        });

        it('should return 33 if the availableFunctionParameters length is greater than 3', function() {
            scope.filter = { availableFunctionParameters: ['1', '2', '3'] };

            for(var i = 4; i < 10; i++) {
                scope.filter.availableFunctionParameters.push(i.toString());
                expect(scope.getFlexValue()).toEqual(33);
            }
        });
    });

    describe('$scope.onSelectedPropertyChange()', function() {

        var functions;

        beforeEach(inject(function(_functions_, _$q_) {
            functions = _functions_;
        }));

        beforeEach(function() {
            spyOn(functions, 'getFunctions').and.callFake(function(group, property, cb) {
                cb('somePredicates');
            })
        });

        beforeEach(function() {
            createController();
        })

        it('should make a request to get the valid predicates for that property', function() {
            scope.group = 'testGroup';
            scope.filter = { property: 'prop' }
            scope.onSelectedPropertyChange();
            expect(functions.getFunctions).toHaveBeenCalledTimes(1);
            expect(functions.getFunctions).toHaveBeenCalledWith('testGroup', 'prop', jasmine.any(Function))
        });

        it('should set the value of availablePredicates', function() {
            scope.onSelectedPropertyChange();
            expect(scope.availablePredicates).toEqual('somePredicates');
        });

        it('should set the predicate value to an empty string if called without a flag', function() {
            scope.onSelectedPropertyChange();
            expect(scope.filter.predicate).toEqual('');
        });

        it('should set the predicate value to an empty string if the editModeInit flag is false', function() {
            scope.onSelectedPropertyChange(false);
            expect(scope.filter.predicate).toEqual('');
        });

        it('should leave the predicate value alone when initialising in edit mode', function() {
            scope.filter.predicate = 'an existing predicate'
            scope.onSelectedPropertyChange(true)
            expect(scope.filter.predicate).toEqual('an existing predicate');
        });
    });

    describe('$scope.onSelectedPredicateChange()', function() {

        var schema, functions;
        var gafferSchema, params;
        var $q;
        var originalFilter = {
            preAggregation: false,
            property: 'testProp',
            predicate: 'a.filter.class.Name'
        };

        beforeEach(inject(function(_functions_, _schema_, _$q_) {
            functions = _functions_;
            schema = _schema_
            $q = _$q_;
        }));

        beforeEach(function() {
            originalFilter = {
                preAggregation: false,
                property: 'testProp',
                predicate: 'a.filter.class.Name'
            };
        })

        beforeEach(function() {
            spyOn(schema, 'get').and.callFake(function() {
                return $q.when(gafferSchema);
            });

            spyOn(functions, 'getFunctionParameters').and.callFake(function(fn, callback) {
                callback(params);
            });
        });

        beforeEach(function() {
            createController();
        });

        it('should do nothing if the predicate is null', function() {
            originalFilter = {
                preAggregation: false,
                property: 'testProp',
                predicate: null
            };

            scope.filter = originalFilter;
            scope.onSelectedPredicateChange();

            scope.$digest();
            expect(schema.get).not.toHaveBeenCalled();
            expect(functions.getFunctionParameters).not.toHaveBeenCalled();

            expect(scope.filter).toEqual(originalFilter);
        });

        it('should do nothing if the predicate is an empty string', function() {
            originalFilter = {
                preAggregation: false,
                property: 'testProp',
                predicate: ''
            };

            scope.filter = originalFilter;
            scope.onSelectedPredicateChange();

            scope.$digest();
            expect(schema.get).not.toHaveBeenCalled();
            expect(functions.getFunctionParameters).not.toHaveBeenCalled();

            expect(scope.filter).toEqual(originalFilter);
        });

        it('should do nothing if the predicate is undefined', function() {
            originalFilter = {
                preAggregation: false,
                property: 'testProp',
                predicate: undefined
            };

            scope.filter = originalFilter;
            scope.onSelectedPredicateChange();

            scope.$digest();
            expect(schema.get).not.toHaveBeenCalled();
            expect(functions.getFunctionParameters).not.toHaveBeenCalled();

            expect(scope.filter).toEqual(originalFilter);
        });

        it('should query the function parameters and set a value on the filter', function() {
            params = ['param1', 'param2'];
            scope.filter = originalFilter;
            scope.onSelectedPredicateChange();
            expect(functions.getFunctionParameters).toHaveBeenCalled();
            expect(scope.filter.availableFunctionParameters).toEqual(params);
        });

        it('should set the filter parameters to an empty object', function() {
            params = ['this', 'is', 'a', 'test'];
            scope.filter = originalFilter;
            scope.onSelectedPredicateChange();
            expect(scope.filter.parameters).toEqual({});
        });

        it('should make a call to the schema service', function() {
            scope.filter = originalFilter;
            scope.onSelectedPredicateChange();
            expect(schema.get).toHaveBeenCalled();
        });

        describe('When the schema is called', function() {

            var resetSchema = function(propClass) {
                gafferSchema = {
                    "entities": {
                        "testGroup": {
                            "properties": {
                                "testProp": "testPropThing"
                            }
                        }
                    },
                    "types": {
                        "testPropThing": {
                            "class": propClass
                        }
                    }
                };
            }

            beforeEach(function() {
                scope.filter = originalFilter;
                scope.propertyClass = "an unset predicate class";
                scope.group = "testGroup";
            });

            it('should set the property class to undefined when the property is a String', function() {
                resetSchema("java.lang.String");
                scope.onSelectedPredicateChange();
                scope.$digest();
                expect(scope.propertyClass).toBeUndefined();
            });

            it('should set the property class to undefined when the property is a Boolean', function() {
                resetSchema("java.lang.Boolean");
                scope.onSelectedPredicateChange();
                scope.$digest();
                expect(scope.propertyClass).toBeUndefined();
            });

            it('should set the property class to undefined when the property is a Integer', function() {
                resetSchema("java.lang.Integer");
                scope.onSelectedPredicateChange();
                scope.$digest();
                expect(scope.propertyClass).toBeUndefined();
            });

            it('should set the property class to any other object', function() {
                resetSchema('java.lang.Object');
                scope.onSelectedPredicateChange();
                scope.$digest();
                expect(scope.propertyClass).toEqual('java.lang.Object');
            });
        })

    });


});


