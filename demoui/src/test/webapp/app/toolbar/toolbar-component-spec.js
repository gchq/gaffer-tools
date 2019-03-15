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
        var navigation, query, graph;;
        var $rootScope;
        var scope;

        beforeEach(inject(function(_$componentController_, _navigation_, _$rootScope_, _query_, _graph_) {
            $componentController = _$componentController_;
            navigation = _navigation_;
            $rootScope = _$rootScope_;
            scope = $rootScope.$new();
            query = _query_;
            graph = _graph_;
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
    });
});
