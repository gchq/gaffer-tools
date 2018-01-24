describe('The Options Form Component', function() {
    beforeEach(module('app'));

    describe('The Controller', function() {

        var $componentController;
        var queryPage;
        var settings;

        beforeEach(inject(function(_$componentController_, _queryPage_, _settings_) {
            $componentController = _$componentController_;
            queryPage = _queryPage_;
            settings = _settings_;
        }));

        it('should exist', function() {
            var ctrl = $componentController('optionsForm');
            expect(ctrl).toBeDefined();
        });

        it('should get operation options from settings when initialised', function() {
            var opOptions;
            var defaultOpOptions = {'key1': "value1", 'key2': "value2"};
            var expectedOpOptionsArray = [
                {key: 'key1', value: 'value1'},
                {key: 'key2', value: 'value2'}
            ];

            spyOn(settings, 'getDefaultOpOptions').and.returnValue(defaultOpOptions);
            spyOn(queryPage, 'getOpOptions').and.returnValue({});
            spyOn(queryPage, 'setOpOptions').and.callFake(function(newOpOptions) {
                opOptions = newOpOptions;
            });

            var ctrl = $componentController('optionsForm');

            ctrl.$onInit();

            expect(settings.getDefaultOpOptions).toHaveBeenCalledTimes(1);
            expect(queryPage.setOpOptions).toHaveBeenCalledTimes(1);
            expect(opOptions).toEqual(defaultOpOptions);
        });

        it('should not override already populated operation options when initialised', function() {
            spyOn(settings, 'getDefaultOpOptions').and.returnValue({'key1': "value1", 'key2': "value2"});
            spyOn(queryPage, 'setOpOptions');
            spyOn(queryPage, 'getOpOptions').and.returnValue({'key1': "value1"});
            var ctrl = $componentController('optionsForm');

            ctrl.$onInit();

            var expectedOpOptionsArray = [
                {key: 'key1', value: 'value1'}
            ];
            expect(queryPage.setOpOptions).not.toHaveBeenCalled();
            expect(ctrl.opOptionsArray).toEqual(expectedOpOptionsArray);
        });

        it('should set the queryPage operation options when the options are updated', function() {
            var ctrl = $componentController('optionsForm');
            var opOptions;
            spyOn(queryPage, 'setOpOptions').and.callFake(function(newOpOptions) {
                opOptions = newOpOptions;
            });

            ctrl.opOptionsArray = [
                {key: 'key1', value: 'value1'},
                {key: 'key2', value: 'value2'}
            ];
            ctrl.updateOpOptions();

            var expectedOptions = {
                'key1': 'value1',
                'key2': 'value2'
            };

            expect(queryPage.setOpOptions).toHaveBeenCalledTimes(1);
            expect(queryPage.setOpOptions).toHaveBeenCalledWith(expectedOptions);
            expect(opOptions).toEqual(expectedOptions);
        });

        it('should update the operation options when an option is deleted', function() {
            var ctrl = $componentController('optionsForm');
            ctrl.opOptions = {
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
            expect(ctrl.opOptions).toEqual(expectedOptions);
        });

        it('should return the available operation option keys, including the current operation option key', function() {
            var ctrl = $componentController('optionsForm');
            ctrl.opOptions = {
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
    });
});