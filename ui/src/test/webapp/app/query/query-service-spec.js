describe('The Query Service', function() {
    var queryPage;

    beforeEach(module('app'));

    beforeEach(inject(function(_query_, _settings_, _events_) {
        queryPage = _query_;
        settings = _settings_;
        events = _events_;
    }));

    it('should exist', function() {
        expect(queryPage).toBeDefined();
    });
});