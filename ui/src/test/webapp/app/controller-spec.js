describe('MainCtrl', function() {

    var controller;

    beforeEach(module('app'));

    beforeEach(inject(function(graph, queryPage, operationService, $controller) {
        controller = $controller('MainCtrl', {'graph': graph, 'queryPage': queryPage, 'operationService': operationService});
    }));

    it('should Exist', function() {
        expect(controller).toBeDefined();
    })
});