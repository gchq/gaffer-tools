describe('The Toolbar Component', function() {

    var configForTesting = {};
    var propertiesForTesting = {};
    var schemaForTesting = {};

    beforeEach(function() {
        propertiesForTesting = {};
        configForTesting = {};
        schemaForTesting = {};
    });

    beforeEach(module('app'));

    beforeEach(module(function($provide) {
        $provide.factory('config', function($q) {
            var get = function() {
                return $q.when(configForTesting);
            }

            return {
                get: get
            }
        });

        $provide.factory('properties', function($q) {
            var get = function() {
                return $q.when(propertiesForTesting);
            }

            return {
                get: get
            }
        });

        $provide.factory('query', function($q) {
            return {
                execute: function(opChain, callback) {
                    callback([]);
                },
                getOperations: function() {
                    return [
                        "operation1",
                        "operation2",
                        "operation3"
                    ]
                }
            }
        });

        $provide.factory('schema', function($q) {
            return {
                get: function() {
                    return $q.when(schemaForTesting);
                }
            }
        })
    }))

    describe('The Controller', function() {

        var $componentController;
        var navigation, query, graph, loading, results;
        var $rootScope;
        var scope;

        beforeEach(inject(function(_$componentController_, _navigation_, _$rootScope_, _query_, _graph_, _loading_, _results_) {
            $componentController = _$componentController_;
            navigation = _navigation_;
            $rootScope = _$rootScope_;
            scope = $rootScope.$new();
            query = _query_;
            graph = _graph_;
            loading = _loading_;
            results = _results_;
        }));

        it('should exist', function() {
            var ctrl = $componentController('toolbar');
            expect(ctrl).toBeDefined();
        });

        it('should use the config first service to get the app title', function() {
            configForTesting = { title: "test" };
            var ctrl = $componentController('toolbar', {$scope: scope});
            ctrl.$onInit();

            scope.$digest();

            expect(ctrl.appTitle).toEqual('test');
        });

        it('should use the gaffer properties endpoint if the title is not specified in the config', function() {
            propertiesForTesting = { "gaffer.properties.app.title": "My Super Gaffer Graph" };
            var ctrl = $componentController('toolbar', {$scope: scope});
            ctrl.$onInit();

            scope.$digest();


            expect(ctrl.appTitle).toEqual('My Super Gaffer Graph');
        });

        it('should use the default name "Gaffer" if the title is neither specified in the gaffer properties or the config', function() {
            var ctrl = $componentController('toolbar', {$scope: scope});
            ctrl.$onInit();

            scope.$digest();

            expect(ctrl.appTitle).toEqual('Gaffer');
        });

        describe('ctrl.saveResults()', function() {
            it('should execute a save query', function() {
                configForTesting = {
                   "savedResults": {
                       "enabled": true,
                       "key": "savedResults",
                       "timeToLiveInDays": 7
                   }
                };
                var ctrl = $componentController('toolbar', {$scope: scope});
                ctrl.$onInit();
                scope.$digest();

                spyOn(loading, 'load');
                spyOn(query, 'execute');
                var jobId = "10003"
                spyOn(results, 'get').and.returnValue({"edges":[1,2,3], "entities": [4,5,6], "other": [7,8,9]});
                var resultsArray = [1,2,3,4,5,6,7,8,9];

                ctrl.saveResults();

                expect(loading.load).toHaveBeenCalledTimes(1);
                expect(query.execute).toHaveBeenCalledTimes(1);
                expect(query.execute).toHaveBeenCalledWith(
                    {
                        class: "uk.gov.gchq.gaffer.operation.OperationChain",
                        operations: [
                            {
                                "class" : "uk.gov.gchq.gaffer.operation.impl.export.resultcache.ExportToGafferResultCache",
                                "input" : [
                                    "java.util.ArrayList",
                                    resultsArray
                                ]
                            },
                            {
                                "class" : "uk.gov.gchq.gaffer.operation.impl.DiscardOutput"
                            },
                            {
                                "class" : "uk.gov.gchq.gaffer.operation.impl.job.GetJobDetails"
                            }
                        ]
                    },
                    jasmine.any(Function),
                    jasmine.any(Function)
                );
            });
        });
    });
});
