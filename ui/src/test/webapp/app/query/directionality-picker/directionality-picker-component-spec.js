describe('The directionality picker', function() {
    beforeEach(module('app'));

    describe('The controller', function() {

        var $componentController;
        var queryPage;

        beforeEach(inject(function(_$componentController_, _queryPage_) {
            $componentController = _$componentController_;
            queryPage = _queryPage_;
        }));

        it('should set the flag to the value in the queryPage service', function() {
            spyOn(queryPage, 'getInOutFlag').and.returnValue('test');

            var ctrl = $componentController('directionalityPicker');

            expect(queryPage.getInOutFlag).toHaveBeenCalledTimes(1);
            expect(ctrl.inOutFlag).toEqual('test');
        })

        it('should set the queryPage.inOutFlag when the direction is updated', function() {
            var ctrl = $componentController('directionalityPicker');
            spyOn(queryPage, 'setInOutFlag').and.callThrough();

            ctrl.inOutFlag = 'flag value';
            ctrl.onInOutFlagChange();

            expect(queryPage.setInOutFlag).toHaveBeenCalledTimes(1);
            expect(queryPage.setInOutFlag).toHaveBeenCalledWith('flag value')
            expect(queryPage.getInOutFlag()).toEqual('flag value');

        });
    });
});