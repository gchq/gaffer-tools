describe('The Saved Results component', function() {

    var ctrl;
    var $componentController;

    var loading, query, graph, error, navigation, events;

    beforeEach(module('app'));

    beforeEach(inject(function(_$componentController_, _loading_, _query_, _graph_, _error_, _navigation_, _events_) {
        $componentController =_$componentController_;
        loading = _loading_;
        query = _query_;
        graph = _graph_;
        error = _error_;
        navigation = _navigation_;
        events = _events_;
    }));

    beforeEach(function() {
        ctrl = $componentController('savedResults');
        localStorage.clear("savedResults");
    });

    describe('ctrl.$onInit()', function() {
        it('should get the saved results from local storage and order them', function() {
            var savedResults = [
                {
                    "localId": "something1",
                    "jobId": "10001",
                    "timestamp": 100000
                },
                {
                    "localId": "something2",
                    "jobId": "10002",
                    "timestamp": 100003
                },
                {
                    "localId": "something3",
                    "jobId": "10003",
                    "timestamp": 100002
                }
            ];
            var savedResultsOrdered = [
                {
                    "localId": "something2",
                    "jobId": "10002",
                    "timestamp": 100003
                },
                {
                    "localId": "something3",
                    "jobId": "10003",
                    "timestamp": 100002
                },
                {
                    "localId": "something1",
                    "jobId": "10001",
                    "timestamp": 100000
                }
            ];
            localStorage.setItem("savedResults", JSON.stringify(savedResults));
            
            ctrl.$onInit();

            expect(ctrl.savedResults).toEqual(savedResultsOrdered);
        });
    });

    describe('ctrl.updateSavedResults()', function() {
        it('should updated the saved results', function() {
            var savedResults = [
                {
                    "localId": "something2",
                    "jobId": "10002",
                    "timestamp": 100003
                },
                {
                    "localId": "something3",
                    "jobId": "10003",
                    "timestamp": 100002
                },
                {
                    "localId": "something1",
                    "jobId": "10001",
                    "timestamp": 100000
                }
            ];
            var savedResultsUpdated = [
                {
                    "localId": "updated id",
                    "jobId": "10002",
                    "timestamp": 100003,
                    "edit": false
                },
                {
                    "localId": "something3",
                    "jobId": "10003",
                    "timestamp": 100002,
                    "edit": false
                },
                {
                    "localId": "something1",
                    "jobId": "10001",
                    "timestamp": 100000,
                    "edit": false
                }
            ];
            localStorage.setItem("savedResults", JSON.stringify(savedResults));
            ctrl.$onInit();
            ctrl.savedResults[0].edit=true;
            ctrl.savedResults[0].localId="updated id";

            ctrl.updateSavedResults();

            expect(ctrl.savedResults).toEqual(savedResultsUpdated);
            expect(localStorage.getItem("savedResults")).toEqual(JSON.stringify(savedResultsUpdated))
        });
    });

    describe('ctrl.deleteSavedResults()', function() {
        it('should delete a saved results item', function() {
            var savedResults = [
                {
                    "localId": "something2",
                    "jobId": "10002",
                    "timestamp": 100003
                },
                {
                    "localId": "something3",
                    "jobId": "10003",
                    "timestamp": 100002
                },
                {
                    "localId": "something1",
                    "jobId": "10001",
                    "timestamp": 100000
                }
            ];
            var savedResultsUpdated = [
                {
                    "localId": "something2",
                    "jobId": "10002",
                    "timestamp": 100003
                },
                {
                    "localId": "something1",
                    "jobId": "10001",
                    "timestamp": 100000
                }
            ];
            localStorage.setItem("savedResults", JSON.stringify(savedResults));
            ctrl.$onInit();

            ctrl.deleteSavedResults("10003");

            expect(ctrl.savedResults).toEqual(savedResultsUpdated);
            expect(localStorage.getItem("savedResults")).toEqual(JSON.stringify(savedResultsUpdated))
        });
    });

    describe('ctrl.deleteAllSavedResults()', function() {
        it('should delete all saved results', function() {
            var savedResults = [
                {
                    "localId": "something2",
                    "jobId": "10002",
                    "timestamp": 100003
                },
                {
                    "localId": "something3",
                    "jobId": "10003",
                    "timestamp": 100002
                },
                {
                    "localId": "something1",
                    "jobId": "10001",
                    "timestamp": 100000
                }
            ];
            var savedResultsUpdated = [];
            localStorage.setItem("savedResults", JSON.stringify(savedResults));
            ctrl.$onInit();

            ctrl.deleteAllSavedResults();

            expect(ctrl.savedResults).toEqual(savedResultsUpdated);
            expect(localStorage.getItem("savedResults")).toEqual(JSON.stringify(savedResultsUpdated))
        });
    });

    describe('ctrl.reloadSavedResults()', function() {
        it('should reload saved results successfully', function() {
            spyOn(loading, 'load');
            spyOn(query, 'executeQuery');
            var jobId = "10003"

            ctrl.$onInit();

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
