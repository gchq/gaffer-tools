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

        it('should not add the same input twice', function() {
            service.addInput('test');
            service.addInput('test');
            expect(service.getInput()).toEqual(['test']);
        });

        it('should not add the same Object input twice', function() {
            service.addInput({"test": true});
            service.addInput({"test": true});
            expect(service.getInput()).toEqual([{'test': true}]);
        });

        it('should broadcast an event with the new input value as an argument', function() {
            service.addInput(1);
            expect(events.broadcast.calls.mostRecent().args).toEqual(['queryInputUpdate', [[1]]]);
            service.addInput(2);
            expect(events.broadcast).toHaveBeenCalledTimes(2);
            expect(events.broadcast.calls.mostRecent().args).toEqual(['queryInputUpdate', [[1, 2]]]);
        });

        it('should not broadcast an event if the new seed already existed in the input array', function() {
            service.addInput({"hello": "world"});
            service.addInput({"hello": "world"});
            expect(events.broadcast).toHaveBeenCalledTimes(1);
        });

    });

    describe('input.setInput()', function() {
        it('should set the input', function() {
            service.setInput('test');
            expect(service.getInput()).toEqual('test');
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
            expect(events.broadcast).toHaveBeenCalledTimes(5);
            expect(events.broadcast.calls.argsFor(2)).toEqual(['queryInputUpdate', [[]]])
            expect(events.broadcast.calls.argsFor(3)).toEqual(['secondaryInputUpdate', [[]]]);
            expect(events.broadcast.calls.argsFor(4)).toEqual(['pairInputUpdate', [[]]]);
        });
    });

    describe('input.removeInput()', function() {
        it('should remove a string seed', function() {
            service.addInput('test1');
            service.addInput('test2');
            service.addInput('test3');

            service.removeInput('test2');
            expect(service.getInput()).toEqual(['test1', 'test3']);
        });

        it('should remove an object seed', function() {
            service.addInput({name: 'objTest1'});
            service.addInput({name: 'objTest2'});
            service.addInput({name: 'objTest3'});

            service.removeInput({name: 'objTest1'});
            expect(service.getInput()).toEqual([{name: 'objTest2'}, {name: 'objTest3'}]);
        });

        it('should remove a numerical seed', function() {
            service.addInput(1)
            service.addInput(2)
            service.addInput(3)

            service.removeInput(3);
            expect(service.getInput()).toEqual([1, 2]);
        });

        it('should do nothing if the seed does not exist in the input array', function() {
            service.addInput(1);
            service.addInput(2);
            service.addInput(3);

            service.removeInput('test');
            expect(service.getInput()).toEqual([1, 2, 3]);
        });

        it('should fire an update event if the seed is removed', function() {
            service.addInput(1)
            events.broadcast.calls.reset();
            service.removeInput(1);
            expect(events.broadcast).toHaveBeenCalledTimes(1);
        });

        it('should not fire an update event if the seed is not removed', function() {
            service.addInput('test');
            events.broadcast.calls.reset();
            service.removeInput('not in array');
            expect(events.broadcast).not.toHaveBeenCalled();
        });
    });

    describe('input.createOperationInput()', function() {
        
    });
});
