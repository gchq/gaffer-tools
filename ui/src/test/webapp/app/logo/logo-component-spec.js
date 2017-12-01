describe('the Logo component', function() {

    var returnSrc = true;
    var getFunction;

    beforeEach(module('app'));

    beforeEach(module(function($provide) {
        $provide.factory('logo', function($q) {

            var get = jasmine.createSpy('get').and.callFake(function() {
                var src = 'http://someRestEndpoint/rest/images/logo.png';
                if (returnSrc) {
                    return $q.when(src);
                } else {
                    return $q.when(null);
                }
            });

            getFunction = get;

            return {
                get: get
            }

        });

    }));

    describe('The LogoController', function() {
        var $componentController;

        beforeEach(inject(function(_$componentController_) {
            $componentController = _$componentController_;
        }))

        it('should Exist', function() {
            var ctrl = $componentController('logo');
            expect(ctrl).toBeDefined();
        });

        it('should try and resolve logo on initialisation', function() {

            var ctrl = $componentController('logo');

            expect(getFunction.calls.count()).toEqual(1);

        });

        it('should set show variable to false if the service returns nothing', function(done) {
            returnSrc = false;
            var ctrl = $componentController('logo');
            done();
            expect(ctrl.show()).toEqual(false);
        });

        it('should set show variable to true if the service returns a source', function(done) {
            returnSrc = true;
            var ctrl = $componentController('logo');
            done();
            expect(ctrl.show()).toEqual(true);
        });

        it('should set the src variable when the service returns it', function(done) {
            returnSrc = true;
            var ctrl = $componentController('logo');
            done();
            expect(ctrl.src).toEqual('http://someRestEndpoint/rest/images/logo.png');
        });
    });

})