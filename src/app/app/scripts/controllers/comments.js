'use strict';

/**
 * @ngdoc function
 * @name marinetApp.controller:CommentsCtrl
 * @description
 * # CommentsCtrl
 * Controller of the marinetApp
 */
angular.module('marinetApp')
    .controller('CommentsCtrl', ['$scope', 'Comments', 'toaster', 'ROUTING_CONFIG',
        function ($scope, Comments, toaster, ROUTING_CONFIG) {
            $scope.comments = Comments.query($scope.hash);
            $scope.lastMessageTime = '';
            $scope.message = '';

            $scope.displayRole = function (role) {
                return ROUTING_CONFIG.roleDisplayName(role);
            };
            $scope.send = function () {
                Comments.comment({
                    errorHash: $scope.hash,
                    message: $scope.message
                }).then(function (result) {
                    toaster.pop('success', '', 'Comentário salvo');
                    $scope.comments.push(result);
                    $scope.message = '';
                });
            };
    }]);
