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

    describe('Given a selected elements update is received', function() {

        it('should update the selectedEntities', function() {
            events.broadcast('selectedElementsUpdate', [{entities: [1, 2, 3]}]);
            expect(ctrl.selectedEntities).toEqual([1, 2, 3]);
        });

        it('should update the seeds message', function() {
            events.broadcast('selectedElementsUpdate', [ { entities: { '"test1"': {}, '"test2"': {} } }]);
            expect(ctrl.seedsMessage).toEqual("test1, test2");
        });

        it('When more than two entities are returned, should truncate the seeds message', function() {
            events.broadcast('selectedElementsUpdate', [ { entities: { '"test1"': {}, '"test2"': {}, '"test3"': {}} }]);
            expect(ctrl.seedsMessage).toEqual("test2, test3 and 1 more");
        });

        it('should always display the last two seeds', function() {
            events.broadcast('selectedElementsUpdate', [ { entities: { '"This"': {}, '"is"': {}, '"my"': {}, '"test"': {}} }]);
            expect(ctrl.seedsMessage).toEqual("my, test and 2 more");
        });

        it('should show a message even if no seeds are selected', function() {
            events.broadcast('selectedElementsUpdate', [ { entities: {} }]);
            expect(ctrl.seedsMessage).toEqual("No Seeds added. Type in your seeds and click add.")
        });
    });

    describe('When the element is destroyed and an update is received', function() {
        beforeEach(function() {
            ctrl.$onDestroy();
        });

        it('should no longer respond to SelectedElementsUpdate events', function() {
            events.broadcast('selectedElementsUpdate', [ { entities: {'"Element1"': {}, '"Element2"': {} } } ]);
            expect(ctrl.selectedEntities).toEqual({});
        });
    });
});