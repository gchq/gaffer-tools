describe('The error service', function() {

    var service;
    var $mdToast, $mdDialog, $q, $rootScope;

    beforeEach(module('app'));

    beforeEach(inject(function(_error_, _$mdToast_, _$mdDialog_, _$q_, _$rootScope_) {
        service = _error_;
        $mdToast = _$mdToast_;
        $q = _$q_;
        $mdDialog = _$mdDialog_;
        $rootScope = _$rootScope_;
    }));

    describe('handle()', function() {

        var toastArg;
        var response;

        beforeEach(function() {
            spyOn($mdToast, 'show').and.callFake(function(toast) {
                toastArg = toast;
                return $q.when(response);
            });
        });

        var fakeToast = {
            hideDelay: function(delay) { return this; },
            textContent: function(content) { return this; },
            position: function(pos) { return this; }
        }

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

        it('should log the error to the console if it supplied', function() {
            spyOn(console, 'log').and.stub();
            service.handle('message', 'this is the detailed message, stack trace or Gaffer error');
            expect(console.log).toHaveBeenCalledWith('this is the detailed message, stack trace or Gaffer error');
        });

        it('should use the length of the message to determine how long the toast stays up', function() {

            spyOn($mdToast, 'simple').and.callFake(function() {
                return fakeToast;
            });

            spyOn(fakeToast, 'hideDelay');

            service.handle('This is a really long message that a user will struggle to read in a short amount of time');
            service.handle('short message');


            expect(fakeToast.hideDelay.calls.first().args[0]).toBeGreaterThan(fakeToast.hideDelay.calls.argsFor(1)[0])
        });

        it('should add a button for examining an error in greater depth', function() {
            service.handle('error message', 'something terrible has happened');
            expect(toastArg._options.action).toEqual('More info');
        });

        it('should not add a button if the error is null', function() {
            service.handle('error message', null);
            expect(toastArg._options.action).toBeUndefined();
        });

        it('should not add a button if the error is undefined', function() {
            service.handle('error message', undefined);
            expect(toastArg._options.action).toBeUndefined();
        });

        it('should not add a button if the error is an empty string', function() {
            service.handle('basic error message', '');
            expect(toastArg._options.action).toBeUndefined();
        });

        it('should queue concurrent toasts and show them in order', function() {
            service.handle('hello');
            service.handle('world');

            expect(toastArg._options.textContent).toEqual('hello'); // world not called yet.

            $rootScope.$digest(); // manually resolve the toast

            expect(toastArg._options.textContent).toEqual('world');

        });

        describe('When the user clicks the more info button', function() {

            var dialogArg;

            beforeEach(function() {
                spyOn($mdDialog, 'show').and.callFake(function(dialog) {
                    dialogArg = dialog;
                    return $q.defer().promise;
                });
            });

            beforeEach(function() {
                response = "ok"     // to simulate $mdToast click action
            });

            it('should open a dialog', function() {
                service.handle('basic message', 'A more detailed error message');
                $rootScope.$digest();
                expect($mdDialog.show).toHaveBeenCalled();
            });

            it('should set the title to the status if the error is a Gaffer error', function() {
                service.handle('something failed', {status: 'Internal server error', simpleMessage: 'You broke it'});
                $rootScope.$digest();
                expect(dialogArg._options.title).toEqual('Internal server error');
            });

            it('should set the text content to the simple message if the error is a Gaffer error', function() {
                service.handle('something failed', { status: 'Internal server error', simpleMessage: 'You broke it'});
                $rootScope.$digest();
                expect(dialogArg._options.textContent).toEqual('You broke it');
            });

            it('should set the title to "Error" if the error is just a string', function() {
                service.handle('something went really wrong', 'something specific went really wrong');
                $rootScope.$digest();
                expect(dialogArg._options.title).toEqual('Error');
            });

            it('should set the title to the error message if it is just a string', function() {
                service.handle('something went really wrong', 'something specific went really wrong');
                $rootScope.$digest();
                expect(dialogArg._options.textContent).toEqual('something specific went really wrong');
            });

            it('should display the message if the error is a javascript error', function() {
                service.handle('something went wrong', new Error('aaaaahhhhhhhh'));
                $rootScope.$digest();
                expect(dialogArg._options.textContent).toEqual("aaaaahhhhhhhh");
            });

            it('should display a preset if the error is something unexpected', function() {
                service.handle('something has gone crazy', { unknownField: 'Unexpected value'});
                $rootScope.$digest();
                expect(dialogArg._options.textContent).toEqual('An unknown error occurred. See the console log for details')
            });
        });

    });
})
