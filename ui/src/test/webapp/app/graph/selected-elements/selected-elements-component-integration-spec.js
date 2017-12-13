describe('The Selected Elements Component', function() {
    beforeEach(module('app'));
    describe('When the events service broadcasts a selected Elements update', function() {
        var $componentController
        var events;
        var ctrl;

        var newSelectedElements = {
            'edges': [
                {
                    source: {
                        vertex: 1,
                        properties: {
                            count: 3
                        }
                    },
                    destination: {
                        vertex: 5,
                        properties: {
                            count: 1
                        }
                    }
                }
            ],
            'entities': [
                {
                    vertex: 1,
                    properties: {}
                },
                {
                    vertex: 2,
                    properties: {}
                }
            ]
        }

        beforeEach(inject(function(_$componentController_, _events_) {
            $componentController = _$componentController_;
            events = _events_;
        }));

        beforeEach(function() {
            ctrl = $componentController('selectedElements');
            ctrl.$onInit();
        });

        beforeEach(function() {
            events.broadcast('selectedElementsUpdate', [newSelectedElements]);
        });

        it('should update the selected Entities', function() {
            expect(ctrl.selectedEntities).toEqual(newSelectedElements['entities']);
            expect(ctrl.selectedEdges).toEqual(newSelectedElements['edges']);
        });
    });
})