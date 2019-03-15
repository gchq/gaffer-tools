describe('the Logo component', function() {

    var returnSrc = true;

    beforeEach(module('app'));

    beforeEach(module(function($provide) {
        $provide.factory('logo', function($q) {

            return {
                get : function() {
                    if (returnSrc) {
                        return $q.when('http://someRestEndpoint/rest/images/logo.png');
                    } else {
                        return $q.when(null);
                    }
                }
            }

        });

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

    describe('The LogoController', function() {
        var $componentController, $q;
        var scope;
        var logo

        beforeEach(inject(function(_$componentController_, _$rootScope_, _logo_, _$q_) {
            $componentController = _$componentController_;
            var $rootScope = _$rootScope_;
            scope = $rootScope.$new();
            logo = _logo_;
            $q = _$q_;
        }));

        it('should Exist', function() {
            var ctrl = $componentController('logo');
            expect(ctrl).toBeDefined();
        });

        it('should try and resolve logo on initialisation', function() {
            spyOn(logo, 'get').and.returnValue($q.when(null));
            var ctrl = $componentController('logo');

            expect(logo.get).toHaveBeenCalledTimes(1);

        });

        it('should set show variable to false if the service returns nothing', function() {
            returnSrc = false;
            var ctrl = $componentController('logo', {$scope: scope});
            scope.$digest();
            expect(ctrl.show()).toEqual(false);
        });

        it('should set show variable to true if the service returns a source', function() {
            returnSrc = true;
            var ctrl = $componentController('logo', {$scope: scope});
            scope.$digest();
            expect(ctrl.show()).toEqual(true);
        });

        it('should set the src variable when the service returns it', function() {
            returnSrc = true;
            var ctrl = $componentController('logo', {$scope: scope});
            scope.$digest()
            expect(ctrl.src).toEqual('http://someRestEndpoint/rest/images/logo.png');
        });
    });

})
