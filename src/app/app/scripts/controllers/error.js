/* global angular */

'use strict';

angular.module('marinetApp')
    .controller('ErrorCtrl', ['$scope', '$routeParams', 'Errors', 'toaster', '$filter',
        function ($scope, $routeParams, Errors, toaster, $filter) {

            $scope.name = $routeParams.appName;
            $scope.hash = $routeParams.hash;

            $scope.error = Errors.get($scope.hash, $scope.name, function (error) {
                $scope.solved = error.solved;
            });


            $scope.solve = function () {
                toaster.pop('success', '', 'Erro solucionado');
                Errors.solve($scope.hash, $scope.name).then(function (data) {
                    $scope.solved = true;
                });
            };

            $scope.load = function (id) {
                Errors.getById($scope.hash, id, function (result) {
                    result.others = $scope.error.others;
                    result.selected = id;
                    $scope.error = result;
                }, function (err) {
                    console.log(err);
                });
            };

            $scope.canShow = function (key) {
                var blackList = ['message', 'exception', 'keys', 'hash', 'selected', 'solved', 'appName', 'accountId', 'others', 'occurrences'];
                return (-1 === blackList.indexOf(key) && key.indexOf('_') !== 0);
            };

            $scope.displayVal = function (val) {
                if (angular.isDate(val))
                    return $filter('date')(new Date(val), 'MMMM, dd yyyy HH:mm:ss');

                return val;
            };
    }]);
