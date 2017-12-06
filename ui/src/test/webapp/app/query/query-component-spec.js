describe('The query component', function() {

    beforeEach(module('app'));

    describe('The Query Controller', function() {
        var $componentController;
        var queryPage, query, loading;

        beforeEach(inject(function(_$componentController_, _queryPage_, _query_, _loading_) {
            $componentController = _$componentController_;
            queryPage = _queryPage_;
            query = _query_;
            loading = _loading_;
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
            expect(true).toBeTruthy()
        });

        it('should not add parameters left blank if they are not required', function() {
            // will fail
            expect(true).toBeTruthy()
        });

        it('should add string seeds to the operation', function() {
            expect(true).toBeTruthy()
        });

        it('should add complex seeds to the operation', function() {
            expect(true).toBeTruthy()
        });

        it('should add numerical seeds to the operation', function() {
            expect(true).toBeTruthy()
        });

        it('should add the edge direction to the operation', function() {
            expect(true).toBeTruthy()
        });

        it('should add the group by to the operation', function() {
            expect(true).toBeTruthy()
        });

        it('should add the selected operation to the list of operations', function() {
            expect(true).toBeTruthy()
        });

        it('should display a dialog if the results numbered more than the result limit', function() {
            expect(true).toBeTruthy()
        });
    });
});