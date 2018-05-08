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
        var $routeParams;

        beforeEach(inject(function(_$componentController_, _$rootScope_, _$q_, _operationService_, _$routeParams_) {
            $componentController = _$componentController_;
            scope = _$rootScope_.$new();
            $q = _$q_;
            operationService = _operationService_;
            $routeParams = _$routeParams_;
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

            it('should select the operation defined in the query operation parameter', function() {
                loadNamedOperations = false
                $routeParams.operation = "operationX";
                var ctrl = $componentController('operationSelector', { $scope: scope });
                var availableOperations = [
                    {
                        name: "GetElements"
                    },
                    {
                        name: "operationX"
                    }
                ]
                spyOn(operationService, 'getAvailableOperations').and.returnValue($q.when(availableOperations));
                ctrl.$onInit();

                scope.$digest();
                expect(ctrl.model.name).toEqual('operationX');
            });

            it('should select the operation defined in the query operation parameter case insensitive and strip symbols', function() {
                loadNamedOperations = false
                $routeParams.operation = "operation-x.";
                var ctrl = $componentController('operationSelector', { $scope: scope });
                var availableOperations = [
                    {
                        name: "GetElements"
                    },
                    {
                        name: "operationX"
                    }
                ]
                spyOn(operationService, 'getAvailableOperations').and.returnValue($q.when(availableOperations));
                ctrl.$onInit();

                scope.$digest();
                expect(ctrl.model.name).toEqual('operationX');
            });

            it('should select the operation defined in the query op parameter', function() {
                loadNamedOperations = false
                $routeParams.op = "operationX";
                var ctrl = $componentController('operationSelector', { $scope: scope });
                var availableOperations = [
                    {
                        name: "GetElements"
                    },
                    {
                        name: "operationX"
                    }
                ]
                spyOn(operationService, 'getAvailableOperations').and.returnValue($q.when(availableOperations));
                ctrl.$onInit();

                scope.$digest();
                expect(ctrl.model.name).toEqual('operationX');
            });

            it('should not select an operation if the query op is not found', function() {
                loadNamedOperations = false
                $routeParams.op = "unknownOp";
                var ctrl = $componentController('operationSelector', { $scope: scope });
                ctrl.selectedOp = undefined;
                var availableOperations = [
                    {
                        name: "GetElements"
                    },
                    {
                        name: "operationX"
                    }
                ]
                spyOn(operationService, 'getAvailableOperations').and.returnValue($q.when(availableOperations));
                ctrl.$onInit();

                scope.$digest();
                expect(ctrl.model.name).toEqual("GetElements");
            });

            describe('when selecting the default selected operation', function() {
                var ctrl;

                beforeEach(function() {
                    ctrl = $componentController('operationSelector', {$scope: scope});
                });

                it('should set it to the selected operation in the model, if defined', function() {
                    loadNamedOperations = true;
                    ctrl.model = 'test';
                    ctrl.$onInit();
                    scope.$digest();

                    expect(ctrl.model).toEqual('test');
                });

                it('should set it to the first operation in the array if not defined in the queryPage service', function() {
                    loadNamedOperations = true;
                    ctrl.$onInit();
                    scope.$digest();

                    expect(ctrl.model).toEqual(1);
                });

                it('should set it to undefined if no operations are returned in the available operations array or queryPage service', function() {
                    spyOn(operationService, 'getAvailableOperations').and.returnValue($q.when([]));
                    loadNamedOperations = false;
                    ctrl.$onInit();
                    scope.$digest();

                    expect(ctrl.model).not.toBeDefined();
                });
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
