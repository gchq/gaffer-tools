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
            spyOn(operationService, 'reloadOperations').and.callFake(function() {
                return $q.when([
                    {name: "op Name 1", description: "OP description 1"},
                    {name: "op Name 2", description: "OP description 2"},
                    {name: "op Name 3", description: "OP description 3"}
                ]);
            });
        })

        it('should exist', function() {
            var ctrl = $componentController('operationSelector');
            expect(ctrl).toBeDefined();
        });

        describe('on startup', function() {
            var loadNamedOperations = true;

            it('should load the operations', function() {
                loadNamedOperations = true
                var ctrl = $componentController('operationSelector', { $scope: scope });
                ctrl.$onInit();

                scope.$digest();
                expect(operationService.reloadOperations).toHaveBeenCalledTimes(1);
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

            it('should not select an operation', function() {
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
                expect(ctrl.model).not.toBeDefined();
            });
        });

        describe('when the user clicks the refresh button', function() {
            var ctrl;

            beforeEach(function() {
                ctrl = $componentController('operationSelector', {$scope: scope});
                ctrl.reloadOperations();
            });

            it('should refresh the operations', function() {
                expect(operationService.reloadOperations).toHaveBeenCalled();
            });

            it('should update the list of available operations with the results', function() {
                scope.$digest();
                expect(ctrl.availableOperations).toEqual([
                    {name: "op Name 1", description: "OP description 1", formattedName: "opname1", formattedDescription: "opdescription1"},
                    {name: "op Name 2", description: "OP description 2", formattedName: "opname2", formattedDescription: "opdescription2"},
                    {name: "op Name 3", description: "OP description 3", formattedName: "opname3", formattedDescription: "opdescription3"}
                ]);
            });
        });
    });
});
