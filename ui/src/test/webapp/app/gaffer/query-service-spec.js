describe('The query service', function() {

    var $rootScope;

    var service;

    beforeEach(module('app'));

    beforeEach(inject(function(_$rootScope_, _query_) {
        $rootScope = _$rootScope_;
        service = _query_;
    }));

    beforeEach(function() {
        $rootScope.$digest();
    });

    describe('executeOperationJson', function() {
        it('should execute an operation json string', function() {
            service.executeOperationJson('{\"class\": \"GetAllElements\"}');
            expect(service.getOperations()).toEqual([{"class": "GetAllElements"}])
        });

        it('should not execute an operation json string if null', function() {
            service.executeOperationJson(undefined);
            expect(service.getOperations()).toEqual([])
        });
    });
});
