describe('The Directionality Picker Component', function() {
    beforeEach(module('app'));

    describe('The Controller', function() {

        var $componentController;
        var queryPage;

        beforeEach(inject(function(_$componentController_, _queryPage_) {
            $componentController = _$componentController_;
            queryPage = _queryPage_;
        }));

        it('should exist', function() {
            var ctrl = $componentController('directionalityPicker');
            expect(ctrl).toBeDefined();
        });

        it('should set the flag to the value in the queryPage service', function() {
            spyOn(queryPage, 'getInOutFlag').and.returnValue('test');

            var ctrl = $componentController('directionalityPicker');

            expect(queryPage.getInOutFlag).toHaveBeenCalledTimes(1);
            expect(ctrl.inOutFlag).toEqual('test');
        });

        it('should set the queryPage.inOutFlag when the direction is updated', function() {
            var ctrl = $componentController('directionalityPicker');
            var flag;
            spyOn(queryPage, 'setInOutFlag').and.callFake(function(newFlag) {
                flag = newFlag;
            });

            ctrl.inOutFlag = 'flag value';
            ctrl.onInOutFlagChange();

            expect(queryPage.setInOutFlag).toHaveBeenCalledTimes(1);
            expect(queryPage.setInOutFlag).toHaveBeenCalledWith('flag value')
            expect(flag).toEqual('flag value');

        });
    });
});
