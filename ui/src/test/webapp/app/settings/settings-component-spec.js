describe('The Settings Component', function() {
    beforeEach(module('app'));

    describe('The Controller', function() {

        var $componentController

        var scope;

        var ctrl;

        beforeEach(module(function($provide) {
            $provide.factory('config', function($q) {
                var get = function() {
                    return $q.when({});
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

        beforeEach(inject(function(_$componentController_, _$rootScope_) {
            $componentController = _$componentController_;
            scope = _$rootScope_.$new();
        }));

        beforeEach(function() {
            ctrl = $componentController('settingsView', {$scope: scope});
        });


        it('should exist', function() {
            expect(ctrl).toBeDefined();
        });


        // TODO Add tests for updating schema
       
    });
});
