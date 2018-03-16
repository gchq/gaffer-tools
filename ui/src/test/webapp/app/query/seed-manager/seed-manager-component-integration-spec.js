describe('The Seed Manager Component', function() {

    beforeEach(module('app'));

    var ctrl;
    var events;

    beforeEach(module(function($provide) {
        $provide.factory('config', function($q) {
            var get = function() {
                return $q.when({
                    types: {
                        "java.lang.Long": {
                            "fields": [
                                {
                                    "type": "number",
                                    "step": "1",
                                    "class": "java.lang.Long",
                                    "required": true
                                }
                            ],
                            "wrapInJson": true
                        },
                        "java.lang.String": {
                            "fields": [
                                {
                                    "type": "text",
                                    "class": "java.lang.String",
                                    "required": true
                                }
                            ]
                        }
                    }
                });
            }

            return {
                get: get
            }
        });

        $provide.factory('schema', function($q) {
            return {
                get: function() {
                    return $q.when({});
                }
            }
        });
    }));


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
            events.broadcast('queryInputUpdate', [[{valueClass: 'java.lang.Long', parts: {undefined: 1}}, {valueClass: 'java.lang.Long', parts: {undefined: 2}}, {valueClass: 'java.lang.Long', parts: {undefined: 3}}]]);
            expect(ctrl.input).toEqual([{valueClass: 'java.lang.Long', parts: {undefined: 1}}, {valueClass: 'java.lang.Long', parts: {undefined: 2}}, {valueClass: 'java.lang.Long', parts: {undefined: 3}}]);
        });

        it('should update the seeds message', function() {
            events.broadcast('queryInputUpdate', [ [{valueClass: "java.lang.String", parts: {undefined: "test1"}}, {valueClass: "java.lang.String", parts: {undefined: "test2"}}] ]);
            expect(ctrl.seedsMessage).toEqual("Added test1, test2");
        });

        it('When more than two seeds are returned, should truncate the seeds message', function() {
            events.broadcast('queryInputUpdate', [ [{valueClass: "java.lang.String", parts: {undefined: "test1"}}, {valueClass: "java.lang.String", parts: {undefined: "test2"}}, {valueClass: "java.lang.String", parts: {undefined: "test3"}}]]);
            expect(ctrl.seedsMessage).toEqual("Added test2, test3 and 1 more");
        });

        it('should show a message even if no seeds are selected', function() {
            events.broadcast('queryInputUpdate', [ []]);
            expect(ctrl.seedsMessage).toEqual("No Seeds added. Type in your seeds");
        });

        it('should update the seeds message even if the seed is an empty string', function() {
            events.broadcast('queryInputUpdate', [ [ {valueClass: "java.lang.String", parts: {undefined: ""}}]]);
            expect(ctrl.seedsMessage).toEqual('Added ""');
        })
    });

    describe('When the element is destroyed and an update is received', function() {
        beforeEach(function() {
            ctrl.$onDestroy();
        });

        it('should no longer respond to queryInputUpdate events', function() {
            events.broadcast('queryInputUpdate', [[ {valueClass: "java.lang.Long", parts: {undefined: 200}},{valueClass: "java.lang.Long", parts: {undefined: 4000}} ]]);
            expect(ctrl.input).toEqual([]);
        });
    });
});