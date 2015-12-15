'use strict';

angular.module('marinetApp')
    .controller('AppCtrl', ['$scope', 'Users', 'Apps', 
        function ($scope, usersService, AppService) {
            
            $scope.toggleDisabled = true;
            
            AppService.getOwn().then((ownedApps)=>{
                
                $scope.ownedApps = ownedApps;
                
                $scope.viewModel = {
                    apps: JSON.parse(JSON.stringify($scope.ownedApps)),
                    users: {},
                    get app(){
                        return this.apps.find( (app)=> {
                            if (typeof $scope.selectedApp === "undefined") return;
                            return app.id === $scope.selectedApp.id;
                        } );
                    }
                };
                
                if (ownedApps.length > 0) loadUsers();
            });
            
            function loadUsers(){
                usersService.find().$promise.then((users)=>{

                    users.splice(users.findIndex((user)=>user.accountName===$scope.user.accountName), 1);                
                    $scope.viewModel.users = users;

                    $scope.viewModel.apps.forEach((app)=>{
                        app.users = {};
                        users.forEach((user)=>{
                            Object.defineProperty(app.users, user._id, {value: {allowed: app.allowed.indexOf(user.accountId) > -1 ? true: false} });
                        });
                    });

                });
            }
            $scope.setApplication = function(application){
                $scope.selectedApp = application;
                $scope.toggleDisabled = false;
            };
            
            function isAppSelected(){
                return $scope.selectedApp;
            }
            
            $scope.update = function(userAccountId){
                
                if (!isAppSelected()) return console.warn("No application selected");
                
                if (!userAccountId) return console.warn("User has no accountId");
                
                var index = $scope.selectedApp.allowed.indexOf(userAccountId);                                
                var args = [];
                
                if ( index < 0){
                    args = [index, 0, userAccountId.toString()];
                }else{
                    args = [index, 1];
                }
                
                $scope.selectedApp.allowed.splice.apply($scope.selectedApp.allowed, args);
                
                AppService.update($scope.selectedApp);
            };
        }
    ]);
