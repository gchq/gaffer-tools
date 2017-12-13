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
                ctrl.selectedOp = 'test'
                ctrl.updateModel();
                expect(queryPage.getSelectedOperation()).toEqual("test");
            });
        });

        describe('when a user clicks the more info icon', function() {

            var $mdDialog;
            var ctrl;

            beforeEach(inject(function(_$mdDialog_) {
                $mdDialog = _$mdDialog_;
            }));

            beforeEach(function() {
                spyOn($mdDialog, 'show');
            });

            beforeEach(function() {
                ctrl = $componentController('operationSelector');
                ctrl.selectedOp = "testOperation";
                ctrl.showOperationInfo();
            });

            it('should open a new dialog', function() {
                expect($mdDialog.show).toHaveBeenCalledTimes(1);
            });

            it('should pass the selected operation as an argument', function() {
                expect($mdDialog.show.calls.argsFor(0)[0]).toEqual(jasmine.objectContaining({locals: {operation: "testOperation"}}));
            });

            it('should pass the operation-info.html to the dialog', function() {
                expect($mdDialog.show.calls.argsFor(0)[0]).toEqual(jasmine.objectContaining({templateUrl: 'app/query/operation-selector/operation-info/operation-info.html'}));
            });

            it('should pass the name of the controller to the dialog', function() {
                expect($mdDialog.show.calls.argsFor(0)[0]).toEqual(jasmine.objectContaining({controller: 'OperationInfoController'}));
            });

            it('should bind the controller to the dialog using controllerAs', function() {
                expect($mdDialog.show.calls.argsFor(0)[0]).toEqual(jasmine.objectContaining({controllerAs: 'ctrl'}));
            });

            it('should allow the user to click outside the dialog to close it', function() {
                expect($mdDialog.show.calls.argsFor(0)[0]).toEqual(jasmine.objectContaining({clickOutsideToClose: true}));
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