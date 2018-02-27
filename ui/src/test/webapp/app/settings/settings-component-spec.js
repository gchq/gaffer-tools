describe('The Settings Component', function() {
    beforeEach(module('app'));

    describe('The Controller', function() {

        var $componentController, $q;
        var settings;
        var schema;
        var operationService;
        var results;

        var scope;

        var ctrl;

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

        beforeEach(inject(function(_$componentController_, _settings_, _schema_, _operationService_, _results_, _$rootScope_, _$q_) {
            $componentController = _$componentController_;
            settings = _settings_;
            schema = _schema_;
            operationService = _operationService_;
            results = _results_;
            scope = _$rootScope_.$new();
            $q = _$q_;
        }));

        beforeEach(function() {
            ctrl = $componentController('settingsView', {$scope: scope});
        })


        it('should exist', function() {
            expect(ctrl).toBeDefined();
        });

        describe('ctrl.$onInit()', function() {
            it('should set the options to the values in the settings service', function() {
                spyOn(settings, 'getDefaultOpOptions').and.returnValue({'key1': "value1"});

                ctrl.$onInit();
                scope.$digest();

                expect(settings.getDefaultOpOptions).toHaveBeenCalledTimes(1);
                expect(ctrl.defaultOpOptions).toEqual({'key1': "value1"});
            });

            it('should get the operation option keys from the settings service', function() {
                spyOn(settings, 'getOpOptionKeys').and.returnValue($q.when('test'));

                ctrl.$onInit();
                scope.$digest();

                expect(ctrl.opOptionKeys).toEqual('test');
            });
        });


        it('should set the settings operation options when the options are updated', function() {
            var opOptions;
            spyOn(settings, 'setDefaultOpOptions').and.callFake(function(newOpOptions) {
                opOptions = newOpOptions;
            });

            ctrl.defaultOpOptionsArray = [
                {key: 'key1', value: 'value1'},
                {key: 'key2', value: 'value2'}
            ];
            ctrl.updateDefaultOpOptions();

            var expectedOptions = {
                'key1': 'value1',
                'key2': 'value2'
            };

            expect(settings.setDefaultOpOptions).toHaveBeenCalledTimes(1);
            expect(settings.setDefaultOpOptions).toHaveBeenCalledWith(expectedOptions);
            expect(opOptions).toEqual(expectedOptions);
        });

        it('should update the operation options when an option is deleted', function() {
            ctrl.defaultOpOptions = {
               'key1': 'value1',
               'key2': 'value2'
            };

            ctrl.defaultOpOptionsArray = [
                {key: 'key1', value: 'value1'},
                {key: 'key2', value: 'value2'}
            ];

            ctrl.deleteOption({key: 'key1', value: 'value1'});

            var expectedOptions = {
                'key2': 'value2'
            };
            expect(ctrl.defaultOpOptions).toEqual(expectedOptions);
        });

        it('should return the available operation option keys, including the current operation option key', function() {
            ctrl.defaultOpOptions = {
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
             ctrl.defaultOpOptionsArray = [
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
            ctrl.defaultOpOptionsArray = [
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
            ctrl.defaultOpOptionsArray = [
                {key: 'key1', value: 'value1'},
            ];

            ctrl.addDefaultOperationOption();

            var expectedOpOptionsArray = [
                {key: 'key1', value: 'value1'},
                {key: '', value: ''}
            ];
            expect(ctrl.defaultOpOptionsArray).toEqual(expectedOpOptionsArray);
        });
    });
});