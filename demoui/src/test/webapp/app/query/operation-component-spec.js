describe('The operation component', function() {
    var ctrl;
    var $componentController, $q;
    var scope;

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

    beforeEach(inject(function(_$componentController_, _$rootScope_, _$q_) {
        $componentController = _$componentController_;
        scope = _$rootScope_.$new();
        $q = _$q_;
    }));

    beforeEach(function() {
        ctrl = $componentController('operation', {$scope: scope});
    });

    describe('ctrl.$onInit()', function() {

        it('should throw an error if the model is undefined', function() {
            var ctrl = $componentController('operation');
            expect(ctrl.$onInit).toThrow('An operation has been created without a model to bind to');
        });
    });

    describe('ctrl.canExecute()', function() {
        var loading;
        var isLoading;

        beforeEach(inject(function(_loading_) {
            loading = _loading_;
        }));

        beforeEach(function() {
            ctrl.operationForm = {
                $valid: true
            };

            ctrl.model = {
                fields: {
                    input: [],
                }
            };

            isLoading = false;
        });

        beforeEach(function() {
            spyOn(loading, 'isLoading').and.callFake(function() {
                return isLoading;
            });
        })


        it('should return false if the operation form is valid', function() {
            ctrl.operationForm.$valid = false;
            expect(ctrl.canExecute()).toBeFalsy();
        });

        it('should return false if the input is null', function() {
            ctrl.model.fields.input = null;
            expect(ctrl.canExecute()).toBeFalsy();
        });

        it('should return false if there is an operation in progress', function() {
            isLoading = true;
            expect(ctrl.canExecute()).toBeFalsy();
        });

        it('should return true if the form is valid, there is no in-progress operation and there is an input', function() {
            expect(ctrl.canExecute()).toBeTruthy();
        });
    });

    describe('ctrl.isFirst()', function() {
        it('should return true if the index is 0', function() {
            ctrl.index = 0;
            expect(ctrl.isFirst()).toBeTruthy();
        })

        it('should return false if the index is > 0', function() {
            ctrl.index = 1;
            expect(ctrl.isFirst()).toBeFalsy();
        });
    });

    describe('ctrl.isStandalone()', function() {
        it('should return true if the length of the chain is 1', function() {
            ctrl.chainLength = 1;
            expect(ctrl.isStandalone()).toBeTruthy();
        });

        it('should return false if the length of the chain is greater than 1', function() {
            ctrl.chainLength = 2;
            expect(ctrl.isStandalone()).toBeFalsy();
        });
    });

    describe('ctrl.isLast()', function() {
        it('should return true if the operation is the last in an array', function() {
            // operation    [ a, b, c ]
            // index        [ 0, 1, 2 ]
            //                      ^
            ctrl.index = 2;
            ctrl.chainLength = 3
            expect(ctrl.isLast()).toBeTruthy();
        })

        it('should return false if the operation is not the last in an array', function() {
            // operation    [ a, b, c ]
            // index        [ 0, 1, 2 ]
            //                   ^
            ctrl.index = 1;
            ctrl.chainLength = 3;
            expect(ctrl.isLast()).toBeFalsy();
        });
    });

    describe('ctrl.toggleExpanded()', function() {
        beforeEach(function() {
            ctrl.model = {
                expanded: true
            }
        });

        it('should switch the expanded flag when run once', function() {
            ctrl.toggleExpanded();
            expect(ctrl.model.expanded).toBeFalsy();
        });

        it('should reset the expanded flag if run twice', function() {
            ctrl.toggleExpanded();
            ctrl.toggleExpanded();
            expect(ctrl.model.expanded).toBeTruthy();
        });
    });

    describe('ctrl.execute()', function() {
        var fakeFunction;
        var ctrl;

        beforeEach(function() {
            fakeFunction = jasmine.createSpy('fakeFunction');
        });

        beforeEach(function() {
            ctrl = $componentController('operation', null, { model: 'test', onExecute: fakeFunction });
        });

        beforeEach(function() {
            ctrl.execute();
        });

        it('should run an injected onExecute function', function() {
            expect(fakeFunction).toHaveBeenCalled();
        });

        it('should pass the model into onExecute function', function() {
            expect(fakeFunction).toHaveBeenCalledWith({op: 'test'});
        });
    });

    describe('ctrl.reset()', function() {
        var fakeFunction;
        var ctrl;

        beforeEach(function() {
            fakeFunction = jasmine.createSpy('fakeFunction');
        });

        beforeEach(function() {
            ctrl = $componentController('operation', null, { index: 2, onReset: fakeFunction });
        });

        beforeEach(function() {
            ctrl.reset();
        });

        it('should run an injected onReset function', function() {
            expect(fakeFunction).toHaveBeenCalled();
        });

        it('should pass the index into onReset function', function() {
            expect(fakeFunction).toHaveBeenCalledWith({index: 2});
        });
    });

    describe('ctrl.delete()', function() {
        var fakeFunction;
        var ctrl;

        beforeEach(function() {
            fakeFunction = jasmine.createSpy('fakeFunction');
        });

        beforeEach(function() {
            ctrl = $componentController('operation', null, { index: 2, onDelete: fakeFunction });
        });

        beforeEach(function() {
            ctrl.delete();
        });

        it('should run an injected onReset function', function() {
            expect(fakeFunction).toHaveBeenCalled();
        });

        it('should pass the index into onReset function', function() {
            expect(fakeFunction).toHaveBeenCalledWith({index: 2});
        });
    })
});
