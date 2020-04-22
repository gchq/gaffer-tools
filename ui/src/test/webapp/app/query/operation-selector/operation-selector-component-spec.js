describe('Operation Selector Component', function() {
    
    var ctrl;
    var $componentController, $q;
    var scope;
    var operationService;
    var $routeParams;

    beforeEach(module('app'));

    beforeEach(module(function($provide) {
        $provide.factory('config', function($q) {
            var get = function() {
                return $q.when({});
            };
            return {
                get: get
            };
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

    it('should exist', function() {
        expect(ctrl).toBeDefined();
    });

    describe('ctrl.getOperations()', function() {

        it('should select the operation defined in the query operation parameter', function() {
            $routeParams.operation = "operationX";
            var ctrl = $componentController('operationSelector', { $scope: scope });
            var availableOperations = [
                {name: "GetElements"},
                {name: "operationX"}
            ];
            spyOn(operationService, 'getAvailableOperations').and.returnValue($q.when(availableOperations));

            ctrl.getOperations();
            scope.$digest();

            expect(ctrl.model.name).toEqual('operationX');
        });

        it('should select the operation defined in the query operation parameter case insensitive and strip symbols', function() {
            $routeParams.operation = "operation-x.";
            var ctrl = $componentController('operationSelector', { $scope: scope });
            var availableOperations = [
                {name: "GetElements"},
                {name: "operationX"}
            ];
            spyOn(operationService, 'getAvailableOperations').and.returnValue($q.when(availableOperations));

            ctrl.getOperations();
            scope.$digest();

            expect(ctrl.model.name).toEqual('operationX');
        });

        it('should select the operation defined in the query op parameter', function() {
            $routeParams.op = "operationX";
            var ctrl = $componentController('operationSelector', { $scope: scope });
            var availableOperations = [
                {name: "GetElements"},
                {name: "operationX"}
            ];
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
                {name: "GetElements"},
                {name: "operationX"}
            ];
            spyOn(operationService, 'getAvailableOperations').and.returnValue($q.when(availableOperations));

            ctrl.getOperations();
            scope.$digest();

            expect(ctrl.model).not.toBeDefined();
        });

        it('should populate and sort operations as NamedOps first and in alphabetical name order', function() {
            var operationsInWrongOrder = [
                {namedOp: false, name: 'Get All Elements', description: 'Gets all elements'},
                {namedOp: true, name: 'Op Name 4', description: 'OP description 4'},
                {namedOp: true, name: 'Op Name 3', labels: null, description: 'OP description 3'},
                {namedOp: true, name: 'Op Name 2', labels: ['Group 1'], description: 'OP description 2'},
                {namedOp: true, name: 'Op Name 1', labels: ['Group 1'], description: 'OP description 1'}
            ];
            spyOn(operationService, 'getAvailableOperations').and.returnValue($q.when(operationsInWrongOrder));

            ctrl.getOperations();
            scope.$digest();

            var firstOp = {namedOp: true, name: 'Op Name 1', labels: ['Group 1'], description: 'OP description 1', formattedName: 'opname1', formattedDescription: 'opdescription1'};
            var secondOp = {namedOp: true, name: 'Op Name 2', labels: ['Group 1'], description: 'OP description 2', formattedName: 'opname2', formattedDescription: 'opdescription2'};
            var thirdOp = {namedOp: true, name: 'Op Name 3', labels: null, description: 'OP description 3', formattedName: 'opname3', formattedDescription: 'opdescription3'};
            var fourthOp = {namedOp: true, name: 'Op Name 4', description: 'OP description 4', formattedName: 'opname4', formattedDescription: 'opdescription4'};
            var fifthOp = {namedOp: false, name: 'Get All Elements', description: 'Gets all elements', formattedName: 'getallelements', formattedDescription: 'getsallelements'};
            expect(ctrl.availableOperations[0]).toEqual(firstOp);
            expect(ctrl.availableOperations[1]).toEqual(secondOp);
            expect(ctrl.availableOperations[2]).toEqual(thirdOp);
            expect(ctrl.availableOperations[3]).toEqual(fourthOp);
            expect(ctrl.availableOperations[4]).toEqual(fifthOp);
        });
    });

    describe('ctrl.reloadOperations()', function() {

        var availableOperations = [];

        beforeEach(function() {
            spyOn(operationService, 'reloadOperations').and.callFake(function() {
                return $q.when(availableOperations);
            });
        });

        it('should populate and sort operations as NamedOps first and in alphabetical name order', function() {
            availableOperations = [
                {namedOp: false, name: 'Get All Elements', description: 'Gets all elements'},
                {namedOp: true, name: 'Op Name 4', description: 'OP description 4'},
                {namedOp: true, name: 'Op Name 3', labels: null, description: 'OP description 3'},
                {namedOp: true, name: 'Op Name 2', labels: ['Group 1'], description: 'OP description 2'},
                {namedOp: true, name: 'Op Name 1', labels: ['Group 1'], description: 'OP description 1'}
            ];

            ctrl.reloadOperations();
            scope.$digest();

            var firstOp = {namedOp: true, name: 'Op Name 1', labels: ['Group 1'], description: 'OP description 1', formattedName: 'opname1', formattedDescription: 'opdescription1'};
            var secondOp = {namedOp: true, name: 'Op Name 2', labels: ['Group 1'], description: 'OP description 2', formattedName: 'opname2', formattedDescription: 'opdescription2'};
            var thirdOp = {namedOp: true, name: 'Op Name 3', labels: null, description: 'OP description 3', formattedName: 'opname3', formattedDescription: 'opdescription3'};
            var fourthOp = {namedOp: true, name: 'Op Name 4', description: 'OP description 4', formattedName: 'opname4', formattedDescription: 'opdescription4'};
            var fifthOp = {namedOp: false, name: 'Get All Elements', description: 'Gets all elements', formattedName: 'getallelements', formattedDescription: 'getsallelements'};
            expect(ctrl.availableOperations[0]).toEqual(firstOp);
            expect(ctrl.availableOperations[1]).toEqual(secondOp);
            expect(ctrl.availableOperations[2]).toEqual(thirdOp);
            expect(ctrl.availableOperations[3]).toEqual(fourthOp);
            expect(ctrl.availableOperations[4]).toEqual(fifthOp);
        });
    });

    describe('ctrl.populateOperations()', function() {

        it('should sort by name alphabetically', function() {
            var operations = [
                {name: 'B Operation', description: 'abc'},
                {name: 'A Operation', description: 'xyz'}
            ];

            ctrl.populateOperations(operations);
            scope.$digest();

            expect(ctrl.availableOperations[0].name).toBe('A Operation');
            expect(ctrl.availableOperations[1].name).toBe('B Operation');
        });

        it('should not sort by name when already alphabetical', function() {
            var operations = [
                {name: 'A Operation', description: 'xyz'},
                {name: 'B Operation', description: 'abc'}
            ];

            ctrl.populateOperations(operations);
            scope.$digest();

            expect(ctrl.availableOperations[0].name).toBe('A Operation');
            expect(ctrl.availableOperations[1].name).toBe('B Operation');
        });

        it('should sort by description alpha when names are the same', function() {
            var operations = [
                {name: 'A Operation', description: 'xyz'},
                {name: 'A Operation', description: 'abc'}
            ];

            ctrl.populateOperations(operations);
            scope.$digest();

            expect(ctrl.availableOperations[0].description).toBe('abc');
            expect(ctrl.availableOperations[1].description).toBe('xyz');
        });

        it('should sort Named Operations first before by alpha name', function() {
            var operations = [
                {name: 'A Operation', description: 'abc'},
                {name: 'B Operation', description: 'abc', namedOp: true}
            ];

            ctrl.populateOperations(operations);
            scope.$digest();

            expect(ctrl.availableOperations[0].name).toBe('B Operation');
            expect(ctrl.availableOperations[1].name).toBe('A Operation');
        });

        it('should sort Named Operations labels by alpha', function() {
            var operations = [
                {name: 'A Operation', description: 'abc', labels: ['C', 'D', 'B', 'A']}
            ];

            ctrl.populateOperations(operations);
            scope.$digest();

            expect(ctrl.availableOperations[0].labels).toEqual(['A', 'B', 'C', 'D']);
        });

        it('should sort by group labels first before name and undefined labels as last', function() {
            var operations = [
                {name: 'A Operation', description: 'abc'},
                {name: 'B Operation', description: 'abc', labels: ['BBB']},
                {name: 'C Operation', description: 'abc', labels: ['AAA']},
            ];

            ctrl.populateOperations(operations);
            scope.$digest();

            expect(ctrl.availableOperations[0].name).toBe('C Operation');
            expect(ctrl.availableOperations[1].name).toBe('B Operation');
            expect(ctrl.availableOperations[2].name).toBe('A Operation');
        });

        it('should sort by group labels first before name and empty labels as last', function() {
            var operations = [
                {name: 'A Operation', description: 'abc', labels: []},
                {name: 'B Operation', description: 'abc', labels: ['BBB']},
                {name: 'C Operation', description: 'abc', labels: ['AAA']}
            ];

            ctrl.populateOperations(operations);
            scope.$digest();

            expect(ctrl.availableOperations[0].name).toBe('C Operation');
            expect(ctrl.availableOperations[1].name).toBe('B Operation');
            expect(ctrl.availableOperations[2].name).toBe('A Operation');
        });

        it('should sort by next group label in the array when first labels are the same', function() {
            var operations = [
                {name: 'A Operation', description: 'abc', labels: ['AAA', 'CCC']},
                {name: 'B Operation', description: 'abc', labels: ['AAA', 'BBB']}
            ];

            ctrl.populateOperations(operations);
            scope.$digest();

            expect(ctrl.availableOperations[0].name).toBe('B Operation');
            expect(ctrl.availableOperations[1].name).toBe('A Operation');
        });

        it('should sort by next group label in the array when first labels are the same', function() {
            var operations = [
                {name: 'A Operation', description: 'abc', labels: ['BBB', 'CCC']},
                {name: 'B Operation', description: 'abc', labels: ['CCC', 'BBB', 'AAA']}
            ];

            ctrl.populateOperations(operations);
            scope.$digest();

            expect(ctrl.availableOperations[0].name).toBe('B Operation');
            expect(ctrl.availableOperations[1].name).toBe('A Operation');
        });
    });
});
