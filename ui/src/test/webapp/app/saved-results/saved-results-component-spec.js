describe('The Saved Results component', function() {

    var ctrl;
    var $componentController;
    var conf = {
        "savedResults": {
            "enabled": true,
            "key": "savedResults",
            "timeToLiveInDays": 7
        }
    };
    var scope;
    var loading, query, graph, error, navigation, events, $cookies;
    var now = new Date().getTime();
    var now_minus_1 = now - 24*60*60*1000;
    var now_minus_2 = now - 2 * 24*60*60*1000;

    beforeEach(module('app'));

    beforeEach(module(function($provide) {
        $provide.factory('config', function($q) {
            var get = function() {
                return $q.when(conf);
            }

            return {
                get: get
            }
        });
    }));

    beforeEach(inject(function(_$componentController_, _loading_, _query_, _graph_, _error_, _navigation_, _events_, _$cookies_, _$rootScope_) {
        $componentController =_$componentController_;
        loading = _loading_;
        query = _query_;
        graph = _graph_;
        error = _error_;
        navigation = _navigation_;
        events = _events_;
        $cookies = _$cookies_;
        scope = _$rootScope_.$new();
    }));

    beforeEach(function() {
        ctrl = $componentController('savedResults');
    });

    describe('ctrl.$onInit()', function() {
        it('should get the saved results and order them', function() {

            var savedResults = [
                {
                    "localId": "something1",
                    "jobId": "10001",
                    "timestamp": now_minus_2
                },
                {
                    "localId": "something2",
                    "jobId": "10002",
                    "timestamp": now
                },
                {
                    "localId": "something3",
                    "jobId": "10003",
                    "timestamp": now_minus_1
                }
            ];
            var savedResultsOrdered = [
                {
                    "localId": "something2",
                    "jobId": "10002",
                    "timestamp": now
                },
                {
                    "localId": "something3",
                    "jobId": "10003",
                    "timestamp": now_minus_1
                },
                {
                    "localId": "something1",
                    "jobId": "10001",
                    "timestamp": now_minus_2
                }
            ];
            $cookies.remove(conf.savedResults.key);
            $cookies.putObject(conf.savedResults.key, savedResults);
            
            ctrl.$onInit();
            scope.$digest();

            expect(ctrl.savedResults).toEqual(savedResultsOrdered);
        });
    });

    describe('ctrl.updateSavedResults()', function() {
        it('should updated the saved results', function() {
            var savedResults = [
                {
                    "localId": "something2",
                    "jobId": "10002",
                    "timestamp": now
                },
                {
                    "localId": "something3",
                    "jobId": "10003",
                    "timestamp": now_minus_1
                },
                {
                    "localId": "something1",
                    "jobId": "10001",
                    "timestamp":  now_minus_2
                }
            ];
            var savedResultsUpdated = [
                {
                    "localId": "updated id",
                    "jobId": "10002",
                    "timestamp": now,
                    "edit": false
                },
                {
                    "localId": "something3",
                    "jobId": "10003",
                    "timestamp": now_minus_1,
                    "edit": false
                },
                {
                    "localId": "something1",
                    "jobId": "10001",
                    "timestamp":  now_minus_2,
                    "edit": false
                }
            ];
            $cookies.remove(conf.savedResults.key);
            $cookies.putObject(conf.savedResults.key, savedResults);
            ctrl.$onInit();
            scope.$digest();
            ctrl.savedResults[0].edit=true;
            ctrl.savedResults[0].localId="updated id";

            ctrl.updateSavedResults();

            expect(ctrl.savedResults).toEqual(savedResultsUpdated);
            expect($cookies.getObject("savedResults")).toEqual(savedResultsUpdated)
        });
    });

    describe('ctrl.deleteSavedResults()', function() {
        it('should delete a saved results item', function() {
            var savedResults = [
                {
                    "localId": "something2",
                    "jobId": "10002",
                    "timestamp": now
                },
                {
                    "localId": "something3",
                    "jobId": "10003",
                    "timestamp": now_minus_1
                },
                {
                    "localId": "something1",
                    "jobId": "10001",
                    "timestamp":  now_minus_2
                }
            ];
            var savedResultsUpdated = [
                {
                    "localId": "something2",
                    "jobId": "10002",
                    "timestamp": now,
                    "edit": false
                },
                {
                    "localId": "something1",
                    "jobId": "10001",
                    "timestamp":  now_minus_2,
                    "edit": false
                }
            ];
            $cookies.remove(conf.savedResults.key);
            $cookies.putObject(conf.savedResults.key, savedResults);
            ctrl.$onInit();
            scope.$digest();
            ctrl.deleteSavedResults("10003");

            expect(ctrl.savedResults).toEqual(savedResultsUpdated);
            expect($cookies.getObject("savedResults")).toEqual(savedResultsUpdated);
        });
    });

    describe('ctrl.deleteAllSavedResults()', function() {
        it('should delete all saved results', function() {
            var savedResults = [
                {
                    "localId": "something2",
                    "jobId": "10002",
                    "timestamp": now
                },
                {
                    "localId": "something3",
                    "jobId": "10003",
                    "timestamp": now_minus_1
                },
                {
                    "localId": "something1",
                    "jobId": "10001",
                    "timestamp":  now_minus_2
                }
            ];
            var savedResultsUpdated = [];
            $cookies.remove(conf.savedResults.key);
            $cookies.putObject(conf.savedResults.key, savedResults);
            ctrl.$onInit();
            scope.$digest();
            ctrl.deleteAllSavedResults();

            expect(ctrl.savedResults).toEqual(savedResultsUpdated);
            expect($cookies.getObject("savedResults")).toEqual(savedResultsUpdated)
        });
    });

    describe('ctrl.reloadSavedResults()', function() {
        it('should reload saved results successfully', function() {
            spyOn(loading, 'load');
            spyOn(query, 'executeQuery');
            var jobId = "10003"

            ctrl.$onInit();
            scope.$digest();
            ctrl.reloadSavedResults(jobId);

            expect(loading.load).toHaveBeenCalledTimes(1);
            expect(query.executeQuery).toHaveBeenCalledTimes(1);
            expect(query.executeQuery).toHaveBeenCalledWith(
                {
                  "class": "uk.gov.gchq.gaffer.operation.impl.export.resultcache.GetGafferResultCacheExport",
                  "jobId": jobId
                },
                jasmine.any(Function)
            );
        });
    });
});
