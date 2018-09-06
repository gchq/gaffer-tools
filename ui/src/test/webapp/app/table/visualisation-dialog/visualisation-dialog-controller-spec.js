describe('Visualisation Dialog Controller', function() {
    var ctrl, scope;
    var $controller;

    beforeEach(module('app'));

    beforeEach(inject(function(_$controller_, _$rootScope_) {
        $controller = _$controller_;
        var $rootScope = _$rootScope_;

        scope = $rootScope.$new()
    }));

    var createController = function() {
        return $controller('VisualisationDialogController', { $scope: scope});
    }

    beforeEach(function() {
        ctrl = createController();
    });

    it('should exist', function() {
        expect(ctrl).toBeDefined();
    });

    describe('preview()', function() {

        beforeEach(function() {

            scope.selectedChart = {
                "type": "bar",
                "fields": {
                    "labels": {
                        "axis": "x",
                        "label": "x axis property",
                        "required": true,
                        "value": "a"
                    },
                    "data": {
                        "axis": "y",
                        "label": "y axis property",
                        "required": true,
                        "value": "b"
                    },
                    "series": {
                        "label": "chart series property"
                    }
                }
            }

            scope.columns = ['a', 'b', 'c']

        });

        it('should remove null labels and values from the chart data', function() {
            scope.data = [
                {'a': 1, 'b': 2, 'c': 3}, 
                {'a': null, 'b': 3, 'c': 4},
                {'a': 3, 'b': null, 'c': 5}
            ]

            scope.preview();

            expect(scope.labels).toEqual([1]);
            expect(scope.chartData).toEqual([2]);
        });

        it('should remove undefined labels and values from the chart', function() {
            scope.data = [
                {'a': 1, 'b': 2, 'c': 3}, 
                {'b': 3, 'c': 4},
                {'a': 3, 'c': 5}
            ]

            scope.preview();

            expect(scope.labels).toEqual([1]);
            expect(scope.chartData).toEqual([2]);
        });

        it('should be able to create line charts with no series defined', function() {

        });

        it('should be able to create line charts with a series defined', function() {

        });

        it('should be able to create bar charts with no series defined', function() {

        });

        it('should be able to create bar charts with a series defined', function() {

        });

        it('should be able to create bar charts from frequency maps with no series defined', function() {

        });

        it('should be able to create bar charts from frequency maps with a series defined', function() {

        });

        it('should be able to create a polarArea chart', function() {

        });

        it('should be able to create a doughnut chart', function() {

        });

        it('should be able to create a pie chart', function() {

        });

        it('should set showPreview to true', function() {

        })

        it('should send a message to the error service if a chart cannot be created', function() {

        })

    });

    describe('goBack()', function() {
        it('should set showPreview to false')
    });

    describe('confirm()', function() {
        it('should close the dialog using the chart parameters', function() {
            
        })
    })
});