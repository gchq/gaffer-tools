describe('The Query component', function() {

    var ctrl;

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
                }
            }
        });
    }));

    describe('Controller', function() {
        var $componentController;
        var queryPage, query, loading, graph, settings;

        beforeEach(inject(function(_$componentController_, _queryPage_, _query_, _loading_, _graph_, _settings_, _navigation_) {
            $componentController = _$componentController_;
            queryPage = _queryPage_;
            query = _query_;
            loading = _loading_;
            graph = _graph_;
            settings = _settings_;
        }));

        beforeEach(function() {
            ctrl = $componentController('query');
        })

        beforeEach(function() {
            ctrl.queryForm = {
                $valid : true
            }
        })

        it('should exist', function() {
            expect(ctrl).toBeDefined();
        });

        it('should expose the getSelectedOperation of the queryPage service', function() {
            spyOn(queryPage, 'getSelectedOperation');
            ctrl.getSelectedOp();
            expect(queryPage.getSelectedOperation).toHaveBeenCalledTimes(1);
        });

        describe('When validating the query', function() {
            var valid;
            var selectedOperation;

            beforeEach(function() {
                ctrl.queryForm = {
                    $valid: valid
                };
            });

            beforeEach(function() {
                valid = true;
            });

            beforeEach(function() {
                spyOn(queryPage, 'getSelectedOperation').and.callFake(function() {
                    return selectedOperation;
                });
            });

            beforeEach(function() {
                selectedOperation = "some operation"
            });

            it('should not allow execution if the form is invalid', function() {
                valid = false
                expect(ctrl.canExecute()).toBeFalsy();
            });

            it('should not allow execution if the selected operation is defined but results are loading', function() {
                valid = true;
                loading.load();

                expect(ctrl.canExecute()).toBeFalsy();
            });

            it('should allow execution if the selected operation is defined and the loading completes', function() {
                valid = true;

                loading.load();
                loading.finish();
                expect(ctrl.canExecute()).toBeTruthy();
            });

            it('should allow execution if the selected operation is defined and loading has not started', function() {
                valid = true;
                expect(ctrl.canExecute()).toBeTruthy();

            });
        });


        it('should execute the operation', function() {
            spyOn(query, 'execute');
            spyOn(queryPage, 'getSelectedOperation').and.returnValue({
                class: 'some.class.Name'
            });

            ctrl.execute();

            expect(query.execute).toHaveBeenCalledTimes(1);

        });

        describe('when building up the operation', function() {

            describe('when adding views', function() {

                var view;
                var types;

                beforeEach(inject(function(_view_, _types_) {
                    view = _view_;
                    types = _types_;
                }));

                it('should create a basic view from the view edges and entities', function() {

                    spyOn(view, 'getViewEntities').and.returnValue(['elementGroup1','elementGroup2','elementGroup3']);
                    spyOn(view, 'getViewEdges').and.returnValue(['edge1','edge2']);

                    spyOn(queryPage, 'getSelectedOperation').and.returnValue({
                        class: 'some.operation.with.View',
                        view: true
                    });

                    spyOn(query, 'execute');

                    ctrl.execute();

                    var entities =  {
                        'elementGroup1': {},
                        'elementGroup2': {},
                        'elementGroup3': {}
                    }

                    var edges = {
                        'edge1': {},
                        'edge2': {}
                    }

                    expect(JSON.stringify(query.execute.calls.argsFor(0)[0])).toContain(JSON.stringify(entities));
                    expect(JSON.stringify(query.execute.calls.argsFor(0)[0])).toContain(JSON.stringify(edges));

                });

                it('should create gaffer filters from the elementFilters', function() {

                    spyOn(queryPage, 'getSelectedOperation').and.returnValue({
                        class: 'some.operation.with.View',
                        view: true
                    });

                    spyOn(types, 'isKnown').and.callFake(function(clazz) {
                        if (clazz === 'java.lang.Comparable') {
                            return false;
                        } else if (clazz === 'boolean') {
                            return true;
                        } else {
                            throw Error('Unexpected class' + clazz);
                        }
                    });

                    spyOn(types, 'createJsonValue').and.callFake(function(valueClass, parts) {
                        var value = {};

                        value[valueClass] = parts[undefined];
                        return value;
                    });



                    spyOn(view, 'getViewEdges').and.returnValue(['a']);
                    spyOn(view, 'getEdgeFilters').and.returnValue({
                        'a': [
                            {
                                preAggregation: true,
                                predicate: 'some.koryphe.Predicate',
                                property: 'b',
                                parameters: {
                                    'value': {
                                        'valueClass': 'java.lang.Long',
                                        'parts': {
                                            undefined: 205
                                        }
                                    }
                                },
                                availableFunctionParameters: {'value': 'java.lang.Comparable', 'orEqualTo': 'boolean'}
                            }
                        ]
                    });


                    spyOn(query, 'execute');

                    var expectedView = {
                        'a': {
                            preAggregationFilterFunctions: [
                                {
                                    'predicate': {
                                        class: 'some.koryphe.Predicate',
                                        value: {
                                            'java.lang.Long': 205
                                        }
                                    },
                                    'selection': [ 'b' ]
                                }
                            ]
                        }
                    }

                    ctrl.execute();

                    expect(JSON.stringify(query.execute.calls.argsFor(0)[0])).toContain(JSON.stringify(expectedView));
                });

                it('should add the group-by to the operation', function() {
                    spyOn(queryPage, 'getSelectedOperation').and.returnValue({
                        class: 'operation.class.Name',
                        view: true
                    });

                    spyOn(query, 'execute');

                    ctrl.execute();

                    expect(JSON.stringify(query.execute.calls.first().args[0])).toContain('"groupBy":[]');
                });
            });

            describe('When adding Named views', function() {

                var view;

                beforeEach(inject(function(_view_) {
                    view = _view_;
                }));

                beforeEach(function() {
                    spyOn(view, 'getViewEntities').and.returnValue(['elementGroup1','elementGroup2','elementGroup3']);
                    spyOn(view, 'getViewEdges').and.returnValue(['edge1','edge2']);

                    spyOn(query, 'execute');

                    spyOn(queryPage, 'getSelectedOperation').and.returnValue({
                        class: 'some.operation.with.View',
                        view: true
                    });
                });

                it('should do nothing if the named views are undefined', function() {
                    view.setNamedViews(undefined);
                    ctrl.execute();
                    expect(JSON.stringify(query.execute.calls.first().args[0])).not.toContain('views');
                });

                it('should do nothing if the named views are undefined', function() {
                    view.setNamedViews(null);
                    ctrl.execute();
                    expect(JSON.stringify(query.execute.calls.first().args[0])).not.toContain('views');
                });

                it('should do nothing if the named views are an empty array', function() {
                    view.setNamedViews([]);
                    ctrl.execute();
                    expect(JSON.stringify(query.execute.calls.first().args[0])).not.toContain('views');
                });

                it('should add the preExisting view to the views array', function() {
                    view.setNamedViews([{name: "test"}]);
                    ctrl.execute();

                    var entities =  {
                        'elementGroup1': {},
                        'elementGroup2': {},
                        'elementGroup3': {}
                    }

                    var edges = {
                        'edge1': {},
                        'edge2': {}
                    }

                    expect(JSON.stringify(query.execute.calls.argsFor(0)[0])).toContain(JSON.stringify(entities));
                    expect(JSON.stringify(query.execute.calls.argsFor(0)[0])).toContain(JSON.stringify(edges));


                    expect(JSON.stringify(query.execute.calls.first().args[0])).toContain('views');
                    expect(JSON.stringify(query.execute.calls.first().args[0])).not.toContain('view:');
                });

                it('should add named views with parameters', function() {

                    view.setNamedViews([{"name": "namedView1", "parameters":{ "testParam": { "parts": { "value": 42}}}}]);

                    ctrl.execute();


                    var namedView = JSON.stringify({
                        "class": "uk.gov.gchq.gaffer.data.elementdefinition.view.NamedView",
                        "name": "namedView1",
                        "parameters": {
                            "testParam": 42
                        }
                    });

                    expect(JSON.stringify(query.execute.calls.first().args[0])).toContain(namedView)

                });

                it('should not add blank parameters in named views left blank if they are not required', function() {

                    view.setNamedViews([{
                        name: 'test',
                        parameters: { "testParam": {
                                valueClass: "java.lang.Long",
                                required: false,
                                parts: {
                                    "value": ""
                                }
                            }
                        }
                    }]);

                    var unExpected = JSON.stringify({"testParam": "" });

                    ctrl.execute();

                    expect(JSON.stringify(query.execute.calls.first().args[0])).not.toContain(unExpected);
                });

                it('should add blank parameters into named views if the parameter is marked required', function() {
                    view.setNamedViews([{
                        name: 'test',
                        parameters: { "testParam": {
                                valueClass: "java.lang.Long",
                                required: true,
                                parts: {
                                    "value": ""
                                }
                            }
                        }
                    }]);

                    var expected = JSON.stringify({"testParam": "" });

                    ctrl.execute();

                    expect(JSON.stringify(query.execute.calls.first().args[0])).toContain(expected);
                });

                it('should not allow null parameters in named views if they are not required', function() {
                    view.setNamedViews([{
                        name: 'test',
                        parameters: { "testParam": {
                                valueClass: "java.lang.Long",
                                required: false,
                                parts: {
                                    "value": null
                                }
                            }
                        }
                    }]);

                    var unExpected = JSON.stringify({"testParam": null });

                    ctrl.execute();

                    expect(JSON.stringify(query.execute.calls.first().args[0])).not.toContain(unExpected);
                });

                it('should add null parameters if the parameter is marked required', function() {
                    view.setNamedViews([{
                        name: 'test',
                        parameters: { "testParam": {
                                valueClass: "java.lang.Long",
                                required: true,
                                parts: {
                                    "value": null
                                }
                            }
                        }
                    }]);

                    var expected = JSON.stringify({"testParam": null });

                    ctrl.execute();

                    expect(JSON.stringify(query.execute.calls.first().args[0])).toContain(expected);
                });
            });

            describe('When adding date ranges', function() {

                var dateRange;
                var startDate, endDate;
                var types;

                beforeEach(inject(function(_dateRange_, _types_) {
                    dateRange = _dateRange_;
                    types = _types_;
                }));

                beforeEach(function() {
                    spyOn(queryPage, 'getSelectedOperation').and.returnValue({
                        class: 'operationClass',
                        view: true
                    });

                    spyOn(types, 'createJsonValue').and.callFake(function(valueClass, value) {
                        var json = {};
                        json[valueClass] = value;

                        return json;
                    });

                    spyOn(dateRange, 'getStartDate').and.callFake(function() {
                        return startDate;
                    });

                    spyOn(dateRange, 'getEndDate').and.callFake(function() {
                        return endDate;
                    });

                    spyOn(query, 'execute');
                });

                beforeEach(function() {
                    startDate = undefined;
                    endDate = undefined;
                });

                it('should add no date range if neither start or end date is specified', function() {
                    ctrl.execute();
                    expect(JSON.stringify(query.execute.calls.first().args[0])).not.toContain('startDate');
                    expect(JSON.stringify(query.execute.calls.first().args[0])).not.toContain('endDate');
                });

                it('should add no date filter if the start and end date is null', function() {
                    startDate = null;
                    endDate = null;
                    ctrl.execute();
                    expect(JSON.stringify(query.execute.calls.first().args[0])).not.toContain('startDate');
                    expect(JSON.stringify(query.execute.calls.first().args[0])).not.toContain('endDate');
                });

                it('should add a start date with an IsMoreThan filter', function() {
                    startDate = 1234567890;
                    ctrl.timeConfig = {
                        filter: {
                            class: "startDateClass",
                            startProperty: "startDateProperty"
                        }
                    };

                    ctrl.execute();

                    var expectedFilterFunctions = {
                        "preAggregationFilterFunctions": [
                            {
                                predicate: {
                                    class: 'uk.gov.gchq.koryphe.impl.predicate.IsMoreThan',
                                    orEqualTo: true,
                                    value: { "startDateClass": 1234567890 }
                                },
                                selection: [
                                    'startDateProperty'
                                ]
                            }
                        ]
                    }
                    expect(JSON.stringify(query.execute.calls.first().args[0])).toContain(JSON.stringify(expectedFilterFunctions));

                });

                it('should add an endDate with an IsLessThan filter', function() {
                    endDate = 1234567890;
                    ctrl.timeConfig = {
                        filter: {
                            class: "endDateClass",
                            endProperty: "endDateProperty"
                        }
                    };

                    ctrl.execute();

                    var expectedFilterFunctions = {
                        "preAggregationFilterFunctions": [
                            {
                                predicate: {
                                    class: 'uk.gov.gchq.koryphe.impl.predicate.IsLessThan',
                                    orEqualTo: true,
                                    value: { "endDateClass": 1234567890 }
                                },
                                selection: [
                                    'endDateProperty'
                                ]
                            }
                        ]
                    }
                    expect(JSON.stringify(query.execute.calls.first().args[0])).toContain(JSON.stringify(expectedFilterFunctions));

                });
            });

            describe('When adding parameters', function() {

                it('should add parameters to named operations', function() {
                    spyOn(queryPage, 'getSelectedOperation').and.returnValue({
                        class: 'named.operation.class.Name',
                        name: 'test',
                        namedOp: true,
                        parameters: { "testParam": {
                                valueClass: "java.lang.Long",
                                parts: {
                                    "value": 42
                                }
                            }
                        }
                    });

                    spyOn(query, 'execute');

                    ctrl.execute();


                    var expectedParameters = JSON.stringify({
                        "testParam": 42
                    });


                    expect(JSON.stringify(query.execute.calls.first().args[0])).toContain(expectedParameters)

                });

                it('should not add parameters left blank if they are not required', function() {
                    spyOn(queryPage, 'getSelectedOperation').and.returnValue({
                        class: 'named.operation.class.Name',
                        name: 'test',
                        namedOp: true,
                        parameters: { "testParam": {
                                valueClass: "java.lang.Long",
                                required: false,
                                parts: {
                                    "value": ""
                                }
                            }
                        }
                    });

                    spyOn(query, 'execute');

                    ctrl.execute();


                    var expectedParameters = JSON.stringify({
                        "testParam": ""
                    });


                    expect(JSON.stringify(query.execute.calls.first().args[0])).not.toContain(expectedParameters)
                });

                it('should add blank parameters if the parameter is marked required', function() {
                    spyOn(queryPage, 'getSelectedOperation').and.returnValue({
                        class: 'named.operation.class.Name',
                        name: 'test',
                        namedOp: true,
                        parameters: { "testParam": {
                                valueClass: "java.lang.Long",
                                required: true,
                                parts: {
                                    "value": ""
                                }
                            }
                        }
                    });

                    spyOn(query, 'execute');

                    ctrl.execute();


                    var expectedParameters = JSON.stringify({
                        "testParam": ""
                    });


                    expect(JSON.stringify(query.execute.calls.first().args[0])).toContain(expectedParameters)
                });

                it('should not allow null parameters if they are not required', function() {
                    spyOn(queryPage, 'getSelectedOperation').and.returnValue({
                        class: 'named.operation.class.Name',
                        name: 'test',
                        namedOp: true,
                        parameters: { "testParam": {
                                valueClass: "java.lang.Long",
                                required: false,
                                parts: {
                                    "value": null
                                }
                            }
                        }
                    });

                    spyOn(query, 'execute');
                    ctrl.execute();


                    var expectedParameters = JSON.stringify({
                        "testParam": null
                    });


                    expect(JSON.stringify(query.execute.calls.first().args[0])).not.toContain(expectedParameters)
                });

                it('should add null parameters if the parameter is marked required', function() {
                    spyOn(queryPage, 'getSelectedOperation').and.returnValue({
                        class: 'named.operation.class.Name',
                        name: 'test',
                        namedOp: true,
                        parameters: { "testParam": {
                                valueClass: "java.lang.Long",
                                required: true,
                                parts: {
                                    "value": null
                                }
                            }
                        }
                    });

                    spyOn(query, 'execute');
                    ctrl.execute();


                    var expectedParameters = JSON.stringify({
                        "testParam": null
                    });

                    expect(JSON.stringify(query.execute.calls.first().args[0])).toContain(expectedParameters)
                });
            });

            describe('When adding seed pairs', function() {
                var input;
                var types;
                var pairs;

                beforeEach(inject(function(_input_, _types_) {
                    input = _input_;
                    types = _types_;
                }));

                beforeEach(function() {
                    pairs = [];
                });

                beforeEach(function() {
                    spyOn(query, 'execute');

                    spyOn(queryPage, 'getSelectedOperation').and.returnValue({
                        class: 'operation.class.Name',
                        input: 'uk.gov.gchq.gaffer.commonutil.pair.Pair'
                    });

                    spyOn(input, 'getInputPairs').and.callFake(function() {
                        return pairs;
                    });

                });

                it('should add string seed pairs from the input service to the operation', function() {
                    pairs = [
                        {first: {valueClass: 'java.lang.String', parts: {undefined: 'test1'} }, second: {valueClass: 'java.lang.String', parts: {undefined: 'test2'} }},
                        {first: {valueClass: 'java.lang.String', parts: {undefined: 'test2'} }, second: {valueClass: 'java.lang.String', parts: {undefined: 'test4'} }}
                    ];

                    var expectedInput = JSON.stringify([
                        { "class": "uk.gov.gchq.gaffer.commonutil.pair.Pair", "first": {"uk.gov.gchq.gaffer.operation.data.EntitySeed": {"vertex": "test1"}}, "second": { "uk.gov.gchq.gaffer.operation.data.EntitySeed": {"vertex": "test2"}}},
                        { "class": "uk.gov.gchq.gaffer.commonutil.pair.Pair", "first": {"uk.gov.gchq.gaffer.operation.data.EntitySeed": {"vertex": "test2"}}, "second": { "uk.gov.gchq.gaffer.operation.data.EntitySeed": {"vertex": "test4"}}}
                    ]);

                    ctrl.execute();

                    expect(JSON.stringify(query.execute.calls.first().args[0])).toContain(expectedInput);
                });

                it('should add complex seed pairs from the input service to the operation', function() {
                    pairs = [
                        { first: { valueClass: "my.complex.Type", parts: { "type": "thing1", "value": "myVal1", "someField": "test1"}}, second: { valueClass: "my.complex.Type", parts: { "type": "thing2", "value": "myVal2", "someField": "test2"}}},
                        { first: { valueClass: "my.complex.Type", parts: { "type": "thing2", "value": "myVal2", "someField": "test2"}}, second: { valueClass: "my.complex.Type", parts: { "type": "thing6", "value": "myVal6", "someField": "test6"}}},
                    ];

                    spyOn(types, 'createJsonValue').and.callFake(function(clazz, parts) {
                        var obj = {};
                        obj[clazz] = parts;
                        return obj;
                    });

                    ctrl.execute();

                    var expectedInput = JSON.stringify([
                        { 
                            class: "uk.gov.gchq.gaffer.commonutil.pair.Pair",
                            first: {
                                'uk.gov.gchq.gaffer.operation.data.EntitySeed': {
                                    'vertex': { "my.complex.Type": { "type": "thing1", "value": "myVal1", "someField": "test1"}}
                                }
                            },
                            second: {
                                'uk.gov.gchq.gaffer.operation.data.EntitySeed': {
                                    'vertex': { "my.complex.Type": { "type": "thing2", "value": "myVal2", "someField": "test2"}}
                                }
                            }
                        },
                        { 
                            class: "uk.gov.gchq.gaffer.commonutil.pair.Pair",
                            first: {
                                'uk.gov.gchq.gaffer.operation.data.EntitySeed': {
                                    'vertex': { "my.complex.Type": { "type": "thing2", "value": "myVal2", "someField": "test2"}}
                                }
                            },
                            second: {
                                'uk.gov.gchq.gaffer.operation.data.EntitySeed': {
                                    'vertex': { "my.complex.Type": { "type": "thing6", "value": "myVal6", "someField": "test6"}}
                                }
                            }
                        }]);

                    expect(JSON.stringify(query.execute.calls.first().args[0])).toContain(expectedInput);
                });

                it('should add numerical seed pairs from the input service to the operation', function() {
                    pairs = [
                        {first: {valueClass: 'int', parts: {undefined: 35} }, second: {valueClass: 'int', parts: {undefined: 3} }},
                        {first: {valueClass: 'int', parts: {undefined: 1} }, second: {valueClass: 'int', parts: {undefined: 42} }}
                    ];

                    var expectedInput = JSON.stringify([
                        { "class": "uk.gov.gchq.gaffer.commonutil.pair.Pair", "first": {"uk.gov.gchq.gaffer.operation.data.EntitySeed": {"vertex": 35}}, "second": { "uk.gov.gchq.gaffer.operation.data.EntitySeed": {"vertex": 3}}},
                        { "class": "uk.gov.gchq.gaffer.commonutil.pair.Pair", "first": {"uk.gov.gchq.gaffer.operation.data.EntitySeed": {"vertex": 1}}, "second": { "uk.gov.gchq.gaffer.operation.data.EntitySeed": {"vertex": 42}}}
                    ]);

                    ctrl.execute();

                    expect(JSON.stringify(query.execute.calls.first().args[0])).toContain(expectedInput);
                });

            });

            describe('When adding seeds', function() {
                var input;
                var types;
                var seeds;

                var selectedOperation;

                beforeEach(inject(function(_input_, _types_) {
                    input = _input_;
                    types = _types_;
                }));

                beforeEach(function() {
                    seeds = [];
                    selectedOperation = {
                        class: 'operation.class.Name',
                        input: true
                    }
                });

                beforeEach(function() {
                    spyOn(query, 'execute').and.stub();

                    spyOn(queryPage, 'getSelectedOperation').and.callFake(function() {
                        return selectedOperation;
                    });

                    spyOn(input, 'getInput').and.callFake(function() {
                        return seeds;
                    });

                });

                it('should add string seeds from the input service to the operation', function() {
                    seeds = [
                        {valueClass: 'java.lang.String', parts: {undefined: 'test1'} },
                        {valueClass: 'java.lang.String', parts: {undefined: 'test2'} },
                        {valueClass: 'java.lang.String', parts: {undefined: 'test3'} }
                    ];

                    var expectedInput = JSON.stringify([
                        { 'class': 'uk.gov.gchq.gaffer.operation.data.EntitySeed', 'vertex': 'test1'},
                        { 'class': 'uk.gov.gchq.gaffer.operation.data.EntitySeed', 'vertex': 'test2'},
                        { 'class': 'uk.gov.gchq.gaffer.operation.data.EntitySeed', 'vertex': 'test3'}]);

                    ctrl.execute();

                    expect(JSON.stringify(query.execute.calls.first().args[0])).toContain(expectedInput);
                });

                it('should add complex seeds from the input service to the operation', function() {
                    seeds = [
                        { valueClass: "my.complex.Type", parts: { "type": "thing1", "value": "myVal1", "someField": "test1"}},
                        { valueClass: "my.complex.Type", parts: { "type": "thing2", "value": "myVal2", "someField": "test2"}},
                        { valueClass: "my.complex.Type", parts: { "type": "thing3", "value": "myVal3", "someField": "test3"}}
                    ];

                    spyOn(types, 'createJsonValue').and.callFake(function(clazz, parts) {
                        var obj = {};
                        obj[clazz] = parts;
                        return obj;
                    });

                    ctrl.execute();

                    var expectedInput = JSON.stringify([
                        {
                            'class': 'uk.gov.gchq.gaffer.operation.data.EntitySeed',
                            'vertex': { "my.complex.Type": { "type": "thing1", "value": "myVal1", "someField": "test1"}
                            }
                        },
                        {
                            'class': 'uk.gov.gchq.gaffer.operation.data.EntitySeed',
                            'vertex': { "my.complex.Type": { "type": "thing2", "value": "myVal2", "someField": "test2"}
                            }
                        },
                        {
                            'class': 'uk.gov.gchq.gaffer.operation.data.EntitySeed',
                            'vertex': { "my.complex.Type": { "type": "thing3", "value": "myVal3", "someField": "test3"}
                            }
                        }]);

                    expect(JSON.stringify(query.execute.calls.first().args[0])).toContain(expectedInput);
                });

                it('should add numerical seeds from the input service to the operation', function() {
                    seeds = [
                        {valueClass: "int", parts: {undefined: 1}},
                        {valueClass: "int", parts: {undefined: 2}},
                        {valueClass: "int", parts: {undefined: 3}}
                    ];

                    ctrl.execute();

                    var expectedInput = JSON.stringify([
                        { 'class': 'uk.gov.gchq.gaffer.operation.data.EntitySeed', 'vertex': 1},
                        { 'class': 'uk.gov.gchq.gaffer.operation.data.EntitySeed', 'vertex': 2},
                        { 'class': 'uk.gov.gchq.gaffer.operation.data.EntitySeed', 'vertex': 3}])

                    expect(JSON.stringify(query.execute.calls.first().args[0])).toContain(expectedInput);

                });

                describe('When adding a second input', function() {
                    var inputB;
                    
                    beforeEach(function() {
                        spyOn(input, 'getInputB').and.callFake(function() {
                            return inputB;
                        });

                        selectedOperation = {
                            class: 'operation.class.Name',
                            input: true,
                            inputB: true,
                            namedOp: false
                        }
    
                    });

                    beforeEach(function() {
                        namedOp = false;
                    });

                    it('should add a second input if the operation is not a named operation', function() {
                        inputB = [
                            { valueClass: "my.complex.Type", parts: { "type": "thing1", "value": "myVal1", "someField": "test1"}},
                            { valueClass: "my.complex.Type", parts: { "type": "thing2", "value": "myVal2", "someField": "test2"}},
                            { valueClass: "my.complex.Type", parts: { "type": "thing3", "value": "myVal3", "someField": "test3"}}
                        ];

                        spyOn(types, 'createJsonValue').and.callFake(function(clazz, parts) {
                            var obj = {};
                            obj[clazz] = parts;
                            return obj;
                        });

                        var expectedInput = JSON.stringify([
                            {
                                'class': 'uk.gov.gchq.gaffer.operation.data.EntitySeed',
                                'vertex': { "my.complex.Type": { "type": "thing1", "value": "myVal1", "someField": "test1"}
                                }
                            },
                            {
                                'class': 'uk.gov.gchq.gaffer.operation.data.EntitySeed',
                                'vertex': { "my.complex.Type": { "type": "thing2", "value": "myVal2", "someField": "test2"}
                                }
                            },
                            {
                                'class': 'uk.gov.gchq.gaffer.operation.data.EntitySeed',
                                'vertex': { "my.complex.Type": { "type": "thing3", "value": "myVal3", "someField": "test3"}
                                }
                            }
                        ]);

                        ctrl.execute();

                        var json = query.execute.calls.first().args[0];

                        expect(JSON.stringify(json.operations[0].inputB)).toEqual(expectedInput);
                    });

                    it('should not add a second input if the operation is a named operation', function() {
                        inputB = [
                            {valueClass: 'java.lang.String', parts: {undefined: 'test1'} },
                            {valueClass: 'java.lang.String', parts: {undefined: 'test2'} },
                            {valueClass: 'java.lang.String', parts: {undefined: 'test3'} }
                        ];

                        selectedOperation = {
                            class: 'operation.class.Name',
                            input: true,
                            inputB: true,
                            namedOp: true
                        }

                        ctrl.execute();

                        var json = query.execute.calls.first().args[0];

                        expect(JSON.stringify(json.operations[0].inputB)).toBeUndefined();
                    });

                    it('should add an inputB parameter if the operation is a named operation', function() {
                        inputB = [
                            {valueClass: "int", parts: {undefined: 1}},
                            {valueClass: "int", parts: {undefined: 2}},
                            {valueClass: "int", parts: {undefined: 3}}
                        ];
    
                        selectedOperation = {
                            class: 'operation.class.Name',
                            input: true,
                            inputB: true,
                            namedOp: true
                        }

                        ctrl.execute();
    
                        var expectedInput = JSON.stringify([
                            { 'class': 'uk.gov.gchq.gaffer.operation.data.EntitySeed', 'vertex': 1},
                            { 'class': 'uk.gov.gchq.gaffer.operation.data.EntitySeed', 'vertex': 2},
                            { 'class': 'uk.gov.gchq.gaffer.operation.data.EntitySeed', 'vertex': 3}
                        ]);

                        var json = query.execute.calls.first().args[0];

                        expect(JSON.stringify(json.operations[0].parameters.inputB)).toEqual(expectedInput);
                    });

                    
                })
            });

            describe('when adding Edge directions', function() {

                var direction;

                beforeEach(function() {
                    spyOn(queryPage, 'getInOutFlag').and.callFake(function() {
                        return direction;
                    });

                    spyOn(queryPage, 'getSelectedOperation').and.returnValue({
                        class: 'operation.class.Name',
                        inOutFlag: true
                    });

                    spyOn(query, 'execute').and.stub();

                });

                var test = function(flag) {
                    direction = flag;
                    ctrl.execute();
                    expect(JSON.stringify(query.execute.calls.argsFor(0)[0])).toContain(flag);
                }

                it('should add the edge direction when it is incoming', function() {
                    test('INCOMING');
                });

                it('should add the edge direction when it is outgoing', function() {
                    test('OUTGOING');
                });

                it('should add the edge direction when it is either', function() {
                    test('EITHER');
                });
            });
        })


        it('should add the selected operation to the list of operations', function() {
            spyOn(queryPage, 'getSelectedOperation').and.returnValue({
                class: 'operation.class.Name'
            });

            spyOn(query, 'addOperation');

            ctrl.execute();

            expect(query.addOperation).toHaveBeenCalledTimes(1);
        });

        describe('when the results returned number the same as the result limit', function() {
            var scope;
            var navigation, results, input;
            var $mdDialog, $q;

            var returnValue;

            beforeEach(inject(function(_navigation_, _$rootScope_, _$mdDialog_, _$q_, _results_, _input_) {
                navigation = _navigation_;
                scope = _$rootScope_.$new();
                $mdDialog = _$mdDialog_;
                $q = _$q_;
                results = _results_;
                input = _input_;
            }));

            beforeEach(function() {
                spyOn(queryPage, 'getSelectedOperation').and.returnValue({
                    class: 'operation.class.Name'
                });

                spyOn(queryPage, 'reset');

                spyOn(settings, 'getResultLimit').and.returnValue(2);
                spyOn(query, 'execute').and.callFake(function(opChain, callback) {
                    callback([1, 2]);
                });

                spyOn(graph, 'deselectAll');
                spyOn(results, 'update');
                spyOn(input, 'reset');

                spyOn($mdDialog, 'show').and.callFake(function() {
                    return $q.when(returnValue);
                });

                spyOn(navigation, 'goTo');
            });

            beforeEach(function() {
                returnValue = 'results';
            })

            beforeEach(function() {
                ctrl = $componentController('query', {$scope: scope});
            })

            beforeEach(function() {
                ctrl.queryForm = {
                    $valid : true
                }
            });

            beforeEach(function() {
                ctrl.execute();
                scope.$digest();
            })

            it('should display a dialog if the results numbered the same as the result limit', function() {
                expect($mdDialog.show).toHaveBeenCalledTimes(1);
            });

            it('should navigate to the table if the dialog returns "results"', function() {
                expect(navigation.goTo).toHaveBeenCalledTimes(1);
                expect(navigation.goTo).toHaveBeenCalledWith('results');

                navigation.goTo.calls.reset();

                returnValue = 'not results';
                ctrl.execute();
                expect(navigation.goTo).not.toHaveBeenCalled();
            });

            it('should submit the results if the dialog returns "results"', function() {
                expect(results.update).toHaveBeenCalledTimes(1);
                expect(results.update).toHaveBeenCalledWith([1, 2]);

                results.update.calls.reset();

                returnValue = 'query';
                ctrl.execute();
                scope.$digest();
                expect(results.update).not.toHaveBeenCalled();
            });

            it('should clear the query page if the dialog returns "results"', function() {
                expect(queryPage.reset).toHaveBeenCalledTimes(1);

                queryPage.reset.calls.reset();

                returnValue = 'A value which is not results';
                ctrl.execute();
                scope.$digest();
                expect(queryPage.reset).not.toHaveBeenCalled();
            });

            it('should deselect all elements if the dialog returns "results"', function() {
                expect(graph.deselectAll).toHaveBeenCalledTimes(1);

                graph.deselectAll.calls.reset();

                returnValue = 'query';
                ctrl.execute();
                scope.$digest();
                expect(graph.deselectAll).not.toHaveBeenCalled();
            });

            it('should reset the input service if the dialog returns "results"', function() {
                expect(input.reset).toHaveBeenCalledTimes(1);
                input.reset.calls.reset();

                returnValue = 'query';
                ctrl.execute();
                scope.$digest();
                expect(input.reset).not.toHaveBeenCalled();
            });
        });

    });
});
