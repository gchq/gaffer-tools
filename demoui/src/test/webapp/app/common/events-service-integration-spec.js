describe('The events service', function() {
    var service;

    beforeEach(module('app'));

    beforeEach(inject(function(_events_) {
        service = _events_;
    }));

    describe('events.subscribe()', function() {

        it('should not add a callback twice', function() {
            var timesCalled = 0

            var callback = function() {
                timesCalled++;
            };

            service.subscribe('test', callback);
            service.subscribe('test', callback);

            service.broadcast('test');

            expect(timesCalled).toEqual(1);
        });

        it('should not add a callback if it is null', function() {
            service.subscribe('test', null);
            expect(function() { service.broadcast('test'); }).not.toThrow();
        });

        it('should not add a callback if it is undefined', function() {
            service.subscribe('test', undefined);
            expect(function() { service.broadcast('test'); }).not.toThrow();
        });

        it('should not add a callback if it is not a function', function() {
            service.subscribe('test', 1);
            expect(function() { service.broadcast('test'); }).not.toThrow();
        });
    });

    describe('events.unsubscribe()', function() {
        var calls = 0;

        var callback = function() {
            calls++;
        }

        beforeEach(function() {
            calls = 0;
        });

        beforeEach(function() {
            service.subscribe('test', callback);
        });

        it('should stop responding to events after unsubscribe is called', function() {
            service.broadcast('test');
            service.unsubscribe('test', callback);
            service.broadcast('test');

            expect(calls).toEqual(1);

        });

        it('should fail silently when unsubscribe is called on an event which has not yet been subscribed to', function() {
            expect(function() {
                service.unsubscribe('not yet subscribed', function() {})
            }).not.toThrow(jasmine.anything());
        })
    });

    describe('events.broadcast()', function() {
        var calls;

        var callback = function(incrementBy) {
            if (incrementBy) {
                calls += incrementBy;
            }
        }

        beforeEach(function() {
            calls = 0;
        });

        beforeEach(function() {
            service.subscribe('test', callback);
        });

        it('should be able to send arguments to the callbacks', function() {
            service.broadcast('test', [21]);
            service.broadcast('test', [21]);
            expect(calls).toEqual(42);
        });
    });
});
