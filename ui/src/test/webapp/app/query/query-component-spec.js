describe('The query component', function() {

    beforeEach(module('app'));

    describe('The Query Controller', function() {
        var $componentController, $mdDialog, $q;
        var queryPage, query, loading, graph, settings;

        beforeEach(inject(function(_$componentController_, _queryPage_, _query_, _loading_, _graph_, _$mdDialog_, _settings_, _$q_) {
            $componentController = _$componentController_;
            queryPage = _queryPage_;
            query = _query_;
            loading = _loading_;
            graph = _graph_;
            $mdDialog = _$mdDialog_;
            settings = _settings_;
            $q = _$q_;
        }));

        it('should expose the getSelectedOperation of the queryPage service', function() {
            spyOn(queryPage, 'getSelectedOperation');

            var ctrl = $componentController('query');

            ctrl.getSelectedOp();

            expect(queryPage.getSelectedOperation).toHaveBeenCalledTimes(1);
        });

        it('should not allow execution if the selected operation is undefined', function() {
            var ctrl = $componentController('query');
            expect(ctrl.canExecute()).toBeFalsy();
        });

        it('should not allow execution if the selected operation is defined but results are loading', function() {
            var ctrl = $componentController('query');
            queryPage.setSelectedOperation('some operation');
            loading.load();

            expect(ctrl.canExecute()).toBeFalsy();
        });

        it('should allow execution if the selected operation is defined and the loading completes', function() {
            var ctrl = $componentController('query');
            queryPage.setSelectedOperation('some operation');

            loading.load();
            loading.finish();
            expect(ctrl.canExecute()).toBeTruthy();
        });

        it('should allow execution if the selected operation is defined and loading has not started', function() {
            var ctrl = $componentController('query');
            queryPage.setSelectedOperation('some operation');

            expect(ctrl.canExecute()).toBeTruthy();

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

        it('should create a basic view from the expanded edges and entities', function() {
            queryPage.expandEntities = [
                'elementGroup1',
                'elementGroup2',
                'elementGroup3'
            ];

            queryPage.expandEdges = [
                "edge1",
                "edge2"
            ];

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

        it('should create filter functions from the expand entities content', function() {
            queryPage.expandEdges = [ "element1" ];
            queryPage.expandEdgesContent = {
                "element1": {
                    "filters": {
                        "preAggregation": [
                            {
                                "property": "timestamp",
                                "predicate": "uk.gov.gchq.koryphe.some.Filter",
                                "parameters": [
                                    5,
                                    false
                                ],
                                "availableFunctionParameters": [
                                    "value",
                                    "someOtherParameter"
                                ]
                            }
                        ],
                        "postAggregation": [
                            {
                                "property": "count",
                                "predicate": "uk.gov.gchq.koryphe.another.Filter",
                                "parameters": [
                                    "test"
                                ],
                                "availableFunctionParameters": [
                                    "customFilterValue"
                                ]
                            }
                        ]
                    }
                }
            }

            spyOn(queryPage, 'getSelectedOperation').and.returnValue({
                class: 'some.operation.with.View',
                view: true
            });

            spyOn(query, 'execute');

            var ctrl = $componentController('query');
            ctrl.execute();

            var expectedEdges = {
                "element1": {
                    preAggregationFilterFunctions: [
                        {
                            predicate: {
                                class: "uk.gov.gchq.koryphe.some.Filter",
                                value: 5,
                                someOtherParameter: false
                            },
                            selection: [
                                "timestamp"
                            ]
                        }
                    ],
                    postAggregationFilterFunctions: [
                        {
                            predicate: {
                                class: "uk.gov.gchq.koryphe.another.Filter",
                                customFilterValue: "test"
                            },
                            selection: [
                                "count"
                            ]
                        }
                    ]
                }
            }

            expect(query.execute.calls.argsFor(0)[0]).toContain(JSON.stringify(expectedEdges));

        });

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

        it('should add the selected operation to the list of operations', function() {
            spyOn(queryPage, 'getSelectedOperation').and.returnValue({
                class: 'operation.class.Name'
            });

            spyOn(query, 'addOperation');

            var ctrl = $componentController('query');
            ctrl.execute();

            expect(query.addOperation).toHaveBeenCalledTimes(1);
        });

        it('should display a dialog if the results numbered more than the result limit', function() {
            spyOn(queryPage, 'getSelectedOperation').and.returnValue({
                class: 'operation.class.Name'
            });

            spyOn(settings, 'getResultLimit').and.returnValue(2);
            spyOn(query, 'execute').and.callFake(function(opChain, callback) {
                callback([1, 2]);
            });
            spyOn($mdDialog, 'show').and.returnValue($q.defer().promise);

            var ctrl = $componentController('query');
            ctrl.execute();

            expect($mdDialog.show).toHaveBeenCalledTimes(1);
        });
    });
});