describe('The Sidenav Component', function() {

    beforeEach(module('app'));

    describe('The Controller', function() {

        var $componentController, $rootScope;
        var navigation, $route;

        beforeEach(inject(function(_$componentController_, _$rootScope_, _$q_, _navigation_, _$route_, _operationOptions_, _config_) {
            $componentController = _$componentController_;
            $rootScope = _$rootScope_;
            $q = _$q_;
            navigation = _navigation_;
            $route = _$route_;
            operationOptions = _operationOptions_;
            config = _config_;
        }));

        beforeEach(function() {
            ctrl = $componentController('sidenav');
            scope = $rootScope.$new();

            params = {graphId: 'testGraphId2'};
            spyOn(ctrl, 'getRouteParams').and.returnValue(params);
            spyOn(ctrl, 'getCurrentURL').and.returnValue('http://localhost:8080/#!/settings?graphId=test')
            spyOn($route, 'reload').and.stub();
        });

        it('should exist', function() {
            expect(ctrl).toBeDefined();
        });

        describe('when initialised', function() {
            it('should load routes', function() {
                expect(ctrl.routes).toEqual($route.routes);
            });

            it('should configure goTo', function() {
                expect(ctrl.goTo).toEqual(navigation.goTo);
            });
        });

        describe('ctrl.$onInit', function() {
            beforeEach(function() {

                 defaultConfig = {
                    title: "test title1",
                    restEndpoint: "defaultEndpoint",
                    types: {
                        "test.class1": {
                            "value": 1
                        },
                        "test.class2": {
                            "value": 1
                        }
                    },
                    operations: {
                    }
                };

            });

            it('should listen for hashchanges in the URL', function() {
                spyOn(window, 'addEventListener').and.stub();

                ctrl.$onInit();

                expect(window.addEventListener).toHaveBeenCalledWith('hashchange', jasmine.any(Function));
            });

            it('should save the new config', function() {
                spyOn(operationOptions, 'setDefaultConfiguration').and.stub();
                deferred = $q.defer();
                spyOn(config, "get").and.returnValue(deferred.promise);

                ctrl.$onInit();

                deferred.resolve(defaultConfig);
                scope.$apply();

                expect(operationOptions.setDefaultConfiguration).toHaveBeenCalled();
            });

            it('should update the URL parameters', function() {
                spyOn(ctrl, 'saveURLParameters').and.stub();
                deferred = $q.defer()
                spyOn(config, "get").and.returnValue(deferred.promise)


                ctrl.$onInit();

                deferred.resolve(defaultConfig);
                scope.$apply();

                expect(ctrl.saveURLParameters).toHaveBeenCalled();
            });
        });

        describe('ctrl.saveURLParameters', function() {
            it('should load the config', function() {
                spyOn(operationOptions, 'getDefaultConfiguration').and.stub();

                ctrl.saveURLParameters();

                expect(operationOptions.getDefaultConfiguration).toHaveBeenCalled();
            });

            it('should save the config with the new URL parameters', function() {

                var optionsConfigBefore = {
                    visible: [
                        {
                            key: 'marco',
                            label: 'Marco'
                        },
                        {
                            key: 'gaffer.federatedstore.operation.graphIds',
                            value: ['testGraphId1']
                        }
                    ],
                    hidden: [
                        {
                            key: 'key1',
                            label: 'Key one',
                            value: 2
                        },
                        {
                            key: 'foo',
                            label: 'Foo but more readable'
                        },
                        {
                            key: 'bar',
                            label: 'bar'
                        }
                    ]
                };

                var optionsConfigAfter = {
                    visible: [
                        {
                            key: 'marco',
                            label: 'Marco'
                        },
                        {
                            key: 'gaffer.federatedstore.operation.graphIds',
                            value: ['testGraphId2']
                        }
                    ],
                    hidden: [
                        {
                            key: 'key1',
                            label: 'Key one',
                            value: 2
                        },
                        {
                            key: 'foo',
                            label: 'Foo but more readable'
                        },
                        {
                            key: 'bar',
                            label: 'bar'
                        }
                    ]
                };

                spyOn(operationOptions, 'getDefaultConfiguration').and.returnValue(optionsConfigBefore);
                spyOn(operationOptions, 'setDefaultConfiguration').and.stub();

                ctrl.saveURLParameters();

                expect(operationOptions.setDefaultConfiguration).toHaveBeenCalledWith(optionsConfigAfter);
            });

            it('should reload the page if on the settings page', function() {
                
                ctrl.saveURLParameters();

                expect($route.reload).toHaveBeenCalled();
            });
        });

        describe('sidenav controls', function() {
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
