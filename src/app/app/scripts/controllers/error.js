/* global angular */

'use strict';

angular.module('marinetApp')
    .controller('ErrorCtrl', ['$scope', '$routeParams', 'Errors', 'toaster', '$filter', '$sce',
        function ($scope, $routeParams, Errors, toaster, $filter, $sce) {

            $scope.name = $routeParams.appName;
            $scope.hash = $routeParams.hash;

            $scope.error = Errors.get($scope.hash, $scope.name, function (error) {
                $scope.solved = error.solved;
                $scope.ignore = error.ignore;
            });

            $scope.solve = function () {
                toaster.pop('success', '', 'Erro solucionado');
                Errors.solve($scope.hash, $scope.name).then(function (data) {
                    $scope.solved = true;
                });
            };

            $scope.toggleIgnore = function() {
              Errors.ignore($scope.hash, !$scope.ignore).then(function (data) {
                  $scope.ignore = !$scope.ignore;
                  toaster.pop('success', '', $scope.ignore ? 'muted' : 'unmuted');
              });
            };

            $scope.load = function (id) {
                Errors.getById($scope.hash, id, function (result) {
                    result.others = $scope.error.others;
                    result.selected = id;
                    $scope.solved = result.solved;
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

            $scope.parseErrorValue = function(value){

                if ( value === null )
                    return '';

                if (Number.isInteger(value)){
                    return value.toString();
                }

                if ( typeof value === 'boolean')
                    return value.toString();

                if( Array.isArray(value) )
                    return value.length == 0 ? ' - ' : $sce.trustAsHtml("<ul><li>" + value.join('</li><li>') + "</li><ul>");

                return value.length <= 200 ? $scope.displayVal(value) : $sce.trustAsHtml("<pre>" + value + "</pre>");
            };
    }]);
