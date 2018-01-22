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

        it('should set the options to the values in the queryPage service', function() {
            spyOn(queryPage, 'getOpOptions').and.returnValue({'key1': "value1"});

            var ctrl = $componentController('optionsForm');

            expect(queryPage.getOpOptions).toHaveBeenCalledTimes(1);
            expect(ctrl.opOptions).toEqual({'key1': "value1"});
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