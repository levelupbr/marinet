/* global angular */

'use strict';

angular.module('marinetApp')
    .controller('SettingsCtrl', ['$scope',
        function ($scope) {
            console.log($scope.$root.user);
            $scope.user = $scope.$root.user;
 }]);
