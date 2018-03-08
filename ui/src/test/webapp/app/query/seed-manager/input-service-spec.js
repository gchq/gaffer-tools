describe('The Input Service', function() {

    var service, events;

    beforeEach(module('app'));

    beforeEach(inject(function(_input_, _events_) {
        service = _input_;
        events = _events_;
    }));

    beforeEach(function() {
        spyOn(events, 'broadcast');
    });

    it('should exist', function() {
        expect(service).toBeDefined();
    });

    it('should hold an empty array to begin with', function() {
        expect(service.getInput()).toEqual([]);
    });

    describe('input.addInput()', function() {
        it('should add an object to the input array', function() {
            service.addInput('test');
            expect(service.getInput()).toEqual(['test']);
        });

        it('should broadcast an event with the new input value as an argument', function() {
            service.addInput(1);
            expect(events.broadcast.calls.mostRecent().args).toEqual(['queryInputUpdate', [[1]]]);
            service.addInput(2);
            expect(events.broadcast).toHaveBeenCalledTimes(2);
            expect(events.broadcast.calls.mostRecent().args).toEqual(['queryInputUpdate', [[1, 2]]]);
        });

    });

    describe('input.reset()', function() {
        it('should set the input back to an empty array', function() {
            service.addInput('test');
            service.addInput(42);
            service.reset();

            expect(service.getInput()).toEqual([]);
        });

        it('should broadcast an event with the new input as an argument', function() {
            service.addInput('hello');
            service.addInput('world');
            service.reset();
            expect(events.broadcast.calls.mostRecent().args).toEqual(['queryInputUpdate', [[]]]);
        });
    })

});