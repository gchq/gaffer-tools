describe('Operation Selector Component', function() {
    
    var ctrl;

    var $componentController, $q;
    var scope;
    var operationService;
    var $routeParams;

    var availableOperations = [
        {name: "op Name 1", description: "OP description 1"},
        {name: "op Name 2", description: "OP description 2"},
        {name: "op Name 3", description: "OP description 3"}
    ];
    
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
        

    beforeEach(inject(function(_$componentController_, _$rootScope_, _$q_, _operationService_, _$routeParams_) {
        $componentController = _$componentController_;
        scope = _$rootScope_.$new();
        $q = _$q_;
        operationService = _operationService_;
        $routeParams = _$routeParams_;
    }));

    beforeEach(function() {
        ctrl = $componentController('operationSelector', {$scope: scope});
    });

    beforeEach(function() {
        spyOn(operationService, 'reloadOperations').and.callFake(function() {
            return $q.when(availableOperations);
        });
    })

    it('should exist', function() {
        expect(ctrl).toBeDefined();
    });

    describe('ctrl.getOperations()', function() {

        it('should load the operations', function() {
            var ctrl = $componentController('operationSelector', { $scope: scope });
            ctrl.getOperations();

            scope.$digest();
            expect(operationService.reloadOperations).toHaveBeenCalledTimes(1);
        });

        it('should select the operation defined in the query operation parameter', function() {
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
            ctrl.getOperations();

            scope.$digest();
            expect(ctrl.model.name).toEqual('operationX');
        });

        it('should select the operation defined in the query operation parameter case insensitive and strip symbols', function() {
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
            ctrl.getOperations();

            scope.$digest();
            expect(ctrl.model.name).toEqual('operationX');
        });

        it('should select the operation defined in the query op parameter', function() {
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
            ctrl.getOperations();

            scope.$digest();
            expect(ctrl.model.name).toEqual('operationX');
        });

        it('should not select an operation', function() {
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
            ctrl.getOperations();

            scope.$digest();
            expect(ctrl.model).not.toBeDefined();
        });
    });

    describe('ctrl.reloadOperations()', function() {

        beforeEach(function() {
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

        describe('should order by', function() {
            it('named operation first', function() {
                availableOperations = [
                    {
                        name: 'abc',
                        description: 'abc'
                    },
                    {
                        name: 'xyz',
                        description: 'xyz',
                        namedOp: true
                    }
                ];

                ctrl.reloadOperations();
                scope.$digest();

                expect(ctrl.availableOperations[0].name).toEqual('xyz');
            });

            it('operation name second', function() {
                availableOperations = [
                    {
                        name: 'abc',
                        description: 'xyz'
                    },
                    {
                        name: 'xyz',
                        description: 'abc'
                    }
                ];

                ctrl.reloadOperations();
                scope.$digest();

                expect(ctrl.availableOperations[0].name).toEqual('abc');
            });

            it('operation description third', function() {
                availableOperations = [
                    {
                        name: 'abc',
                        description: 'xyz'
                    },
                    {
                        name: 'abc',
                        description: 'abc'
                    }
                ];

                ctrl.reloadOperations();
                scope.$digest();

                expect(ctrl.availableOperations[0].description).toEqual('abc');
            });

            it('the order it came in if all the above are the equal', function() {
                availableOperations = [
                    {
                        name: 'abc',
                        description: 'abc',
                        passed: true
                    },
                    {
                        name: 'abc',
                        description: 'abc'
                    }
                ];

                ctrl.reloadOperations();
                scope.$digest();

                expect(ctrl.availableOperations[0].passed).toBeTruthy();
            });
        });
    });
});
