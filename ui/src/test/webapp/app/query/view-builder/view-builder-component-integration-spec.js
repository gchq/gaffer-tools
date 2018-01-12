//describe('The View Builder Component', function() {
//    var ctrl;
//    var events;
//
//    beforeEach(module('app'));
//
//    beforeEach(inject(function(_$componentController_, _events_) {
//        var $componentController = _$componentController_;
//        ctrl = $componentController('viewBuilder');
//        events = _events_;
//    }));
//
//
//    describe('When related element update events are fired', function() {
//        var edges = ['this', 'is', 'a', 'test'];
//        var entities = ['this', 'is', 'also', 'a', 'test'];
//
//        beforeEach(function() {
//            ctrl.$onInit();
//        })
//
//        beforeEach(function() {
//            events.broadcast('relatedEdgesUpdate', [edges]);
//            events.broadcast('relatedEntitiesUpdate', [entities])
//        });
//
//        it('should update the related Edges model', function() {
//            expect(ctrl.relatedEdges).toEqual(edges);
//
//        });
//
//        it('should update the related Entities model when the event is fired', function() {
//            expect(ctrl.relatedEntities).toEqual(entities);
//        });
//    });
//
//    describe('Once destroyed and related element updates are fired', function() {
//        var edges = ['this', 'is', 'a', 'test'];
//        var entities = ['this', 'is', 'also', 'a', 'test'];
//
//        beforeEach(function() {
//            ctrl.$onInit();
//            ctrl.$onDestroy();
//        })
//
//        beforeEach(function() {
//            events.broadcast('relatedEdgesUpdate', [edges]);
//            events.broadcast('relatedEntitiesUpdate', [entities])
//        });
//
//        it('should no longer update the related Edges model when the event is fired', function() {
//            expect(ctrl.relatedEdges).toEqual([]);
//        });
//
//        it('should no longer update the related Entities model when the event is fired', function() {
//            expect(ctrl.relatedEntities).toEqual([]);
//        });
//
//    })
//});