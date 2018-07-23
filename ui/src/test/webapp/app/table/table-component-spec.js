describe('The Table component', function() {
    var fullResultsData = {
        entities: [
            {
                group: 'BasicEntity1',
                vertex: 'vertex1',
                properties: {
                    count: 1,
                    prop1: 'value1'
                }
            },
            {
                group: 'BasicEntity1',
                vertex: 'vertex2',
                properties: {
                    count: 2,
                    prop1: 'value2'
                }
            },
            {
                group: 'BasicEntity2',
                vertex: 'vertex1',
                properties: {
                    count: 1,
                    prop2: 'value1'
                }
            }
        ],
        edges: [
            {
                group: 'BasicEdge1',
                source: 'source1',
                destination: 'destination1',
                directed: true,
                properties: {
                    count: 1,
                    prop1: 'value1'
                }
            },
            {
                group: 'BasicEdge1',
                source: 'source2',
                destination: 'destination2',
                directed: true,
                properties: {
                    count: 2,
                    prop1: 'value2'
                }
            },
            {
                group: 'BasicEdge2',
                source: 'source1',
                destination: 'destination1',
                directed: true,
                properties: {
                    count: 1,
                    prop2: 'value1'
                }
            }
        ],
        other: [
            {
                class: "String",
                value: "value1"
            },
            {
                class: "Integer",
                value: 4
            },
            {
                class: "EntitySeed",
                vertex: "vertex1"
            }
        ]
    };

    var fullData = {
        results: [
            {
                'result type': 'Edge',
                GROUP: 'BasicEdge1',
                SOURCE: "source1",
                DESTINATION: 'destination1',
                DIRECTED: true,
                count: 1,
                prop1: 'value1'
            },
            {
                'result type': 'Edge',
                GROUP: 'BasicEdge1',
                SOURCE: "source2",
                DESTINATION: 'destination2',
                DIRECTED: true,
                count: 2,
                prop1: 'value2'
            },
            {
                'result type': 'Edge',
                GROUP: 'BasicEdge2',
                SOURCE: "source1",
                DESTINATION: 'destination1',
                DIRECTED: true,
                count: 1,
                prop2: 'value1'
            },
            {
                'result type': 'Entity',
                GROUP: 'BasicEntity1',
                SOURCE: 'vertex1',
                count: 1,
                prop1: 'value1'
            },
            {
                'result type': 'Entity',
                GROUP: 'BasicEntity1',
                SOURCE: 'vertex2',
                count: 2,
                prop1: 'value2'
            },
            {
                'result type': 'Entity',
                GROUP: 'BasicEntity2',
                SOURCE: 'vertex1',
                count: 1,
                prop2: 'value1'
            },
            {
                GROUP: '',
                'result type': 'String',
                value: 'value1'
            },
            {
                GROUP: '',
                'result type': 'Integer',
                value: 4
            },
            {
                GROUP: '',
                'result type': 'EntitySeed',
                SOURCE: 'vertex1'
            }
        ],
        columns: [ 'result type', 'GROUP', 'SOURCE', 'DESTINATION', 'DIRECTED', 'value', 'count', 'prop1', 'prop2'],
        allColumns: [ 'result type', 'GROUP', 'SOURCE', 'DESTINATION', 'DIRECTED', 'value', 'count', 'prop1', 'prop2' ],
        groups: [ 'BasicEdge1', 'BasicEdge2', 'BasicEntity1', 'BasicEntity2', '' ],
        allGroups: [ 'BasicEdge1', 'BasicEdge2', 'BasicEntity1', 'BasicEntity2', '' ],
        types: [ 'Edge', 'Entity', 'String', 'Integer', 'EntitySeed' ],
        allTypes: [ 'Edge', 'Entity', 'String', 'Integer', 'EntitySeed' ],
        tooltips: {}
   }

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

    describe('The Controller', function() {
        var $componentController;
        var scope, $q, schema, results, table, events, common, types, time;
        var resultsData, cachedValues;

        beforeEach(inject(function(_$rootScope_, _$componentController_, _$q_, _schema_, _results_, _table_, _events_, _common_, _types_, _time_) {
            scope = _$rootScope_.$new();
            $componentController = _$componentController_;
            $q = _$q_;
            schema = _schema_;
            results = _results_;
            table = _table_;
            events = _events_;
            common = _common_;
            types = _types_;
            time = _time_;

            resultsData = {
                entities: [],
                edges: [],
                other: []
            };
            cachedValues = {};
        }));

        beforeEach(function() {
            ctrl = $componentController('resultsTable');
            spyOn(schema, 'get').and.returnValue($q.when({
                "entities": {
                    "BasicEntity1": {
                        "properties": {
                            "count": "long"
                        }
                    },
                    "BasicEntity2": {
                        "properties": {
                            "count": "long"
                        }
                    }
                },
                "edges": {
                    "BasicEdge1": {
                        "properties": {
                            "count": "long"
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

        it('should exist', function() {
            expect(ctrl).toBeDefined();
        });

        describe('ctrl.$onInit()', function() {
            beforeEach(function() {
                spyOn(results, 'get').and.returnValue(resultsData);
                spyOn(events, 'subscribe');
                spyOn(table, 'getCachedValues').and.returnValue(cachedValues);
                ctrl.$onInit();
                scope.$digest();
            });

            it('should fetch schema', function() {
                expect(schema.get).toHaveBeenCalledTimes(1);
            });

            it('should process empty results', function() {
                expect(results.get).toHaveBeenCalledTimes(1);
                expect(ctrl.data).toEqual(
                    {
                         results: [],
                         columns: [],
                         allColumns: [],
                         types: [],
                         allTypes: [],
                         groups: [],
                         allGroups: [],
                         tooltips: {}
                     }
                 );
            });

            it('should load empty cached values from table service', function() {
                expect(table.getCachedValues).toHaveBeenCalledTimes(1);
                expect(ctrl.sortType).toEqual(undefined);
                expect(ctrl.searchTerm).toEqual(undefined);
            });

            it('should subscribe to results updated events', function() {
                expect(events.subscribe).toHaveBeenCalledTimes(1);
                expect(events.subscribe).toHaveBeenCalledWith('resultsUpdated', jasmine.any(Function));
            });
        });

        describe('ctrl.$onInit() with cached values', function() {
            beforeEach(function() {
                spyOn(results, 'get').and.returnValue(resultsData);
                spyOn(events, 'subscribe');

                cachedValues = {
                    sortType: 'source',
                    searchTerm: 'vertex'
                };
                spyOn(table, 'getCachedValues').and.returnValue(cachedValues);

                ctrl.$onInit();
                scope.$digest();
            });

            it('should load cached values from table service', function() {
                expect(table.getCachedValues).toHaveBeenCalledTimes(1);
                expect(ctrl.sortType).toEqual('source');
                expect(ctrl.searchTerm).toEqual('vertex');
            });
        });

        describe('ctrl.$onInit() with results', function() {
            beforeEach(function() {
                resultsData = fullResultsData;
                spyOn(results, 'get').and.returnValue(resultsData);
                spyOn(events, 'subscribe');
                spyOn(table, 'getCachedValues').and.returnValue(cachedValues);
                ctrl.$onInit();
                scope.$digest();
            });

            it('should have the correct data', function() {
                expect(ctrl.data.results).toEqual(fullData.results);
            });

            it('should have the correct groups', function() {
                expect(ctrl.data.groups).toEqual(fullData.groups);
                expect(ctrl.data.allGroups).toEqual(fullData.allGroups);
            });

            it('should have the correct result types', function() {
                expect(ctrl.data.types).toEqual(fullData.types);
                expect(ctrl.data.allTypes).toEqual(fullData.allTypes);
            });

            it('should have the correct columns', function() {
                expect(ctrl.data.columns).toEqual(fullData.columns);
                expect(ctrl.data.allColumns).toEqual(fullData.allColumns);
            })
        });

        describe('ctrl.$onDestroy()', function() {
            beforeEach(function() {
                ctrl.searchTerm = "search value1";
                ctrl.sortType = "destination";
                spyOn(events, 'unsubscribe');
                spyOn(table, 'setCachedValues');
                ctrl.$onDestroy();
                scope.$digest();
            });

            it('should cache values', function() {
                expect(table.setCachedValues).toHaveBeenCalledTimes(1);
                expect(table.setCachedValues).toHaveBeenCalledWith({
                    searchTerm: "search value1",
                    sortType: "destination"
                });
            });

            it('should unsubscribe from results updated events', function() {
                expect(events.unsubscribe).toHaveBeenCalledTimes(1);
                expect(events.unsubscribe).toHaveBeenCalledWith('resultsUpdated', jasmine.any(Function));
            });
        });
        describe('ctrl.hideColumn()', function() {
            it('should hide an existing column', function() {
                ctrl.data.columns = ["1", "2", "3"];
                ctrl.hideColumn("2");
                expect(ctrl.data.columns).toEqual(["1", "3"]);
            });
            it('should do nothing if column is already hidden', function() {
                ctrl.data.columns = ["1", "3"];
                ctrl.hideColumn("2");
                expect(ctrl.data.columns).toEqual(["1", "3"]);
            });
        });
        describe('ctrl.updateFilteredResults()', function() {
            it('should update filtered results', function() {
                resultsData = fullResultsData;
                spyOn(results, 'get').and.returnValue(resultsData);
                spyOn(events, 'subscribe');
                spyOn(table, 'getCachedValues').and.returnValue(cachedValues);
                ctrl.$onInit();
                scope.$digest();

                ctrl.data.types = ["Edge", "String"];
                ctrl.updateFilteredResults();
                expect(ctrl.data.results).toEqual([
                    { 'result type': 'Edge', GROUP: 'BasicEdge1', SOURCE: 'source1', DESTINATION: 'destination1', DIRECTED: true, count: 1, prop1: 'value1' },
                    { 'result type': 'Edge', GROUP: 'BasicEdge1', SOURCE: 'source2', DESTINATION: 'destination2', DIRECTED: true, count: 2, prop1: 'value2' },
                    { 'result type': 'Edge', GROUP: 'BasicEdge2', SOURCE: 'source1', DESTINATION: 'destination1', DIRECTED: true, count: 1, prop2: 'value1' },
                    { GROUP: '', 'result type': 'String', value: 'value1' }
                ]);
            });

            it('should update filtered results multiple times', function() {
                resultsData = fullResultsData;
                spyOn(results, 'get').and.returnValue(resultsData);
                spyOn(events, 'subscribe');
                spyOn(table, 'getCachedValues').and.returnValue(cachedValues);
                ctrl.$onInit();
                scope.$digest();

                ctrl.data.types = ["Edge", "String"];
                ctrl.updateFilteredResults();
                expect(ctrl.data.results).toEqual([
                    { 'result type': 'Edge', GROUP: 'BasicEdge1', SOURCE: 'source1', DESTINATION: 'destination1', DIRECTED: true, count: 1, prop1: 'value1' },
                    { 'result type': 'Edge', GROUP: 'BasicEdge1', SOURCE: 'source2', DESTINATION: 'destination2', DIRECTED: true, count: 2, prop1: 'value2' },
                    { 'result type': 'Edge', GROUP: 'BasicEdge2', SOURCE: 'source1', DESTINATION: 'destination1', DIRECTED: true, count: 1, prop2: 'value1' },
                    { GROUP: '', 'result type': 'String', value: 'value1' }
                ]);
                expect(ctrl.data.columns).toEqual(['result type', 'GROUP', 'SOURCE', 'DESTINATION', 'DIRECTED', 'value', 'count', 'prop1', 'prop2']);

                ctrl.data.types = ["Entity"];
                ctrl.updateFilteredResults();
                expect(ctrl.data.results).toEqual([
                    { 'result type': 'Entity', GROUP: 'BasicEntity1', SOURCE: 'vertex1', count: 1, prop1: 'value1' },
                    { 'result type': 'Entity', GROUP: 'BasicEntity1', SOURCE: 'vertex2', count: 2, prop1: 'value2' },
                    { 'result type': 'Entity', GROUP: 'BasicEntity2', SOURCE: 'vertex1', count: 1, prop2: 'value1' }
                ]);
                expect(ctrl.data.columns).toEqual(['result type', 'GROUP', 'SOURCE', 'DESTINATION', 'DIRECTED', 'value', 'count', 'prop1', 'prop2']);

                ctrl.data.types = ["String"];
                ctrl.updateFilteredResults();
                expect(ctrl.data.results).toEqual([
                    { 'result type': 'String', GROUP: '', value: 'value1' },
                ]);
                expect(ctrl.data.columns).toEqual(['result type', 'GROUP', 'SOURCE', 'DESTINATION', 'DIRECTED', 'value', 'count', 'prop1', 'prop2']);
            });

            it('should convert string properties which are numbers into their numerical value', function() {
                resultsData = {
                    entities: [
                            {
                            group: 'aGroup',
                            vertex: 'a',
                            properties: {
                                numberProp: '123'
                            }
                        }
                    ]
                }

                spyOn(results, 'get').and.returnValue(resultsData);
                spyOn(table, 'getCachedValues').and.returnValue(cachedValues);
                ctrl.$onInit();
                scope.$digest();
                ctrl.data.types = ["Entity"];
                ctrl.updateFilteredResults();

                expect(ctrl.data.results[0]['numberProp']).toEqual(123);
            });

            it('should handle property name clashes with "source" and "destination"', function() {
                resultsData = {
                    edges: [
                        {
                            group: 'BasicEdge1',
                            source: 'source1',
                            destination: 'destination1',
                            directed: true,
                            properties: {
                                source: 'abc',
                                destination: 'dest4',
                                count: 1,
                                prop1: 'value1'
                            }
                        }
                    ]
                }

                spyOn(results, 'get').and.returnValue(resultsData);
                spyOn(table, 'getCachedValues').and.returnValue(cachedValues);
                ctrl.$onInit();
                scope.$digest();
                ctrl.data.types = ["Edge"];
                ctrl.updateFilteredResults();

                expect(ctrl.data.results).toEqual([
                    { 'result type': 'Edge', GROUP: 'BasicEdge1', SOURCE: 'source1', DESTINATION: 'destination1', DIRECTED: true, count: 1, prop1: 'value1', source: 'abc', destination: 'dest4' }
                ]);
                expect(ctrl.data.columns).toEqual(['result type', 'GROUP', 'SOURCE', 'DESTINATION', 'DIRECTED', 'count', 'source', 'destination', 'prop1']);

            });
        });

        describe('ctrl.getValue()', function() {
            beforeEach(function() {
                ctrl.sortType = 'a property with spaces';
            });

            it('should wrap the sort property with quotes', function() {
                expect(ctrl.getValue()).toEqual('"a property with spaces"');
            });

            it('should wrap a property with a minus sign after the minus', function() {
                ctrl.sortType = '-' + ctrl.sortType;
                expect(ctrl.getValue()).toEqual('-"a property with spaces"');
            });
        });

        describe('ctrl.download()', function() {

            var csvPrefix = 'data:text/csv;charset=utf-8,';
            var $filter;

            beforeEach(function() {
                spyOn(window, 'open').and.stub();
            });

            beforeEach(function() {
                ctrl.data = {
                    results: [
                        {
                            'col1': 1,
                            'col2': 'test',
                            'col4': 'def'
                        }, 
                        { 
                            'col1': true,
                            'col2': null,
                            'col3': 'comma test',
                            'col4': 'ghi'
                        }, 
                        {
                            'col1': 'hello',
                            'col4': 'abc'
                        }
                    ],
                    columns: ['col1', 'col2']
                };
            });

            beforeEach(inject(function(_$filter_) {
                $filter = _$filter_;
            }));

            it('should prefix the url with data:text/csv;charset=utf8,', function() {
                ctrl.download();
                expect(window.open.calls.first().args[0].indexOf(csvPrefix)).toEqual(0);
            });


            it('should use the columns selected by the user', function() {

                ctrl.filteredResults = ctrl.data.results;

                var expectedOutput = 
                'col1,col2\r\n' +
                '1,test\r\n' +
                'true,\r\n' +
                'hello,\r\n';

                var encodedOutput = encodeURI(csvPrefix  + expectedOutput);

                ctrl.download();
                expect(window.open.calls.first().args[0]).toEqual(encodedOutput);

            });

            it('should take into account filters entered by the user', function() {
                ctrl.filteredResults = $filter('filter')(ctrl.data.results, 'test');     // mimicking if the user entered 'test' into search box
                var expectedOutput =
                'col1,col2\r\n' +
                '1,test\r\n' +
                'true,\r\n';

                var encodedOutput = encodeURI(csvPrefix + expectedOutput);

                ctrl.download();
                expect(window.open.calls.first().args[0]).toEqual(encodedOutput);

            });
            
            it('should take into account the order specified by the user', function() {
                ctrl.data.columns = ['col1', 'col4'];
                ctrl.sortType = 'col4';
                ctrl.filteredResults = $filter('orderBy')(ctrl.data.results, ctrl.getValue());  // mimicking the order by functionality in the table
                
                var expectedOutput = 
                "col1,col4\r\n" +
                "hello,abc\r\n" +
                "1,def\r\n" +
                "true,ghi\r\n";
                
                var encodedOutput = encodeURI(expectedOutput);

                ctrl.download();
                expect(window.open.calls.first().args[0]).toEqual(csvPrefix + encodedOutput);
            });
        });
    });
});
