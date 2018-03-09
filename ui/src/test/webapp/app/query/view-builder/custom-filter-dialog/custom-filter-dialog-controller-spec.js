describe('The Custom Filter Dialog Controller', function() {

    var scope, $controller, $q, functions;
    var ctrl;
    var functions
    var functionParams, edgeProperties, entityProperties, gafferSchema;

    var createController = function() {
        ctrl = $controller('CustomFilterDialogController', {$scope: scope});
        scope.$digest();
    }

    var createControllerWithBindings = function(bindings) {
        ctrl = $controller('CustomFilterDialogController', {$scope: scope}, bindings);
        scope.$digest();
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
                    return $q.when(gafferSchema);
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


    beforeEach(inject(function(_$rootScope_, _$controller_, _$q_, _functions_,_schema_) {
        $q = _$q_;
        $controller = _$controller_;
        scope = _$rootScope_.$new();
        functions = _functions_;
        gafferSchema = {entities:{}, edges:{}, types:{}};
        functionParams = ['value', 'orEqualTo'];
        schema = _schema_;
    }));

    beforeEach(function() {
        spyOn(functions, 'getFunctionParameters').and.callFake(function(unusedName, callback) {
            callback(functionParams);
        });
    });

    describe('on startup', function() {

        beforeEach(function() {
            createController();
        });

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

        beforeEach(function() {
            functionParams = {'value': 'java.lang.Iterable', 'orEqualTo': 'boolean', 'anObjectProperty': 'java.lang.Object'};

            spyOn(functions, 'getFunctions').and.returnValue($q.when(["a.koryphe.predicate.Class"]));
        });

        beforeEach(function() {
            spyOn(schema, 'get').and.returnValue($q.when({
                "entities": {
                    "test": {
                        "properties": {
                            "aProperty": "long"
                        }
                    }
                },
                "types": {
                    "long": {
                        "class": "java.lang.Long"
                    }
                }
            }));
        });

        beforeEach(function() {
            var filterForEdit = {
                someUnrelatedField: "notRelevant",
                preAggregation: true,
                property: "aProperty",
                predicate: "a.koryphe.predicate.Class",
                parameters: {
                    "value": { valueClass: 'java.lang.Integer', parts: {undefined: 42}},
                    "orEqualTo": { valueClass: 'boolean', parts: {undefined: false}},
                    "aStringProperty": { valueClass: 'java.lang.String', parts: {undefined: "test"}},
                    "anObjectProperty": { valueClass: 'JSON', parts: {undefined: '{"java.lang.Long": 123}'}}
                }
            }

            createControllerWithBindings({filterForEdit: filterForEdit, group: "test", elementType: "entity"});
            scope.$digest();
        });


        it('should set the preAggregation field', function() {
            expect(scope.filter.preAggregation).toBeTruthy();
        });

        it('should set the filter predicate', function() {
            expect(scope.filter.predicate).toBeDefined();
            expect(scope.filter.predicate).toEqual('a.koryphe.predicate.Class');
        });

        it('should set the available parameters', function() {
            expect(functions.getFunctionParameters).toHaveBeenCalledTimes(1);
            expect(scope.filter.availableFunctionParameters).toEqual({'value': 'java.lang.Iterable', 'orEqualTo': 'boolean', 'anObjectProperty': 'java.lang.Object'});
        });

        it('should set the parameters and delete irrelevant ones', function() {
            scope.$digest();
            expect(scope.filter.parameters.value).toEqual({ valueClass: 'java.lang.Integer', parts: {undefined: 42}});
            expect(scope.filter.parameters.orEqualTo).toEqual({ valueClass: 'boolean', parts: {undefined: false}});
            expect(scope.filter.parameters.anObjectProperty).toEqual({ valueClass: 'JSON', parts: {undefined: '{"java.lang.Long": 123}'}});
            expect(scope.filter.parameters.aStringProperty).toBeUndefined();
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
        var types;

        beforeEach(inject(function(_$mdDialog_, _types_) {
            $mdDialog = _$mdDialog_;
            types = _types_;
        }));

        beforeEach(function() {
            spyOn(types, 'isKnown').and.returnValue(true);
            spyOn(functions, 'getFunctions').and.returnValue(['pred']);
        });

        beforeEach(function() {
            gafferSchema = {
                'entities': {
                    'testGroup': {
                        'properties':{
                            'prop': 'propType'
                        }
                    }
                },
                'types': {
                    'propType': {
                        'class': 'java.lang.String'
                    }
                }
            }
        });


        beforeEach(function() {
            createControllerWithBindings({filterForEdit: { preAggregation: true, property: 'prop', predicate: 'pred' }, elementType: 'edge', group: 'testGroup', onSubmit: function(filter, group, elementType) {
                // do nothing
            }});
        });

        it('should call the injected onSubmit function', function() {
            spyOn(scope, 'onSubmit');
            scope.submit();
            expect(scope.onSubmit).toHaveBeenCalled();
        });

        it('should hide the $mdDialog box', function() {
            spyOn($mdDialog, 'hide');
            scope.submit();
            expect($mdDialog.hide).toHaveBeenCalledTimes(1);
        });
    });

    describe('$scope.addAnother()', function() {

        var types;

        beforeEach(inject(function(_types_) {
            types = _types_;
        }));

        beforeEach(function() {
            spyOn(types, 'isKnown').and.returnValue(true);
            spyOn(functions, 'getFunctions').and.returnValue(['pred']);
        });

        beforeEach(function() {
            gafferSchema = {
                'entities': {
                    'testGroup': {
                        'properties':{
                            'prop': 'propType'
                        }
                    }
                },
                'types': {
                    'propType': {
                        'class': 'java.lang.String'
                    }
                }
            }
        });

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
        });

        it('should reset the form', function() {
            scope.addAnother();
            expect(scope.resetForm).toHaveBeenCalledTimes(1);
        });
    });

    describe('$scope.getFlexValue()', function() {
        var types;
        var known;

        beforeEach(inject(function(_types_) {
            types = _types_;
        }));

        beforeEach(function() {
            createController();
        });

        beforeEach(function() {
            known = false;
        })

        beforeEach(function() {
            spyOn(types, 'isKnown').and.callFake(function(valueClass) {
                return known;
            })
        })

        it('should return 50 if the class is known to the type service', function() {
            known = true;
            expect(scope.getFlexValue('aKnownClass')).toEqual(50);
        });

        it('should return 100 if the class is unknown to the type service', function() {
            known = false;
            expect(scope.getFlexValue('anUnknownClass')).toEqual(100);
        });
    });

    describe('$scope.availableTypes()', function() {
        var types;
        var known;

        var simpleClassNames;

        beforeEach(inject(function(_types_) {
            types = _types_;
        }));

        beforeEach(createController)

        beforeEach(function() {
            known = false;
            simpleClassNames = {
                'Long': 'java.lang.Long',
                'Boolean': 'java.lang.Boolean',
                'boolean': 'boolean',
                'integer': 'integer'
            }
        })

        beforeEach(function() {
            spyOn(types, 'isKnown').and.callFake(function() {
                return known;
            });

            spyOn(types, 'getSimpleClassNames').and.callFake(function() {
                return simpleClassNames;
            });
        });

        it('should return a single key and value if the class is known', function() {
            known = true;
            expect(scope.availableTypes('java.lang.Integer')).toEqual({'Integer': 'java.lang.Integer'});
        });

        it('should return all the simple class names with primitives removed', function() {
            known = false;
            expect(scope.availableTypes('java.lang.Iterable')).toEqual({
                'Long': 'java.lang.Long',
                'Boolean': 'java.lang.Boolean'
            });
        });
    });

    describe('$scope.updateType()', function() {

        var fields;
        var types;

        beforeEach(createController);

        beforeEach(inject(function(_types_) {
            types = _types_;
        }));

        beforeEach(function() {
            spyOn(types, 'getFields').and.callFake(function(clazz) {
                return fields;
            })
        })

        it('should do nothing if the parameter is undefined', function() {
            var param = undefined;
            scope.updateType(param);

            expect(param).toBeUndefined();
        });

        it('should do nothing if the parameters is null', function() {
            var param = null;
            scope.updateType(param);

            expect(param).toBeNull();
        });

        it('should make the parts of the parameter an empty object if it is initially undefined', function() {
            var param = {};
            scope.updateType(param);
            expect(param.parts).toEqual({});
        });

        it('should make the parts of the parameter an empty object if they were initially a complex object', function() {
            var param = { parts: {'type': 'foo', 'value': 'bar'}};
            scope.updateType(param);
            expect(param.parts).toEqual({});
        });

        it('should make the parts of the parameter an empty object if they are keyed by anything other than undefined', function() {
            var param = { parts: {'foo': 'bar'}};
            scope.updateType(param);
            expect(param.parts).toEqual({});
        });

        it('should do nothing if the parts were originally a number indexed by undefined and are still a number indexed by undefined', function() {
            var param = {parts: {undefined: 42}};


            // the new type
            fields = [
                {
                    'type': 'number'
                }
            ];

            scope.updateType(param);
            expect(param.parts).toEqual({undefined: 42});
        });

        it('should do nothing if the parts were originally a string and the new type is text', function() {
            var param = {parts: {undefined: 'test'}};

            // the new type
            fields = [
                {
                    'type': 'text'
                }
            ];

            scope.updateType(param);
            expect(param.parts).toEqual({undefined: 'test'});
        });

        it('should do nothing if the parts were originally a string and the new type is textarea', function() {
            var param = {parts: {undefined: 'test'}};

            // the new type
            fields = [
                {
                    'type': 'textarea'
                }
            ];

            scope.updateType(param);
            expect(param.parts).toEqual({undefined: 'test'});
        });

        it('should reset the parts if the parts were originally a string, but the new type is a number', function() {
            var param = {parts: {undefined: 'test'}};

            // the new type
            fields = [
                {
                    'type': 'number'
                }
            ];

            scope.updateType(param);
            expect(param.parts).toEqual({});
        });

        it('should reset the parts if the new type has more than one field', function() {
            var param = {parts: {undefined: 'test'}};

            // the new type
            fields = [
                {
                    'type': 'text'
                },
                {
                    'type': 'text'
                },
                {
                    'type': 'text'
                }
            ];

            scope.updateType(param);
            expect(param.parts).toEqual({});
        });
    });

    describe('$scope.hasMultipleTypesAvailable()', function() {
        var types;

        beforeEach(inject(function(_types_) {
            types = _types_;
        }));

        beforeEach(createController)

        it('should return true if the type is not known to the type service', function() {
            spyOn(types, 'isKnown').and.returnValue(false);
            expect(scope.hasMultipleTypesAvailable('a.java.Class')).toBeTruthy();
        });

        it('should return false if the type is known to the type service', function() {
            spyOn(types, 'isKnown').and.returnValue(true);
            expect(scope.hasMultipleTypesAvailable('a.java.Class')).toBeFalsy();
        });
    });

    describe('$scope.onSelectedPropertyChange()', function() {

        var schema;

        beforeEach(inject(function(_schema_) {
            schema = _schema_;
        }));


        beforeEach(function() {
            spyOn(functions, 'getFunctions').and.callFake(function(clazz, cb) {
                cb('somePredicates');
            });

            spyOn(console, 'error').and.stub();
        });

        beforeEach(function() {
            spyOn(schema, 'get').and.returnValue($q.when({
                "edges": {
                    "testGroup": {
                        "properties": {
                            "prop1": "unknown.type",
                            "prop2": "known.type"
                        }
                    }
                },
                "entities": {},
                 "types": {
                    "known.type": {
                        "class": "a.java.Class"
                    }
                }
            }));
        });

        beforeEach(function() {
            createController();
            scope.$digest();
        });

        it('should not get the functions if the group is null', function() {
            scope.group = null;
            scope.filter = { property: "not null"};
            scope.onSelectedPropertyChange();
            expect(functions.getFunctions).not.toHaveBeenCalled();
        });

        it('should not get the functions if the group is undefined', function() {
            scope.group = undefined;
            scope.filter = { property: "property"};
            scope.onSelectedPropertyChange();
            expect(functions.getFunctions).not.toHaveBeenCalled();
        });

        it('should not get the functions if the property is null', function() {
            scope.group = "group";
            scope.filter = { property: null};
            scope.onSelectedPropertyChange();
            expect(functions.getFunctions).not.toHaveBeenCalled();
        });

        it('should not get the functions if the property is undefined', function() {
            scope.group = "group";
            scope.filter = {};
            scope.onSelectedPropertyChange();
            scope.$digest();
            expect(functions.getFunctions).not.toHaveBeenCalled();
        });

        it('should not make call to service if the type does not exist in the schema', function() {
            scope.group = 'testGroup';
            scope.filter = { property: 'prop1'};
            scope.onSelectedPropertyChange();
            scope.$digest();
            expect(functions.getFunctions).not.toHaveBeenCalled();
            expect(console.error).toHaveBeenCalledWith('No type "unknown.type" was found in the schema');
        });

        it('should send an error to the console if the group does not exist in the schema', function() {
            scope.group = 'unknownGroup';
            scope.filter = { property: 'prop'};
            scope.onSelectedPropertyChange();
            scope.$digest();
            expect(functions.getFunctions).not.toHaveBeenCalled();
            expect(console.error).toHaveBeenCalledWith('The element group "unknownGroup" does not exist in the schema');
        });

        it('should send an error to the console if the group does not contain the property', function() {
            scope.group = 'testGroup';
            scope.filter = { property: 'unknownProperty'};
            scope.onSelectedPropertyChange();
            scope.$digest();
            expect(functions.getFunctions).not.toHaveBeenCalled();
            expect(console.error).toHaveBeenCalledWith('The property "unknownProperty" does not exist in the element group "testGroup"');
        });

        // sunny day tests

        it('should make a request to get the valid predicates for that property', function() {
            scope.group = 'testGroup';
            scope.filter = { property: 'prop2' }
            scope.onSelectedPropertyChange();
            scope.$digest();
            expect(functions.getFunctions).toHaveBeenCalledTimes(1);
            expect(functions.getFunctions).toHaveBeenCalledWith('a.java.Class', jasmine.any(Function))
        });

        it('should set the value of availablePredicates', function() {
            scope.group = 'testGroup';
            scope.filter = { property: 'prop2' };
            scope.onSelectedPropertyChange();
            scope.$digest();
            expect(scope.availablePredicates).toEqual('somePredicates');
        });

        it('should set the predicate value to an empty string if called without a flag', function() {
            scope.onSelectedPropertyChange();
            scope.$digest();
            expect(scope.filter.predicate).toEqual('');
        });

        it('should set the predicate value to an empty string if the editModeInit flag is false', function() {
            scope.onSelectedPropertyChange(false);
            scope.$digest();
            expect(scope.filter.predicate).toEqual('');
        });

        it('should leave the predicate value alone when initialising in edit mode', function() {
            scope.filter.predicate = 'an existing predicate'
            scope.onSelectedPropertyChange(true)
            scope.$digest();
            expect(scope.filter.predicate).toEqual('an existing predicate');
        });
    });

    describe('$scope.onSelectedPredicateChange()', function() {

        var types, schema;
        var originalFilter = {
            preAggregation: false,
            property: 'testProp',
            predicate: 'a.filter.class.Name'
        };

        known = false;

        beforeEach(inject(function(_types_, _schema_) {
            types = _types_;
            schema = _schema_;
        }));

        beforeEach(function() {
            spyOn(schema, 'get').and.returnValue($q.when({
                "edges": {
                    "testGroup": {
                        "properties": {
                            "testProp": "known.type"
                        }
                    }
                },
                "entities": {},
                 "types": {
                    "known.type": {
                        "class": "a.java.Class"
                    },
                    "testProp": {
                        "class": "java.lang.Long"
                    }
                }
            }));
        });

        beforeEach(function() {
            createController();
            scope.$digest();
        });

        beforeEach(function() {
            originalFilter = {
                preAggregation: false,
                property: 'testProp',
                predicate: 'a.filter.class.Name'
            };

            scope.group = 'testGroup'

            known = false;
        });

        beforeEach(function() {
            spyOn(types, 'isKnown').and.callFake(function(valueClass) {
                return known;
            })
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
            expect(functions.getFunctionParameters).not.toHaveBeenCalled();
            expect(scope.filter).toEqual(originalFilter);
        });

        it('should query the function parameters and set a value on the filter', function() {
            functionParams= {'param1': 'java.lang.String', 'param2': 'long'};
            scope.filter = originalFilter;
            scope.onSelectedPredicateChange();
            expect(functions.getFunctionParameters).toHaveBeenCalled();
            expect(scope.filter.availableFunctionParameters).toEqual(functionParams);
        });

        it('should set the filter parameters to objects with valueClasses', function() {
            functionParams = {'this': 'boolean', 'is': 'java.lang.String', 'a': 'java.lang.Long', 'test': 'java.lang.Iterable'};
            scope.filter = originalFilter;
            scope.onSelectedPredicateChange();
            expect(scope.filter.parameters).toEqual({'this': {'valueClass': 'a.java.Class'}, 'is': {'valueClass': 'a.java.Class'}, 'a': {'valueClass': 'a.java.Class'}, 'test': {'valueClass': 'a.java.Class'}});
        });

        it('should set the parameter valueClass if the class returned by gaffer is known to the type service', function() {
            scope.filter = originalFilter;
            functionParams = {'test': 'java.lang.Long'}
            known = true;
            scope.onSelectedPredicateChange();
            expect(scope.filter.parameters['test']['valueClass']).toEqual('java.lang.Long')
        });

        it('should set the parameter valueClass to the property class if the class returned by gaffer is not known to the type service', function() {
            scope.filter = originalFilter;
            scope.group = 'testGroup';
            functionParams = {'test': 'java.lang.Iterable'};
            known = false;

            scope.onSelectedPredicateChange();
            scope.$digest();
            expect(scope.filter.parameters['test'].valueClass).toEqual('a.java.Class');
        });
    });

    describe('$scope.getPropertySelectLabel()', function() {
        beforeEach(function() {
            createController();
        });

        it('should return filter property when it exists', function() {
            scope.filter = {'property': 'prop1'};
            var label = scope.getPropertySelectLabel();
            expect(label).toEqual('prop1');
        });

        it('should return placeholder when when filter property does not exist', function() {
            scope.filter = {'property': ''};
            var label = scope.getPropertySelectLabel();
            expect(label).toEqual('Select a property');
        });
    });
});
