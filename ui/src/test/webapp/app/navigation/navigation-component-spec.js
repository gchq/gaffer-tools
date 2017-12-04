describe('The navigation component', function() {

    var scope;
    var element;
    var configForTesting = {};
    var gafferProperties = {};

    beforeEach(function() {
        gafferProperties = {};
        configForTesting = {};
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
                return $q.when(gafferProperties);
            }

            return {
                get: get
            }
        });

        $provide.factory('query', function($q) {
            return {
                execute: function(opChain) {
                    return $q.when([]);
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
    }))

    beforeEach(inject(function($rootScope, $compile) {
        scope = $rootScope.$new();
        element = angular.element('<nav-bar></nav-bar>');

        element = $compile(element)(scope);
    }));

    it('should exist', function() {
        expect(element).toBeDefined();
    });

    describe('The Navigation Controller', function() {

        var $componentController;
        var navigation;
        var $rootScope;
        var query;
        var graph;

        beforeEach(inject(function(_$componentController_, _navigation_, _$rootScope_, _query_, _graph_) {
            $componentController = _$componentController_;
            navigation = _navigation_;
            $rootScope = _$rootScope_;
            query = _query_;
            graph = _graph_;
        }));

        it('should exist', function() {
            var ctrl = $componentController('navBar');
            expect(ctrl).toBeDefined();
        });

        it('should use the config first service to get the app title', function(done) {
            configForTesting = { title: "test" };
            var ctrl = $componentController('navBar');
            done();

            expect(ctrl.appTitle).toEqual('test');
        });

        it('should use the gaffer properties endpoint if the title is not specified in the config', function(done) {
             gafferProperties = { "gaffer.properties.app.title": "My Super Gaffer Graph" };
             var ctrl = $componentController('navBar');
             done();

             expect(ctrl.appTitle).toEqual('My Super Gaffer Graph');
        });

        it('should use the default name "Gaffer" if the title is neither specified in the gaffer properties or the config', function(done) {
            var ctrl = $componentController('navBar');
            done();

            expect(ctrl.appTitle).toEqual('Gaffer');
        });

        it('should update the current page when an external component updates the route', function(done) {
            var ctrl = $componentController('navBar');
            navigation.goTo('settings');
            done();

            expect(ctrl.currentPage).toEqual('settings');
        });

        it('should listen to $rootScope broadcasts for a route change and update the navigation service', function(done) {
            var ctrl = $componentController('navBar');
            navigation.goTo('settings');
            $rootScope.$broadcast('routeChangeSuccess', 'graph');
            done();

            expect(ctrl.currentPage).toEqual('graph');
            expect(navigation.getCurrentPage()).toEqual('graph');
        });

        it('should Execute all operations in order', function(done) {
            var ctrl = $componentController('navBar');
            spyOn(query, 'execute');

            ctrl.executeAll();
            done();

            expect(query.execute).toHaveBeenCalledTimes(3);

            expect(query.execute.calls.argsFor(0)).toEqual('operation1');
            expect(query.execute.calls.argsFor(1)).toEqual('operation2');
            expect(query.execute.calls.argsFor(2)).toEqual('operation3');
        });

        it('should redraw the graph', function() {
            spyOn(graph, 'redraw');
            var ctrl = $componentController('navBar');

            ctrl.redraw();

            expect(graph.redraw).toHaveBeenCalledTimes(1);
        });
    });
});