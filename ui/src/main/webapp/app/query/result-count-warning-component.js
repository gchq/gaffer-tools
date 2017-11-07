'use strict'

angular.module('app').component('resultCountWarning', resultCountWarning());

function resultCountWarning() {

    return {
        templateUrl: 'app/query/result-count-warning.html',
        controller: ResultCountWarningController,
        controllerAs: 'ctrl'
    }

}


function ResultCountWarningController($mdDialog, settings) {
    var vm = this;

    vm.limit = settings.getResultLimit();

    vm.options = [
        {
            name: 'Edit query',
            value: 'query'
        },
        {
            name: 'Proceed to results',
            value: 'results'
        }
    ];

    vm.answer = $mdDialog.hide;
}
