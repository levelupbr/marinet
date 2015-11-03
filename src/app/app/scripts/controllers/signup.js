/* global angular */

'use strict';

angular.module('marinetApp')
    .controller('SignupCtrl', ['$scope', 'Auth', 'toaster',
        function ($scope, Auth, toaster) {
            
            $scope.is_loading = false;
            
            $scope.user = {};

            $scope.register = function () {
                Auth.register($scope.user, function () {
                        Auth.login({username: $scope.user.name, password: $scope.user.password});
                        toaster.pop('success', '', 'Usuário criado com sucesso');

                    },function (err) {
                        console.log(err);
                        $scope.is_loading = false;
                        toaster.pop('error', '', 'Erro ao criar a usuário');
                    });
            };
  }]);
