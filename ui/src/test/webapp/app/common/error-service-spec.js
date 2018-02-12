describe('The error service', function() {

    var service;
    var $mdToast;

    beforeEach(module('app'));

    beforeEach(inject(function(_error_, _$mdToast_) {
        service = _error_;
        $mdToast = _$mdToast_;
    }));

    describe('handle()', function() {

        var toastArg;

        beforeEach(function() {
            spyOn($mdToast, 'show').and.callFake(function(toast) {
                toastArg = toast;
            });
        });

        beforeEach(function() {
            toastArg = undefined;
        });

        it('should show simple toast with a message', function() {
            service.handle('simple error message');
            expect(toastArg._options.textContent).toEqual('simple error message');
        });

        it('should call $mdToast.simple() with a preset message if the message is null', function() {
            service.handle(null);
            expect(toastArg._options.textContent).toEqual('Something went wrong. Check log for details');
        });

        it('should call $mdToast.simple() with a preset message if the message is undefined', function() {
            service.handle(undefined);
            expect(toastArg._options.textContent).toEqual('Something went wrong. Check log for details');
        });

        it('should use the simpleMessage if the argument is a gaffer error object', function() {
            service.handle({
                statusCode: 500,
                simpleMessage: 'You added a silly operation',
                status: 'Internal server error'
            });

            expect(toastArg._options.textContent).toEqual('You added a silly operation');

        })
    })
})