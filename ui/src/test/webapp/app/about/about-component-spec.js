describe('The about component', function() {

    var ctrl;
    
    beforeEach(module('app'));

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
                },
                getSchemaVertices: function() {
                    return []
                }
            }
        });
    }));

    beforeEach(inject(function(_$componentController_, _$rootScope_) {
        var scope = _$rootScope_.$new();
        var $componentController = _$componentController_;
        ctrl = $componentController('about', {$scope: scope})
    }));

    describe('ctrl.$onInit()', function() {
        it('should load the properties', function() {

        });

        it('should extract the documentation url from the properties', function() {
            
        });

        it('should extract the description from the properties', function() {

        });

        it('should update the properties loaded flag', function() {

        });

        it('should load the config', function() {

        });

        it('should trim the REST API to remove the version', function() {

        });

        it('should get the list of feedback email addresses', function() {

        });
    });

    describe('ctrl.sendFeedback()', function() {

    });

    describe('ctrl.renderDescription()', function() {
        it('should output a string as a string', function)
    });

});