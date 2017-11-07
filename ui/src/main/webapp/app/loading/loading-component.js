'use strict'

angular.module('app').component('loadingCircle', loadingCircle());

function loadingCircle() {
    return {
        templateUrl: 'app/loading/loading.html',
        controller: LoadingController,
        controllerAs: 'ctrl'
    }
}

function LoadingController(loading) {
    var vm = this;

    vm.isLoading = loading.isLoading;
}