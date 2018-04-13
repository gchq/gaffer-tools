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
               type: 'Edge',
               group: 'BasicEdge1',
               source: "source1",
               destination: 'destination1',
               directed: true,
               count: 1,
               prop1: 'value1'
           },
           {
               type: 'Edge',
               group: 'BasicEdge1',
               source: "source2",
               destination: 'destination2',
               directed: true,
               count: 2,
               prop1: 'value2'
           },
           {
               type: 'Edge',
               group: 'BasicEdge2',
               source: "source1",
               destination: 'destination1',
               directed: true,
               count: 1,
               prop2: 'value1'
           },
           {
               type: 'Entity',
               group: 'BasicEntity1',
               source: 'vertex1',
               count: 1,
               prop1: 'value1'
           },
           {
               type: 'Entity',
               group: 'BasicEntity1',
               source: 'vertex2',
               count: 2,
               prop1: 'value2'
           },
           {
               type: 'Entity',
               group: 'BasicEntity2',
               source: 'vertex1',
               count: 1,
               prop2: 'value1'
           },
           {
               group: '',
               type: 'String',
               value: 'value1'
           },
           {
               group: '',
               type: 'Integer',
               value: 4
           },
           {
               group: '',
               type: 'EntitySeed',
               source: 'vertex1'
           }
       ],
       columns: [ 'type', 'group', 'source', 'destination', 'directed', 'value', 'count', 'prop1', 'prop2' ],
       allColumns: [ 'type', 'group', 'source', 'destination', 'directed', 'value', 'count', 'prop1', 'prop2' ],
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

            it('should process results', function() {
                expect(results.get).toHaveBeenCalledTimes(1);
                expect(ctrl.data).toEqual(fullData);
            });
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
                    { type: 'Edge', group: 'BasicEdge1', source: 'source1', destination: 'destination1', directed: true, count: 1, prop1: 'value1' },
                    { type: 'Edge', group: 'BasicEdge1', source: 'source2', destination: 'destination2', directed: true, count: 2, prop1: 'value2' },
                    { type: 'Edge', group: 'BasicEdge2', source: 'source1', destination: 'destination1', directed: true, count: 1, prop2: 'value1' },
                    { group: '', type: 'String', value: 'value1' }
                ]);
            });

            it('should update filtered results multiple times and update columns', function() {
                resultsData = fullResultsData;
                spyOn(results, 'get').and.returnValue(resultsData);
                spyOn(events, 'subscribe');
                spyOn(table, 'getCachedValues').and.returnValue(cachedValues);
                ctrl.$onInit();
                scope.$digest();

                ctrl.data.types = ["Edge", "String"];
                ctrl.updateFilteredResults();
                expect(ctrl.data.results).toEqual([
                    { type: 'Edge', group: 'BasicEdge1', source: 'source1', destination: 'destination1', directed: true, count: 1, prop1: 'value1' },
                    { type: 'Edge', group: 'BasicEdge1', source: 'source2', destination: 'destination2', directed: true, count: 2, prop1: 'value2' },
                    { type: 'Edge', group: 'BasicEdge2', source: 'source1', destination: 'destination1', directed: true, count: 1, prop2: 'value1' },
                    { group: '', type: 'String', value: 'value1' }
                ]);
                expect(ctrl.data.columns).toEqual(['type', 'group', 'source', 'destination', 'directed', 'value', 'count', 'prop1', 'prop2']);

                ctrl.data.types = ["Entity"];
                ctrl.updateFilteredResults();
                expect(ctrl.data.results).toEqual([
                    { type: 'Entity', group: 'BasicEntity1', source: 'vertex1', count: 1, prop1: 'value1' },
                    { type: 'Entity', group: 'BasicEntity1', source: 'vertex2', count: 2, prop1: 'value2' },
                    { type: 'Entity', group: 'BasicEntity2', source: 'vertex1', count: 1, prop2: 'value1' }
                ]);
                expect(ctrl.data.columns).toEqual(['type', 'group', 'source', 'count', 'prop1', 'prop2']);

                ctrl.data.types = ["String"];
                ctrl.updateFilteredResults();
                expect(ctrl.data.results).toEqual([
                    { type: 'String', group: '', value: 'value1' },
                ]);
                expect(ctrl.data.columns).toEqual(['type', 'group']);
            });
        });
    });
});
