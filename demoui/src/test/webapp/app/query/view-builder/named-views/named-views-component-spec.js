describe('The named views component', function() {

    var ctrl, scope;
    var $componentController;
    var view;

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
                    return $q.when(schema);
                },
                getEdgeProperties: function() {
                    return edgeProperties;
                },
                getEntityProperties: function() {
                    return entityProperties;
                }
            }
        });
    }));

    beforeEach(inject(function(_$componentController_, _$rootScope_, _view_) {
        $componentController = _$componentController_;
        scope = _$rootScope_.$new();
        view = _view_;
    }));

    var createController = function(initialModel) {
        ctrl = $componentController('namedViews', {$scope: scope}, {model: initialModel});
    }

    describe('ctrl.$onInit()', function() {
        var $q;
        var shouldCallOffToNamedViewService;

        beforeEach(inject(function(_$q_) {
            $q = _$q_;
        }));

        beforeEach(function() {
            createController([]);
        });

        beforeEach(function() {
            spyOn(view, 'shouldLoadNamedViewsOnStartup').and.callFake(function() {
                return $q.when(shouldCallOffToNamedViewService);
            });

            spyOn(view, 'reloadNamedViews').and.returnValue($q.when('test'));
        });

        it('should load the named views if the service returns true', function() {
            shouldCallOffToNamedViewService = true;
            ctrl.$onInit();
            scope.$digest();
            expect(view.reloadNamedViews).toHaveBeenCalledTimes(1);
        });

        it('should update the controllers named views model if the service returns true', function() {
            shouldCallOffToNamedViewService = true;
            ctrl.$onInit();
            scope.$digest();
            expect(ctrl.availableNamedViews).toEqual('test');
        });
    });

    describe('ctrl.isDisabled()', function() {
        it('should return true if the available named views are undefined', function() {
            ctrl.availableNamedViews = undefined;
            expect(ctrl.isDisabled()).toBeTruthy();
        });

        it('should return true if the available named views are null', function() {
            ctrl.availableNamedViews = null;
            expect(ctrl.isDisabled()).toBeTruthy();
        });

        it('should return false if there is more than one available named view', function() {
            ctrl.availableNamedViews = [ 'test' ];
            expect(ctrl.isDisabled()).toBeFalsy();
        });

        it('should return true if the available named views are an empty array', function() {
            ctrl.availableNamedViews = [];
            expect(ctrl.isDisabled()).toBeTruthy();
        });
    });

    describe('ctrl.getPlaceholder()', function() {
        var isDisabled;

        beforeEach(function() {
            spyOn(ctrl, 'isDisabled').and.callFake(function() {
                return isDisabled;
            });
        });

        it('should return a string stating there are no predefined filters available when the named views are disabled', function() {
            isDisabled = true;

            expect(ctrl.getPlaceholder()).toEqual('No predefined filters available');
        });

        it('should return a string telling the user to search for the filter they want', function() {
            isDisabled = false;
            expect(ctrl.getPlaceholder()).toEqual('Search predefined filters');
        });
    });

    describe('ctrl.search()', function() {

        beforeEach(function() {
            createController([])
        });

        beforeEach(function() {
            ctrl.availableNamedViews = [ {name: 'view1', description: 'A description'}, {name: 'view2'}, {name: 'myNamedView', description: 'A cool Filter'}, {name: '$SuperFilter'} ];
        });

        it('should return all the available named views if the input is undefined', function() {
            expect(ctrl.search(undefined)).toEqual(ctrl.availableNamedViews);
        });

        it('should return all the named views if the input is null', function() {
            expect(ctrl.search(null)).toEqual(ctrl.availableNamedViews);
        });

        it('should return all the named views if the input is an empty string', function() {
            expect(ctrl.search('')).toEqual(ctrl.availableNamedViews);
        });

        it('should return all named views whose names contain the input string', function() {
            expect(ctrl.search('view')).toEqual([ {name: 'view1', description: 'A description'}, {name: 'view2'}, {name: 'myNamedView', description: 'A cool Filter'}]);
        });

        it('should return all named views whose descriptions contain the input string', function() {
            expect(ctrl.search('filter')).toEqual([ {name: 'myNamedView', description: 'A cool Filter'}, {name: '$SuperFilter'}])
        });
    });

    describe('ctrl.refreshNamedViews()', function() {

        var namedViews = [];
        var $q;

        beforeEach(function() {
            namedViews = [];
        });

        beforeEach(inject(function(_$q_) {
            $q = _$q_;
        }));

        beforeEach(function() {
            createController([]);
        });

        beforeEach(function() {
            spyOn(view, 'reloadNamedViews').and.callFake(function(arg) {
                return $q.when(namedViews)
            });
        });

        it('should call out to service function', function() {
            ctrl.refreshNamedViews();
            expect(view.reloadNamedViews).toHaveBeenCalledTimes(1);

            // expect loud argument to be true
            expect(view.reloadNamedViews).toHaveBeenCalledWith(true);
        });

        it('should update the named views when called', function() {
            namedViews = 'test passed';
            ctrl.refreshNamedViews();
            scope.$digest();
            expect(ctrl.availableNamedViews).toEqual('test passed');
        });
    });

    describe('ctrl.deleteFilter()', function() {

        beforeEach(function() {
            createController([]);
        });

        beforeEach(function() {
            ctrl.model = ["view1", "view2", "view", "anotherView", "view"];
        });

        it('should remove a named view based on the index', function() {
            ctrl.deleteFilter(1);
            expect(ctrl.model).toEqual(["view1", "view", "anotherView", "view"])
        });

        it('should only remove the view with the given index, rather than all views that match it', function() {
            ctrl.deleteFilter(2)
            expect(ctrl.model).toEqual(["view1", "view2", "anotherView", "view"])
        });

    });

    describe('ctrl.updateModel()', function() {
        beforeEach(function() {
            createController([1, 2, 3]);
        });

        it('should do nothing if selected named view is null', function() {
            ctrl.selectedNamedView = null;
            ctrl.updateModel();
            expect(ctrl.model).toEqual([1, 2, 3]);
        });

        it('should do nothing if selected named view is undefined', function() {
            ctrl.selectedNamedView = undefined;
            ctrl.updateModel();
            expect(ctrl.model).toEqual([1, 2, 3]);
        });

        it('should add the selected Named View to the controllers array', function() {
            ctrl.selectedNamedView = "test";
            ctrl.updateModel();

            var expected = [ 1, 2, 3, "test"]
            expect(ctrl.model).toEqual(expected);
        });

        it('should reset the search term', function() {
            ctrl.namedViewSearchTerm = 'te';
            ctrl.selectedNamedView = "test";
            ctrl.updateModel();

            expect(ctrl.namedViewSearchTerm).toEqual('');
        });

        it('should be able to add the same filter more than once', function() {
            ctrl.selectedNamedView = "test";
            ctrl.updateModel();

            ctrl.selectedNamedView = "test";
            ctrl.updateModel();

            var expected = [ 1, 2, 3, "test", "test"]
            expect(ctrl.model).toEqual(expected);
        });
    });

    describe('ctrl.namedViewHasParams()', function() {

        beforeEach(function() {
            createController([]);
        });

        it('should return false if named view is null', function() {
            expect(ctrl.namedViewHasParams(null)).toBeFalsy();
        });

        it('should return false if named view is undefined', function() {
            expect(ctrl.namedViewHasParams(undefined)).toBeFalsy();
        });

        it('should return false if the named view\'s parameters are undefined', function() {
            expect(ctrl.namedViewHasParams("test")).toBeFalsy();
        });

        it('should return false if the named view\'s parameters have a key length of 0', function() {
            expect(ctrl.namedViewHasParams({ parameters: {}})).toBeFalsy();
        });

        it('should return true if the named view\'s parameters have a key length of > 0', function() {
            expect(ctrl.namedViewHasParams({parameters: { "hello": "world"}})).toBeTruthy();
        });
    });

    describe('ctrl.namedViewHasNoParams()', function() {

        beforeEach(function() {
            createController();
        });

        it('should return false if named view is null', function() {
            expect(ctrl.namedViewHasNoParams(null)).toBeFalsy();
        });

        it('should return false if named view is undefined', function() {
            expect(ctrl.namedViewHasNoParams(undefined)).toBeFalsy();
        });

        it('should return true if the named view\'s parameters are undefined', function() {
            expect(ctrl.namedViewHasNoParams("test")).toBeTruthy();
        });

        it('should return true if the named view\'s parameters have a key length of 0', function() {
            expect(ctrl.namedViewHasNoParams({ parameters: {}})).toBeTruthy();
        });

        it('should return false if the named view\'s parameters have a key length of > 0', function() {
            expect(ctrl.namedViewHasNoParams({parameters: { "hello": "world"}})).toBeFalsy();
        });
    });
});
