describe('The Graph Component', function() {

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
        var $componentController, $timeout, $httpBackend;
        var graph, scope;


        beforeEach(inject(function(_$componentController_, _graph_, _$rootScope_, _$timeout_) {
            $componentController = _$componentController_;
            graph = _graph_;
            var $rootScope = _$rootScope_;
            scope = $rootScope.$new();
            $timeout = _$timeout_;
        }));

        it('should exist', function() {
            var ctrl = $componentController('graph');
            expect(ctrl).toBeDefined();
        });

        it('should load the graph on startup', function() {
            spyOn(graph, 'load').and.callThrough();
            var ctrl = $componentController('graph', {$scope: scope});
            ctrl.$onInit();
            $timeout.flush();
            expect(graph.load).toHaveBeenCalledTimes(1);

        });
    });
});