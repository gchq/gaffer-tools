describe('The Seed Manager Component', function() {

    beforeEach(module('app'));

    var ctrl;
    var events;

    beforeEach(inject(function(_$componentController_, _events_) {
        var $componentController = _$componentController_;
        ctrl = $componentController('seedManager');
        events = _events_;
    }));

    beforeEach(function() {
        ctrl.$onInit();
    });

    describe('Given a query input update update is received', function() {

        it('should update the local model', function() {
            events.broadcast('queryInputUpdate', [[1, 2, 3]]);
            expect(ctrl.input).toEqual([1, 2, 3]);
        });

        it('should update the seeds message', function() {
            events.broadcast('queryInputUpdate', [ ["test1", "test2"] ]);
            expect(ctrl.seedsMessage).toEqual("Added test1, test2");
        });

        it('When more than two seeds are returned, should truncate the seeds message', function() {
            events.broadcast('queryInputUpdate', [ [ 'test1', 'test2', 'test3']]);
            expect(ctrl.seedsMessage).toEqual("Added test2, test3 and 1 more");
        });

        it('should show a message even if no seeds are selected', function() {
            events.broadcast('queryInputUpdate', [ []]);
            expect(ctrl.seedsMessage).toEqual("No Seeds added. Type in your seeds and click add.");
        });
    });

    describe('When the element is destroyed and an update is received', function() {
        beforeEach(function() {
            ctrl.$onDestroy();
        });

        it('should no longer respond to queryInputUpdate events', function() {
            events.broadcast('queryInputUpdate', [ ['element1', 'element2'] ]);
            expect(ctrl.input).toEqual([]);
        });
    });
});