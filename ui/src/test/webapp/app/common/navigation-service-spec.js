describe('The navigation Service', function() {
    var service;

    beforeEach(module('app'));

    beforeEach(inject(function(_navigation_, _$route_, _$location_, _common_) {
        service = _navigation_;
        $route = _$route_;
        $location = _$location_;
        common = _common_;
    }));

    describe('navigation.updateURL', function() {
        beforeEach(function() {
            spyOn(service, 'getCurrentURL').and.returnValue('http://localhost:8080/#!/settings?graphId=test');
        });

        it('should add a graph ID parameter to the URL if a graph ID is defined', function() {
            spyOn($location, 'path').and.returnValue($location);
            spyOn($location, 'search').and.stub();
            var graphId = 'testGraphId';

            service.updateURL(graphId);

            var pageName = 'settings';
            var params = {graphId: graphId}
            expect($location.path).toHaveBeenCalledWith('/' + pageName);
            expect($location.search).toHaveBeenCalledWith(params);   
        });

        it('should clear the URL parameters if no graph ID is defined', function() {
            spyOn($location, 'path').and.returnValue($location);
            spyOn($location, 'search').and.stub();
            var graphId = null;

            service.updateURL(graphId);

            var pageName = 'settings';
            expect($location.path).toHaveBeenCalledWith('/' + pageName);
            expect($location.search).toHaveBeenCalledWith('graphId',null);
        })

    });

});
