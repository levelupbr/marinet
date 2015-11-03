/* global angular */

'use strict';

angular.module('marinetApp')
    .controller('LoginCtrl', ['$scope', 'Auth', 'toaster',
        function ($scope, Auth, toaster) {
            
            Auth.isLoggedIn();
            
            $scope.user = {
                username: '',
                password: ''
            };
            $scope.login = function () {
                Auth.login($scope.user, function () {
                    $scope.$root.$emit('hidemessage', '');
                }, function (err) {
                    if ( err.status === 401)
                        return toaster.pop('warning', '', 'Usuário e/ou senha inválido');
                    toaster.pop('error', '', 'Ocorreu um erro no login');
                });
            };
  }]);
