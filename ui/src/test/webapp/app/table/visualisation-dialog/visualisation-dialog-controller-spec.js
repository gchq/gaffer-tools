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

        it('should sort string labels', function() {
            scope.data = [
                {'a': 'jkl', 'b': 1},
                {'a': 'ghi', 'b': 2},
                {'a': 'def', 'b': 3},
                {'a': 'abc', 'b': 4}
            ];

            scope.preview();

            expect(scope.labels).toEqual(['abc', 'def', 'ghi', 'jkl']);
            expect(scope.chartData).toEqual([4, 3, 2, 1])
        });

        it('should sort numeric labels', function() {
            scope.data = [
                {'b': 'ghi', 'a': 2},
                {'b': 'jkl', 'a': 1},
                {'b': 'def', 'a': 3},
                {'b': 'abc', 'a': 14}
            ];

            scope.preview();

            expect(scope.chartData).toEqual(['jkl', 'ghi', 'def', 'abc']);
            expect(scope.labels).toEqual([1, 2, 3, 14]);
        });

        it('should sort boolean values', function() {
            scope.data = [
                {'a': false, 'b': 1},
                {'a': true, 'b': 2}
            ];

            scope.preview();

            expect(scope.labels).toEqual([true, false]);
            expect(scope.chartData).toEqual([2, 1])
        });

        it('should aggregate numeric data together by adding values together', function() {
            scope.data = [
                {'a': 'abc', 'b': 11},
                {'a': 'def', 'b': 2},
                {'a': 'def', 'b': 33},
                {'a': 'abc', 'b': 4}
            ];

            scope.preview();

            expect(scope.labels).toEqual(['abc', 'def']);
            expect(scope.chartData).toEqual([15, 35])
        })

        it('should be able to create line charts with no series defined', function() {
            scope.selectedChart = scope.charts['line'];
            scope.selectedChart.fields['labels'].value = 'a';
            scope.selectedChart.fields['data'].value = 'b';

            scope.data = [
                {
                    'a': 3,
                    'b': 20
                },
                {
                    'a': 0,
                    'b': 25
                },
                {
                    'a': 100,
                    'b': -2
                }
            ];

            scope.preview();

            expect(scope.labels).toEqual([0, 3, 100]);
            expect(scope.chartData).toEqual([25, 20, -2]);
        });

        it('should be able to create line charts with a series defined', function() {
            scope.selectedChart = scope.charts['line'];
            scope.selectedChart.fields['labels'].value = 'a';
            scope.selectedChart.fields['data'].value = 'b';
            scope.selectedChart.fields['series'].value = 'c';

            scope.data = [
                {
                    'a': 3,
                    'b': 20,
                    'c': 'test'
                },
                {
                    'a': 0,
                    'b': 25,
                    'c': 'test'
                },
                {
                    'a': 100,
                    'b': -2,
                    'c': 'not test'
                }
            ];

            scope.preview();

            expect(scope.series).toEqual(['test', 'not test']);
            expect(scope.labels).toEqual([0, 3, 100]);
            expect(scope.chartData[0]).toEqual([25, 20]);
            expect(scope.chartData[1].length).toEqual(3);
            expect(scope.chartData[1][0]).toBeUndefined();
            expect(scope.chartData[1][1]).toBeUndefined();
            expect(scope.chartData[1][2]).toEqual(-2);


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
        it('should set showPreview to false', function() {

        })
    });

    describe('confirm()', function() {
        it('should close the dialog using the chart parameters', function() {

        })
    })
});