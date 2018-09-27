describe('The Options Form Component', function() {
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

        var $componentController;
        var settings;

        beforeEach(inject(function(_$componentController_, _settings_) {
            $componentController = _$componentController_;
            settings = _settings_;
        }));

        it('should exist', function() {
            var ctrl = $componentController('optionsForm');
            expect(ctrl).toBeDefined();
        });

        it('should update the model when the options are updated', function() {
            var injectedModel = {};
            var ctrl = $componentController('optionsForm', null, {model: injectedModel});

            ctrl.opOptionsArray = [
                {key: 'key1', value: 'value1'},
                {key: 'key2', value: 'value2'}
            ];

            ctrl.updateOpOptions();

            var expectedOptions = {
                'key1': 'value1',
                'key2': 'value2'
            };

            expect(ctrl.model).toEqual(expectedOptions);
        });

        it('should update the operation options when an option is deleted', function() {
            var ctrl = $componentController('optionsForm');
            ctrl.model = {
               'key1': 'value1',
               'key2': 'value2'
            };

            ctrl.opOptionsArray = [
                {key: 'key1', value: 'value1'},
                {key: 'key2', value: 'value2'}
            ];

            ctrl.deleteOption({key: 'key1', value: 'value1'});

            var expectedOptions = {
                'key2': 'value2'
            };
            expect(ctrl.model).toEqual(expectedOptions);
        });

        it('should return the available operation option keys, including the current operation option key', function() {
            var ctrl = $componentController('optionsForm');
            ctrl.model = {
               'key1': 'value1',
               'key2': 'value2'
            };
            ctrl.opOptionKeys = {
               'name1': 'key1',
               'name2': 'key2',
               'name3': 'key3'
            };

            var keys = ctrl.getOpOptionKeys({key: 'key1', value: 'value1'});

            var expectedKeys = {
                'name1': 'key1',
                'name3': 'key3'
            };
            expect(keys).toEqual(expectedKeys);
        });

        it('should return false when no more available option keys', function() {
            var ctrl = $componentController('optionsForm');
             ctrl.opOptionsArray = [
                {key: 'key1', value: 'value1'},
                {key: 'key2', value: 'value2'}
            ];
            ctrl.opOptionKeys = {
               'name1': 'key1',
               'name2': 'key2'
            };

            var hasMore = ctrl.hasMoreOpOptions();

            expect(hasMore).toBeFalsy();
        });

        it('should return true when more available option keys', function() {
            var ctrl = $componentController('optionsForm');
            ctrl.opOptionsArray = [
                {key: 'key1', value: 'value1'},
            ];
            ctrl.opOptionKeys = {
               'name1': 'key1',
               'name2': 'key2'
            };

            var hasMore = ctrl.hasMoreOpOptions();

            expect(hasMore).toBeTruthy();
        });

        it('should add new operation option', function() {
            var ctrl = $componentController('optionsForm');
            ctrl.opOptionsArray = [
                {key: 'key1', value: 'value1'},
            ];

            ctrl.addOperationOption();

            var expectedOpOptionsArray = [
                {key: 'key1', value: 'value1'},
                {key: '', value: ''}
            ];
            expect(ctrl.opOptionsArray).toEqual(expectedOpOptionsArray);
        });

        describe('.$onInit()', function() {
            var ctrl;
            var defaultOptions;
            var scope;

            beforeEach(inject(function(_$rootScope_) {
                var $rootScope = _$rootScope_;
                scope = $rootScope.$new();
            }))

            beforeEach(function() {
                ctrl = $componentController('optionsForm', {$scope: scope});
            });

            beforeEach(function() {
                spyOn(settings, 'getDefaultOpOptions').and.callFake(function() {
                    return defaultOptions;
                });
            });

            it('should not update a null model if the default operation options is an empty object', function() {
                ctrl.model = null;
                defaultOptions = {};

                ctrl.$onInit();
                scope.$digest();

                expect(ctrl.model).toBeNull();
            });

            it('should not update a non-null model', function() {
                ctrl.model = {'key': 'value'};
                defaultOptions = {'foo': 'bar'};

                ctrl.$onInit();
                scope.$digest();

                expect(ctrl.model).toEqual({'key': 'value'});
            });

            it('should update a null model if the default operation options have been populated', function() {
                ctrl.model = null;
                defaultOptions = {'foo': 'bar'};

                ctrl.$onInit();
                scope.$digest();

                expect(ctrl.model).toEqual({'foo': 'bar'});
            });
        });
    });
});
