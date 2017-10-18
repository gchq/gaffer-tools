'use strict'

angular.module('app').config(['$mdIconProvider', function($mdIconProvider) {

    $mdIconProvider
        .icon('logo', 'app/img/logo.svg')
        .icon('save', 'app/img/save.svg')
        .icon('info', 'app/img/info.svg')
}])