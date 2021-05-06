describe('The Graph service', function() {

    var service;

    beforeEach(module('app'));


    beforeEach(inject(function(_graph_) {
        service = _graph_;
    }));

    describe('graph.getGraphConfiguration()', function() {
        it('should pass the value of the configuration so that mutation of the service value cannot occur outside the service', function() {
            service.setGraphConfiguration({ 'test': true });
            var conf = service.getGraphConfiguration();
            conf['foo'] = 'bar';

            expect(service.getGraphConfiguration().foo).toBeUndefined();
        })
    });

    describe('graph.setGraphConfiguration()', function() {
        it('should pass a value to the service object ensuring that the service configuration cannot be mutated outside the service', function() {
            var test = {
                'foo': 'bar'
            }

            service.setGraphConfiguration(test);

            test.isPassed = true;

            expect(service.getGraphConfiguration()).toEqual({
                'foo': 'bar'
            });
        });
    });

    describe('graph.getSelectedElements()', function() {
        it('should pass the value of the selected elements so that mutation of the service value cannot occur outside the service', function() {
            service.setSelectedElements({ 'test': true });
            var conf = service.getSelectedElements();
            conf['foo'] = 'bar';

            expect(service.getSelectedElements().foo).toBeUndefined();
        })
    });

    describe('graph.setSelectedElements()', function() {
        it('should pass a value to the service object ensuring that the selected elements in the service cannot be mutated outside the service', function() {
            var test = {
                'foo': 'bar'
            }

            service.setSelectedElements(test);

            test.isPassed = true;

            expect(service.getSelectedElements()).toEqual({
                'foo': 'bar'
            });
        });
    });

    describe('graph.getSearchTerm()', function() {
        it('should pass the value of the search term so that mutation of the service value cannot occur outside the service', function() {
            service.setSearchTerm('test');
            var st = service.getSearchTerm();
            st += 'case';

            expect(service.getSearchTerm()).toEqual('test');
        })
    });

    describe('graph.setSearchTerm()', function() {
        it('should pass a value to the service object ensuring that the service configuration cannot be mutated outside the service', function() {
            var test = 'test'

            service.setSearchTerm(test);

            test = 'new test';

            expect(service.getSearchTerm()).toEqual('test');
        });
    });

    describe('graph.getRemovedElements()', function() {
        it('should set and get the removed elements', function() {
            var removedElements = [1,3,5,7];
            service.setRemovedElements(removedElements);

            var result = service.getRemovedElements();

            expect(result).toEqual(removedElements);
        })
    });

    describe('graph.getGraphJson()', function() {
        it('should set and get the graph json', function() {
            var graphJson = {elements: [1,2]};
            service.setGraphJson(graphJson);

            var result = service.getGraphJson();

            expect(result).toEqual(graphJson);
        })
    });

    describe('graph.hasGraphJson()', function() {
        it('should return true when the graph json is set', function() {
            var graphJson = {elements: [1,2]};
            service.setGraphJson(graphJson);

            var result = service.hasGraphJson();

            expect(result).toEqual(true);
        })

        it('should return false when the graph json is not set', function() {
            var graphJson = {elements: []};
            service.setGraphJson(graphJson);

            var result = service.hasGraphJson();

            expect(result).toEqual(false);
        })
    });

    describe('graph.deselectAll()', function() {

        beforeEach(function() {
            service.setSelectedElements({
                entities: [
                    'test',
                    'test2'
                ],
                edges: [
                    'myEdgeid'
                ]
            });
        });

        it('should reset the selected Entities and Edges to empty objects', function() {
            service.deselectAll();

            var expected = {
                entities: [],
                edges: []
            }

            expect(service.getSelectedElements()).toEqual(expected);
        });
    });
});
