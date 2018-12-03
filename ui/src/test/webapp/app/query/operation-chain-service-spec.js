describe('The operation chain service', function() {

    var service;
    var events;

    beforeEach(module('app'));

    beforeEach(inject(function(_events_, _operationChain_) {
        events = _events_;
        service = _operationChain_
    }));

    beforeEach(function() {
        spyOn(events, 'broadcast').and.stub();
    })

    describe('service.addInput()', function() {
        it('should add an object to the first operations\'s input array', function() {
            service.addInput('test');
            expect(service.getOperationChain()[0].fields.input).toEqual(['test']);
        });

        it('should not add the same input twice', function() {
            service.addInput('test');
            service.addInput('test');
            expect(service.getOperationChain()[0].fields.input).toEqual(['test']);
        });

        it('should not add the same Object input twice', function() {
            service.addInput({"test": true});
            service.addInput({"test": true});
            expect(service.getOperationChain()[0].fields.input).toEqual([{'test': true}]);
        });

        it('should broadcast an event with the new input value as an argument', function() {
            service.addInput(1);
            expect(events.broadcast.calls.mostRecent().args).toEqual(['onOperationUpdate', []]);
            service.addInput(2);
            expect(events.broadcast).toHaveBeenCalledTimes(2);
            expect(events.broadcast.calls.mostRecent().args).toEqual(['onOperationUpdate', []]);
        });

        it('should not broadcast an event if the new seed already existed in the input array', function() {
            service.addInput({"hello": "world"});
            service.addInput({"hello": "world"});
            expect(events.broadcast).toHaveBeenCalledTimes(1);
        });
    });

    describe('service.removeInput', function() {
        it('should remove a string seed', function() {
            service.addInput('test1');
            service.addInput('test2');
            service.addInput('test3');

            service.removeInput('test2');
            expect(service.getOperationChain()[0].fields.input).toEqual(['test1', 'test3']);
        });

        it('should remove an object seed', function() {
            service.addInput({name: 'objTest1'});
            service.addInput({name: 'objTest2'});
            service.addInput({name: 'objTest3'});

            service.removeInput({name: 'objTest1'});
            expect(service.getOperationChain()[0].fields.input).toEqual([{name: 'objTest2'}, {name: 'objTest3'}]);
        });

        it('should remove a numerical seed', function() {
            service.addInput(1)
            service.addInput(2)
            service.addInput(3)

            service.removeInput(3);
            expect(service.getOperationChain()[0].fields.input).toEqual([1, 2]);
        });

        it('should do nothing if the seed does not exist in the input array', function() {
            service.addInput(1);
            service.addInput(2);
            service.addInput(3);

            service.removeInput('test');
            expect(service.getOperationChain()[0].fields.input).toEqual([1, 2, 3]);
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

    describe('service.getOperationChain()', function() {
        it('should update instances when changes in the service', function() {
            var instance = service.getOperationChain(); // returns 1

            expect(instance.length).toEqual(1);

            service.add(false); // add an operation via the service

            expect(instance.length).toEqual(2);
        });


    });
})
