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

        it('should use a pagination limit of 50 by default', function() {
            expect(ctrl.pagination.limit).toEqual(50);
        });

        it('should set the page to 1 by default', function() {
            expect(ctrl.pagination.page).toEqual(1);
        });

        describe('ctrl.$onInit()', function() {
            beforeEach(function() {
                spyOn(results, 'get').and.returnValue(resultsData);
                spyOn(events, 'subscribe');
                spyOn(table, 'getCachedValues').and.callFake(function() {
                    return cachedValues
                });
            });

            it('should fetch schema', function() {
                ctrl.$onInit();
                scope.$digest();
                expect(schema.get).toHaveBeenCalledTimes(1);
            });

            it('should process empty results', function() {
                ctrl.$onInit();
                scope.$digest();
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
                ctrl.$onInit();
                scope.$digest();
                expect(table.getCachedValues).toHaveBeenCalledTimes(1);
                expect(ctrl.sortType).toEqual(undefined);
                expect(ctrl.searchTerm).toEqual(undefined);
            });

            it('should not load empty pagination values from the table service', function() {
                ctrl.$onInit();
                scope.$digest();
                expect(table.getCachedValues).toHaveBeenCalledTimes(1);
                expect(ctrl.pagination).toEqual({page: 1, limit: 50});
            });

            it('should load pagination values if they are defined', function() {
                cachedValues = {
                    pagination: { page: 2, limit: 100 }
                }
                ctrl.$onInit();
                scope.$digest();
                expect(table.getCachedValues).toHaveBeenCalledTimes(1);
                expect(ctrl.pagination).toEqual({page: 2, limit: 100});
            });

            it('should subscribe to results updated events', function() {
                ctrl.$onInit();
                scope.$digest();
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
                    sortType: "destination",
                    chart: undefined,
                    showVisualisation: undefined,
                    pagination: {
                        limit: 50,
                        page: 1
                    }
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

            it('should not convert string properties which are numbers into their numerical value', function() {
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

                expect(ctrl.data.results[0]['numberProp']).toEqual('123');
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

        describe('ctrl.getTruncatedValue()', function() {
            var longValue = "1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890";
            var truncatedValue = longValue.substring(0, 497);
            it('should truncate long values', function() {
                expect(ctrl.getTruncatedValue(longValue)).toEqual(truncatedValue);
            });

            var shortValue = "test value";
            it('should not truncate short values', function() {
                expect(ctrl.getTruncatedValue(shortValue)).toEqual(shortValue);
            });

            var numberValue = 1234567890;
            it('should not truncate number values', function() {
                expect(ctrl.getTruncatedValue(numberValue)).toEqual(numberValue);
            });

            var objValue = {"test": 1234567890};
            it('should not truncate number values', function() {
                expect(ctrl.getTruncatedValue(objValue)).toEqual(objValue);
            });
        });

        describe('ctrl.showValueDialog()', function() {
            var $mdDialog;

            beforeEach(inject(function(_$mdDialog_) {
                $mdDialog = _$mdDialog_;
            }));


            it('should show the full value in a dialog' ,function() {
                spyOn($mdDialog, 'show').and.returnValue($q.when('test'));

                ctrl.showValueDialog('property name', 'property value');

                scope.$digest();

                var fullValueDialog = $mdDialog.confirm()
                      .title('Full property name value')
                      .textContent('property value')
                      .ok('Ok');
                expect($mdDialog.show).toHaveBeenCalledWith(fullValueDialog);
            });
        });

        describe('ctrl.download()', function() {

            var fakeElement;

            var expectedData;

            beforeEach(function() {
                fakeElement = {
                    click: jasmine.createSpy('click')
                }
            });

            beforeEach(function() {
                spyOn(document, 'createElement').and.returnValue(fakeElement);
                spyOn(document.body, 'appendChild');
                spyOn(document.body, 'removeChild');
                
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

            it('should create an element', function() {
                ctrl.download();
                expect(document.body.appendChild).toHaveBeenCalledWith(fakeElement);
            });

            it('should set the default file name to gaffer_results_ plus the current time', function() {
                spyOn(Date, 'now').and.returnValue('current-time');
                ctrl.download();
                expect(fakeElement.download).toEqual('gaffer_results_current-time.csv');
            });

            it('should remove the element', function() {
                ctrl.download();
                expect(document.body.removeChild).toHaveBeenCalledWith(fakeElement);
            });

            it('should use an object url based on the text from the CSV', function(done) {

                ctrl.filteredResults = ctrl.data.results;

                var expectedOutput = 'col1,col2\r\n' +
                '1,test\r\n' +
                'true,\r\n' +
                'hello,\r\n';

                spyOn(URL, 'createObjectURL').and.callFake(function(obj) {
                    var reader = new FileReader();
                    reader.addEventListener('loadend', function() {
                        var rawString = String.fromCharCode.apply(null, new Uint8Array(reader.result));
                        expect(rawString).toEqual(expectedOutput);
                        done();
                    });

                    reader.readAsArrayBuffer(obj);

                    return 'irrelevant';
                });

                ctrl.download();
                

            });

            it('should use the columns selected by the user', function(done) {

                ctrl.filteredResults = ctrl.data.results;
                
                ctrl.data.columns = ['col1']

                var expectedOutput = 'col1\r\n' +
                '1\r\n' +
                'true\r\n' +
                'hello\r\n';

                spyOn(URL, 'createObjectURL').and.callFake(function(obj) {
                    var reader = new FileReader();
                    reader.addEventListener('loadend', function() {
                        var rawString = String.fromCharCode.apply(null, new Uint8Array(reader.result));
                        expect(rawString).toEqual(expectedOutput);
                        done();
                    });

                    reader.readAsArrayBuffer(obj);

                    return 'irrelevant';
                });


                ctrl.download();

            });

            it('should take into account filters entered by the user', function(done) {
                ctrl.filteredResults = $filter('filter')(ctrl.data.results, 'test');     // mimicking if the user entered 'test' into search box
                
                var expectedOutput =
                'col1,col2\r\n' +
                '1,test\r\n' +
                'true,\r\n';


                spyOn(URL, 'createObjectURL').and.callFake(function(obj) {
                    var reader = new FileReader();
                    reader.addEventListener('loadend', function() {
                        var rawString = String.fromCharCode.apply(null, new Uint8Array(reader.result));
                        expect(rawString).toEqual(expectedOutput);
                        done();
                    });

                    reader.readAsArrayBuffer(obj);

                    return 'irrelevant';
                });

                ctrl.download();

            });
            
            it('should take into account the order specified by the user', function(done) {
                ctrl.data.columns = ['col1', 'col4'];
                ctrl.sortType = 'col4';
                ctrl.filteredResults = $filter('orderBy')(ctrl.data.results, ctrl.getValue());  // mimicking the order by functionality in the table
                
                var expectedOutput = 
                "col1,col4\r\n" +
                "hello,abc\r\n" +
                "1,def\r\n" +
                "true,ghi\r\n";
                
                spyOn(URL, 'createObjectURL').and.callFake(function(obj) {
                    var reader = new FileReader();
                    reader.addEventListener('loadend', function() {
                        var rawString = String.fromCharCode.apply(null, new Uint8Array(reader.result));
                        expect(rawString).toEqual(expectedOutput);
                        done();
                    });

                    reader.readAsArrayBuffer(obj);

                    return 'irrelevant';
                });

                ctrl.download();
            });

            it('should release the Object url once clicked', function() {
                spyOn(URL, 'revokeObjectURL');

                ctrl.download();

                expect(URL.revokeObjectURL).toHaveBeenCalledWith(fakeElement.href);
            });
        });

        describe('ctrl.createVisualisation()', function() {
            var $mdDialog;

            beforeEach(inject(function(_$mdDialog_) {
                $mdDialog = _$mdDialog_;
            }));



            it('should set the controllers chart to the return value' ,function() {
                spyOn($mdDialog, 'show').and.returnValue($q.when('test'));

                ctrl.createVisualisation();

                // not resolved yet

                expect(ctrl.chart).toBeUndefined();

                scope.$digest();

                expect(ctrl.chart).toEqual('test');
            });

            it('should set the showVisualisation flag to true if resolved', function() {
                spyOn($mdDialog, 'show').and.returnValue($q.when('test'));
                ctrl.createVisualisation();

                // not resolved yet

                expect(ctrl.showVisualisation).toBeUndefined();

                scope.$digest();

                expect(ctrl.showVisualisation).toBeTruthy();
            });

            it('should do nothing if the promise is rejected', function() {
                var deferred = $q.defer();

                spyOn($mdDialog, 'show').and.returnValue(deferred.promise);
                ctrl.createVisualisation();

                deferred.reject();

                expect(function() {
                    scope.$digest();
                }).not.toThrow();

                expect(ctrl.showVisualisation).toBeFalsy();
                expect(ctrl.chart).toBeUndefined();
            });


        });
    });
});
