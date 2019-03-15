describe('The Navigation Component', function() {

    beforeEach(module('app'));

    describe('The Controller', function() {

        var $componentController;
        var navigation, $route;

        beforeEach(inject(function(_$componentController_, _navigation_, _$route_) {
            $componentController = _$componentController_;
            navigation = _navigation_;
            $route = _$route_;
        }));

        it('should exist', function() {
            var ctrl = $componentController('sidenav');
            expect(ctrl).toBeDefined();
        });

        describe('when initialised', function() {
            it('should load routes', function() {
                var routesSpy = spyOn($route, 'routes');
                var ctrl = $componentController('sidenav');
                expect(ctrl.routes).toEqual(routesSpy);
            });
            it('should configure goTo', function() {
                var goToSpy = spyOn(navigation, 'goTo');
                var ctrl = $componentController('sidenav');
                expect(ctrl.goTo).toEqual(goToSpy);
            });
        });

        describe('sidenav controls', function() {
            var ctrl;
            beforeEach(function() {
                ctrl = $componentController('sidenav');
            });

            it('should collapse the sidenav', function() {
                ctrl.collapse();
                expect(ctrl.collapsed).toBeTruthy();
            });

            it('should expand the sidenav', function() {
                ctrl.expand();
                expect(ctrl.collapsed).toBeFalsy();
            });
        });
    });
});
