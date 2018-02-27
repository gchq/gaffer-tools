describe('The Query component', function() {

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

    describe('The Controller', function() {
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

        it('should exist', function() {
            var ctrl = $componentController('query');
            expect(ctrl).toBeDefined();
        })

        it('should expose the getSelectedOperation of the queryPage service', function() {
            spyOn(queryPage, 'getSelectedOperation');

            var ctrl = $componentController('query');

            ctrl.getSelectedOp();

            expect(queryPage.getSelectedOperation).toHaveBeenCalledTimes(1);
        });

        describe('When validating the query', function() {
            var ctrl;
            var valid;
            var selectedOperation;

            beforeEach(function() {
                ctrl = $componentController('query');
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

            var ctrl = $componentController('query');

            ctrl.execute();

            expect(query.execute).toHaveBeenCalledTimes(1);

        });

        describe('when building up the operation', function() {

            describe('when adding views', function() {

                var view;

                beforeEach(inject(function(_view_) {
                    view = _view_;
                }));

                it('should create a basic view from the view edges and entities', function() {

                    spyOn(view, 'getViewEntities').and.returnValue(['elementGroup1','elementGroup2','elementGroup3']);
                    spyOn(view, 'getViewEdges').and.returnValue(['edge1','edge2']);

                    spyOn(queryPage, 'getSelectedOperation').and.returnValue({
                        class: 'some.operation.with.View',
                        view: true
                    });

                    spyOn(query, 'execute');

                    var ctrl = $componentController('query');

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

                    expect(query.execute.calls.argsFor(0)[0]).toContain(JSON.stringify(entities));
                    expect(query.execute.calls.argsFor(0)[0]).toContain(JSON.stringify(edges));

                });

                it('should add the group by to the operation', function() {
                    spyOn(queryPage, 'getSelectedOperation').and.returnValue({
                        class: 'operation.class.Name',
                        view: true
                    });

                    spyOn(query, 'execute');

                    var ctrl = $componentController('query');
                    ctrl.execute();

                    expect(query.execute.calls.first().args[0]).toContain('"groupBy":[]');
                });
            });

            describe('When adding Named views', function() {

                var view;
                var ctrl;

                beforeEach(inject(function(_view_) {
                    view = _view_;
                }));

                beforeEach(function() {
                    ctrl = $componentController('query');
                });

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
                    expect(query.execute.calls.first().args[0]).not.toContain('views');
                });

                it('should do nothing if the named views are undefined', function() {
                    view.setNamedViews(null);
                    ctrl.execute();
                    expect(query.execute.calls.first().args[0]).not.toContain('views');
                });

                it('should do nothing if the named views are an empty array', function() {
                    view.setNamedViews([]);
                    ctrl.execute();
                    expect(query.execute.calls.first().args[0]).not.toContain('views');
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

                    expect(query.execute.calls.argsFor(0)[0]).toContain(JSON.stringify(entities));
                    expect(query.execute.calls.argsFor(0)[0]).toContain(JSON.stringify(edges));


                    expect(query.execute.calls.first().args[0]).toContain('views');
                    expect(query.execute.calls.first().args[0]).not.toContain('view:');
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

                    expect(query.execute.calls.first().args[0]).toContain(namedView)

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

                    expect(query.execute.calls.first().args[0]).not.toContain(unExpected);
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

                    expect(query.execute.calls.first().args[0]).toContain(expected);
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

                    expect(query.execute.calls.first().args[0]).not.toContain(unExpected);
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

                    expect(query.execute.calls.first().args[0]).toContain(expected);
                });
            });

            describe('When adding date ranges', function() {

                var time;
                var startDate, endDate;
                var ctrl;
                var types;

                beforeEach(inject(function(_time_, _types_) {
                    time = _time_;
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

                    spyOn(time, 'getStartDate').and.callFake(function() {
                        return startDate;
                    });

                    spyOn(time, 'getEndDate').and.callFake(function() {
                        return endDate;
                    });

                    spyOn(query, 'execute');
                });

                beforeEach(function() {
                    ctrl = $componentController('query');
                });

                beforeEach(function() {
                    startDate = undefined;
                    endDate = undefined;
                });

                it('should add no date range if neither start or end date is specified', function() {
                    ctrl.execute();
                    expect(query.execute.calls.first().args[0]).not.toContain('startDate');
                    expect(query.execute.calls.first().args[0]).not.toContain('endDate');
                });

                it('should add no date filter if the start and end date is null', function() {
                    startDate = null;
                    endDate = null;
                    ctrl.execute();
                    expect(query.execute.calls.first().args[0]).not.toContain('startDate');
                    expect(query.execute.calls.first().args[0]).not.toContain('endDate');
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
                    expect(query.execute.calls.first().args[0]).toContain(JSON.stringify(expectedFilterFunctions));

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
                    expect(query.execute.calls.first().args[0]).toContain(JSON.stringify(expectedFilterFunctions));

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

                    var ctrl = $componentController('query');
                    ctrl.execute();


                    var expectedParameters = JSON.stringify({
                        "testParam": 42
                    });


                    expect(query.execute.calls.first().args[0]).toContain(expectedParameters)

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

                    var ctrl = $componentController('query');
                    ctrl.execute();


                    var expectedParameters = JSON.stringify({
                        "testParam": ""
                    });


                    expect(query.execute.calls.first().args[0]).not.toContain(expectedParameters)
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

                    var ctrl = $componentController('query');
                    ctrl.execute();


                    var expectedParameters = JSON.stringify({
                        "testParam": ""
                    });


                    expect(query.execute.calls.first().args[0]).toContain(expectedParameters)
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

                    var ctrl = $componentController('query');
                    ctrl.execute();


                    var expectedParameters = JSON.stringify({
                        "testParam": null
                    });


                    expect(query.execute.calls.first().args[0]).not.toContain(expectedParameters)
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

                    var ctrl = $componentController('query');
                    ctrl.execute();


                    var expectedParameters = JSON.stringify({
                        "testParam": null
                    });

                    expect(query.execute.calls.first().args[0]).toContain(expectedParameters)
                });
            });

            describe('When adding seeds', function() {

                it('should add string seeds from the selected entities to the operation', function() {
                    spyOn(queryPage, 'getSelectedOperation').and.returnValue({
                        class: 'operation.class.Name',
                        input: true
                    });

                    spyOn(graph, 'getSelectedEntities').and.returnValue({
                        "vertex1": [],
                        "vertex2": [],
                        "vertex3": []
                    });

                    spyOn(query, 'execute');

                    var ctrl = $componentController('query');
                    ctrl.execute();

                    var expectedInput = JSON.stringify([
                        { 'class': 'uk.gov.gchq.gaffer.operation.data.EntitySeed', 'vertex': 'vertex1'},
                        { 'class': 'uk.gov.gchq.gaffer.operation.data.EntitySeed', 'vertex': 'vertex2'},
                        { 'class': 'uk.gov.gchq.gaffer.operation.data.EntitySeed', 'vertex': 'vertex3'}])

                    expect(query.execute.calls.first().args[0]).toContain(expectedInput);

                });

                it('should add complex seeds to the operation', function() {
                    spyOn(queryPage, 'getSelectedOperation').and.returnValue({
                        class: 'operation.class.Name',
                        input: true
                    });

                    spyOn(graph, 'getSelectedEntities').and.returnValue({
                        '{ "my.complex.Type": { "type": "thing1", "value": "myVal1", "someField": "test1"}}': [],
                        '{ "my.complex.Type": { "type": "thing2", "value": "myVal2", "someField": "test2"}}': [],
                        '{ "my.complex.Type": { "type": "thing3", "value": "myVal3", "someField": "test3"}}': []
                    });

                    spyOn(query, 'execute');

                    var ctrl = $componentController('query');
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

                    expect(query.execute.calls.first().args[0]).toContain(expectedInput);
                });

                it('should add numerical seeds to the operation', function() {
                    spyOn(queryPage, 'getSelectedOperation').and.returnValue({
                        class: 'operation.class.Name',
                        input: true
                    });

                    spyOn(graph, 'getSelectedEntities').and.returnValue({
                        1: [],
                        2: [],
                        3: []
                    });

                    spyOn(query, 'execute');

                    var ctrl = $componentController('query');
                    ctrl.execute();

                    var expectedInput = JSON.stringify([
                        { 'class': 'uk.gov.gchq.gaffer.operation.data.EntitySeed', 'vertex': 1},
                        { 'class': 'uk.gov.gchq.gaffer.operation.data.EntitySeed', 'vertex': 2},
                        { 'class': 'uk.gov.gchq.gaffer.operation.data.EntitySeed', 'vertex': 3}])

                    expect(query.execute.calls.first().args[0]).toContain(expectedInput);
                });
            });

            describe('when adding Edge directions', function() {

                it('should add the edge direction to the operation', function() {

                    var direction;
                    spyOn(queryPage, 'getSelectedOperation').and.returnValue({
                        class: 'operation.class.Name',
                        inOutFlag: true
                    });

                    spyOn(queryPage, 'getInOutFlag').and.callFake(function() {
                        return direction;
                    });

                    spyOn(query, 'execute');

                    var ctrl = $componentController('query');


                    var flags = [ 'INCOMING', 'OUTGOING', 'EITHER']

                    for (var i in flags) {
                        var flag = flags[i];
                        direction = flag;
                        ctrl.execute();
                        expect(query.execute.calls.argsFor(i)[0]).toContain(flag);
                    }
                });
            });
        })


        it('should add the selected operation to the list of operations', function() {
            spyOn(queryPage, 'getSelectedOperation').and.returnValue({
                class: 'operation.class.Name'
            });

            spyOn(query, 'addOperation');

            var ctrl = $componentController('query');
            ctrl.execute();

            expect(query.addOperation).toHaveBeenCalledTimes(1);
        });

        describe('when the results returned number the same as the result limit', function() {
            var scope;
            var navigation, results;
            var $mdDialog, $q;

            var returnValue;
            var ctrl;

            beforeEach(inject(function(_navigation_, _$rootScope_, _$mdDialog_, _$q_, _results_) {
                navigation = _navigation_;
                scope = _$rootScope_.$new();
                $mdDialog = _$mdDialog_;
                $q = _$q_;
                results = _results_;
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
                ctrl.execute();
                scope.$digest();
            })

            it('should display a dialog if the results numbered the same as the result limit', function() {
                expect($mdDialog.show).toHaveBeenCalledTimes(1);
            });

            it('should navigate to the graph if the dialog returns "results"', function() {
                expect(navigation.goTo).toHaveBeenCalledTimes(1);
                expect(navigation.goTo).toHaveBeenCalledWith('graph');

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
        });

    });
});
