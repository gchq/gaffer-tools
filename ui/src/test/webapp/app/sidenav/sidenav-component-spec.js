describe('The Navigation Component', function() {

    beforeEach(module('app'));

    var configForTesting = {};

    beforeEach(function() {
        propertiesForTesting = {};
        configForTesting = {};
        schemaForTesting = {};
    });

    beforeEach(module(function($provide) {
        $provide.factory('config', function($q) {
            var get = function() {
                return $q.when(configForTesting);
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
        var navigation, config, $rootScope, $q;

        beforeEach(inject(function(_$componentController_, _navigation_, _config_, _$rootScope_, _$q_) {
            $componentController = _$componentController_;
            navigation = _navigation_;
            config = _config_;
            $rootScope = _$rootScope_;
            $q = _$q_;
        }));

        it('should exist', function() {
            var ctrl = $componentController('sidenav');
            expect(ctrl).toBeDefined();
        });

        describe('ctrl.$onInit', function() {
            var ctrl;
            beforeEach(function() {
                ctrl = $componentController('sidenav');
            });

            it('should load pages from config', function() {
                configForTesting = {
                    pages: [
                        {
                            id: "page1"
                        },
                        {
                            id: "page2"
                        }
                    ]
                };
                spyOn(config, 'get').and.callFake(function() {
                    return $q.when(configForTesting);
                })

                ctrl.$onInit();

                $rootScope.$digest()
                expect(ctrl.pages).toEqual(configForTesting.pages);
            });

            it('should not override pages if there are no pages in config', function() {
                configForTesting = {
                    pages: []
                };
                spyOn(config, 'get').and.callFake(function() {
                    return $q.when(configForTesting);
                })

                ctrl.$onInit();

                $rootScope.$digest()
                expect(ctrl.pages).toEqual([
                   {
                     "id": "query",
                     "title": "Query",
                     "icon": "query"
                   },
                   {
                     "id": "table",
                     "title": "Table",
                     "icon": "table"
                   },
                   {
                     "id": "graph",
                     "title": "Graph",
                     "icon": "graph"
                   },
                   {
                     "id": "schema",
                     "title": "Schema",
                     "icon": "schema"
                   },
                   {
                     "id": "raw",
                     "title": "Raw",
                     "icon": "raw"
                   },
                   {
                     "id": "settings",
                     "title": "Settings",
                     "icon": "settings"
                   }
               ]);
            });
        });

        describe('sidenav controls', function() {
            var ctrl;
            beforeEach(function() {
                ctrl = $componentController('sidenav');
            });

            it('should collapse the sidenav', function() {
                ctrl.collapse();
                expect(ctrl.collapsed).toBeTruthy();
            });

            it('should expand the sidenav', function() {
                ctrl.expand();
                expect(ctrl.collapsed).toBeFalsy();
            });
        });
    });
});
