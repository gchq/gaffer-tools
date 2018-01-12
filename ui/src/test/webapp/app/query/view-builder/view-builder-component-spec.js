//describe('The View Builder Component', function() {
//    beforeEach(module('app'));
//
//     beforeEach(module(function($provide) {
//        $provide.factory('config', function($q) {
//            var get = function() {
//                return $q.when({});
//            }
//
//            return {
//                get: get
//            }
//        });
//
//        $provide.factory('schema', function($q) {
//            return {
//                get: function() {
//                    return $q.when({});
//                }
//            }
//        });
//    }));
//
//    describe('The Controller', function() {
//        var $componentController;
//        var scope;
//
//        beforeEach(inject(function(_$componentController_, _$rootScope_) {
//            $componentController = _$componentController_;
//            scope = _$rootScope_.$new();
//        }));
//
//        it('should exist', function() {
//            var ctrl = $componentController('viewBuilder');
//            expect(ctrl).toBeDefined();
//        });
//
//        describe('When created', function() {
//
//            var graph, queryPage;
//
//            beforeEach(inject(function(_graph_, _queryPage_) {
//                graph = _graph_;
//                queryPage = _queryPage_;
//            }));
//
//            it('should use the graph service to set the initial value of the related entities', function() {
//                spyOn(graph, 'getRelatedEntities').and.returnValue('test');
//                var ctrl = $componentController('viewBuilder');
//                expect(ctrl.relatedEntities).toEqual('test')
//            });
//
//            it('should use the graph service to set the initial value of the related edges', function() {
//                spyOn(graph, 'getRelatedEdges').and.returnValue('test');
//                var ctrl = $componentController('viewBuilder');
//                expect(ctrl.relatedEdges).toEqual('test');
//            });
//        });
//
//        describe('when initialised', function() {
//            var events;
//            var ctrl;
//
//            beforeEach(inject(function(_events_) {
//                events = _events_;
//            }));
//
//            beforeEach(function() {
//                ctrl = $componentController('viewBuilder');
//            });
//
//            beforeEach(function() {
//                spyOn(events, 'subscribe');
//            });
//
//            beforeEach(function() {
//                ctrl.$onInit();
//            });
//
//            it('should subscribe to the relatedEntitiesUpdate event', function() {
//                expect(events.subscribe).toHaveBeenCalled();
//                expect(events.subscribe.calls.first().args[0]).toEqual('relatedEntitiesUpdate');
//            });
//
//            it('should subscribe to the relatedEdgesUpdate event', function() {
//                expect(events.subscribe).toHaveBeenCalled();
//                expect(events.subscribe.calls.argsFor(1)[0]).toEqual('relatedEdgesUpdate');
//            });
//
//            describe('when destroyed', function() {
//                var events;
//                var ctrl;
//
//                beforeEach(inject(function(_events_) {
//                    events = _events_;
//                }));
//
//                beforeEach(function() {
//                    ctrl = $componentController('viewBuilder');
//                    ctrl.$onInit();
//                });
//
//                beforeEach(function() {
//                    spyOn(events, 'unsubscribe');
//                });
//
//                beforeEach(function() {
//                    ctrl.$onDestroy();
//                });
//
//                it('should unsubscribe to the relatedEntitiesUpdate event', function() {
//                    expect(events.unsubscribe).toHaveBeenCalled();
//                    expect(events.unsubscribe.calls.first().args[0]).toEqual('relatedEntitiesUpdate');
//                });
//
//                it('should unsubscribe to the relatedEdgesUpdate event', function() {
//                    expect(events.unsubscribe).toHaveBeenCalled();
//                    expect(events.unsubscribe.calls.argsFor(1)[0]).toEqual('relatedEdgesUpdate');
//                });
//            });
//        });
//
//        describe('When the user adds a filter function', function() {
//
//            var ctrl;
//
//            beforeEach(function() {
//                ctrl = $componentController('viewBuilder');
//            })
//
//            it('should populate the expandElementContent if it is empty', function() {
//                var expandedElementContent = {};
//
//                ctrl.addFilterFunction(expandedElementContent, 'MyElementGroup', true);
//
//                expect(expandedElementContent).toEqual({
//                    "MyElementGroup": {
//                        filters: {
//                            preAggregation: [
//                                {}
//                            ]
//                        }
//                    }
//                })
//            });
//        })
//
//        describe('When the toggle() function is called', function() {
//            var ctrl;
//
//            beforeEach(function() {
//                ctrl = $componentController('viewBuilder');
//            });
//
//            it('should add an item to a list if it is not there',  function() {
//                var list = [1, 2, 3];
//
//                ctrl.toggle(4, list);
//
//                expect(list).toContain(4);
//            });
//
//            it('should remove an item from a list if it is there', function() {
//                var list = [1, 2, 3];
//
//                ctrl.toggle(3, list);
//
//                expect(list).not.toContain(3);
//            });
//        });
//
//        describe('When the user changes the property', function() {
//
//            var functions;
//            var ctrl;
//
//            var group, filter;
//
//            beforeEach(inject(function(_functions_) {
//                functions = _functions_;
//            }));
//
//            beforeEach(function() {
//                ctrl = $componentController('viewBuilder');
//            });
//
//            beforeEach(function() {
//                spyOn(functions, 'getFunctions').and.callFake(function(thing, otherThing, callback) {
//                    callback(['pred1', 'pred2', 'pred3'])
//                });
//            });
//
//            beforeEach(function() {
//                group = "test";
//                filter = {
//                    property: "prop"
//                }
//
//                ctrl.onSelectedPropertyChange(group, filter)
//            })
//
//            it('should make a call to the function service to get back all the functions available for that property', function() {
//                expect(functions.getFunctions).toHaveBeenCalledTimes(1)
//            });
//
//            it('should set that availableFunctions of the filter', function() {
//                expect(filter.availableFunctions).toEqual(['pred1', 'pred2', 'pred3']);
//            });
//
//            it('should initialise the predicate field', function() {
//                expect(filter.predicate).toEqual('');
//            })
//
//        });
//
//        describe('When the user changes the predicate', function() {
//
//            var functions;
//            var ctrl;
//
//            var group, filter;
//
//            beforeEach(inject(function(_functions_) {
//                functions = _functions_;
//            }));
//
//            beforeEach(function() {
//                ctrl = $componentController('viewBuilder', {$scope: scope});
//            });
//
//            beforeEach(function() {
//                spyOn(functions, 'getFunctionParameters').and.callFake(function(thing, callback) {
//                    callback(['param1', 'param2', 'param3'])
//                });
//            });
//
//            beforeEach(function() {
//                group = "test";
//                filter = {
//                    property: "prop",
//                    predicate: "some.Predicate"
//                }
//
//                ctrl.onSelectedFunctionChange(group, filter)
//            });
//
//            it('should make a call to the getSerialisedFields() method to get back the fields available', function() {
//                expect(functions.getFunctionParameters).toHaveBeenCalledTimes(1);
//            });
//
//            it('should set the availableFunctionParameters in the filter', function() {
//                expect(filter.availableFunctionParameters).toEqual(['param1', 'param2', 'param3']);
//            });
//
//            it('should initialise the parameters field', function() {
//                scope.$digest();
//                expect(filter.parameters).toEqual({})
//            })
//        });
//
//
//
//    });
//})