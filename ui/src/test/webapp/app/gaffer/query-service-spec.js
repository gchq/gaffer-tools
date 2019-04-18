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
        var error;

        beforeEach(inject(function(_error_) {
            error = _error_;
        }));

        beforeEach(function() {
            spyOn(error, 'handle').and.stub();
        });

        it('should execute an operation json string', function() {
            service.executeOperationJson('{"class": "GetAllElements"}');
            expect(service.getOperations()).toEqual([{"class": "GetAllElements"}])
        });

        it('should execute multiple operation json strings', function() {
            service.executeOperationJson(['{"class": "GetAllElements"}', '{"class": "GetElements"}']);
            expect(service.getOperations()).toEqual([{"class": "GetAllElements"}, {"class": "GetElements"}])
        });

        it('should provide error if an operation is invalid', function() {
            service.executeOperationJson(['[[[ invalid json string [[[', '{"class": "GetElements"}']);

            expect(service.getOperations()).toEqual([{"class": "GetElements"}])
            expect(error.handle).toHaveBeenCalledWith('Error executing operation. Is it a valid json operation string?', '[[[ invalid json string [[[');
        });

        it('should not execute an operation json string if null', function() {
            service.executeOperationJson(undefined);
            expect(service.getOperations()).toEqual([])
        });
    });
});
