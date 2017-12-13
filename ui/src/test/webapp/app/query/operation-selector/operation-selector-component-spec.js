describe('Operation Selector Component', function() {
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
        var $componentController, $q;
        var scope;
        var operationService;

        beforeEach(inject(function(_$componentController_, _$rootScope_, _$q_, _operationService_) {
            $componentController = _$componentController_;
            scope = _$rootScope_.$new();
            $q = _$q_;
            operationService = _operationService_;
        }));

        beforeEach(function() {
            spyOn(operationService, 'reloadNamedOperations').and.callFake(function() {
                return $q.when([1, 2, 3]);
            });
        })

        it('should exist', function() {
            var ctrl = $componentController('operationSelector');
            expect(ctrl).toBeDefined();
        });

        describe('on startup', function() {
            var operationSelectorService;
            var loadNamedOperations = true;

            beforeEach(inject(function(_operationSelectorService_) {
                operationSelectorService = _operationSelectorService_;
            }))

            beforeEach(function() {
                spyOn(operationSelectorService, 'shouldLoadNamedOperationsOnStartup').and.callFake(function() {
                    return $q.when(loadNamedOperations);
                });
            })

            it('should load the named operations if the service returns true', function() {
                loadNamedOperations = true
                var ctrl = $componentController('operationSelector', { $scope: scope });
                ctrl.$onInit();

                scope.$digest();
                expect(operationService.reloadNamedOperations).toHaveBeenCalledTimes(1);
            });

            it('should not load the named operations if the service returns false', function() {
                loadNamedOperations = false
                var ctrl = $componentController('operationSelector', { $scope: scope });
                ctrl.$onInit();

                scope.$digest();
                expect(operationService.reloadNamedOperations).not.toHaveBeenCalled();
            });
        });


        describe('when an operation is selected', function() {
            var queryPage;

            beforeEach(inject(function(_queryPage_) {
                queryPage = _queryPage_;
            }));

            it('should update the queryPage service when a new operation is selected', function() {
                var ctrl = $componentController('operationSelector');
                queryPage.setSelectedOperation({})
                ctrl.onOperationSelect("test");
                expect(queryPage.getSelectedOperation()).toEqual("test");
            });
        });

        describe('when an operation is deselected', function() {
            var queryPage;

            var ctrl;

            beforeEach(inject(function(_queryPage_) {
                queryPage = _queryPage_;
            }));

            beforeEach(function() {
                ctrl = $componentController('operationSelector');
                queryPage.setSelectedOperation({})
            });

            it('should update the queryPage if no operation is selected', function() {
                ctrl.selectedOp = [];
                ctrl.onOperationDeselect(null);

                expect(queryPage.getSelectedOperation()).not.toBeDefined();
            });

            it('should not update the queryPage if another operation is selected', function() {
                ctrl.selectedOp = [ "some operation that will be sent to the query page by a different method"];
                ctrl.onOperationDeselect(null);

                expect(queryPage.getSelectedOperation()).toBeDefined();
                expect(queryPage.getSelectedOperation()).toEqual({})
            });
        });

        describe('when a user clicks the info icon', function() {

            var $window;
            var ctrl;
            var writeSpy;

            beforeEach(inject(function(_$window_) {
                $window = _$window_;
            }));

            beforeEach(function() {
                spyOn($window, 'open').and.callFake(function() {
                    var fakeWindow = {
                        document: {
                            write: jasmine.createSpy('write')
                        }
                    };

                    writeSpy = fakeWindow.document.write;

                    return fakeWindow;
                });
            });

            beforeEach(function() {
                ctrl = $componentController('operationSelector');
                ctrl.showOperations("My operation chain");
            });

            it('should open a new window', function() {
                expect($window.open).toHaveBeenCalledTimes(1);
            });

            it('should write the operation chain of the operation to the screen', function() {
                expect(writeSpy).toHaveBeenCalledTimes(1);
                expect(writeSpy).toHaveBeenCalledWith("<pre>My operation chain</pre>");
            });
        });

        describe('when the user clicks the refresh button', function() {
            var ctrl;

            beforeEach(function() {
                ctrl = $componentController('operationSelector', {$scope: scope});
                ctrl.refreshNamedOperations();
            });

            it('should refresh the named operations', function() {
                expect(operationService.reloadNamedOperations).toHaveBeenCalled();
            });

            it('should update the list of available operations with the results', function() {
                scope.$digest();
                expect(ctrl.availableOperations).toEqual([1, 2, 3]);
            });
        });
    });
});