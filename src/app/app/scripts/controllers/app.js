'use strict';

angular.module('marinetApp')
    .controller('AppCtrl', ['$scope', 'Apps','$routeParams', 
        function ($scope, apps, rParams) {
            
            $scope.selectedApp = {};
            
            $scope.applications = apps.find();
            
            function User(name){
                
                let apps = [];
                
                this.name = name;
                
                this.__defineGetter__('application', () => apps.find( (app) => app.name === $scope.selectedApp.name ));
                
                this.__defineSetter__('application', () => apps.push({name: $scope.selectedApp.name, allowed: true}) );
                
            }
            
            function loadUsers(){
                console.log($scope.applications);
            }            
            
            $scope.setApplication = function(application){
                $scope.selectedApp = application;
                loadUsers();
            };
            
        }
    ]);
