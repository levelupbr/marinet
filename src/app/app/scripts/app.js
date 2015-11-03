/* global angular */

(function () {
    
    'use strict';

    var appConfig = function ($routeProvider, $httpProvider, $locationProvider, ROUTING_CONFIG) {

        var access = ROUTING_CONFIG.accessLevels;

        $httpProvider.defaults.withCredentials = true;

        $httpProvider.interceptors.push(['$q', '$rootScope', 'AUTH_EVENTS',
            function ($q, $rootScope, AUTH_EVENTS) {
                return {
                    'responseError': function (rejection) {
                        
                        if (rejection.status === 401)
                            $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                        
                        if (rejection.status === 403)
                            $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);

                        return $q.reject(rejection);
                    }
                };
        }]);
        

        $routeProvider
            .when('/:account/apps', {
                templateUrl: 'views/apps.html',
                controller: 'AppsCtrl',
                access: access.user
            })
            .when('/:account/newapp', {
                templateUrl: 'views/newapp.html',
                controller: 'NewappCtrl',
                access: access.admin
            })
            .when('/:account/:appName/errors', {
                templateUrl: 'views/errors.html',
                controller: 'ErrorsCtrl',
                access: access.user
            })
            .when('/:account/:appName/errors/:hash', {
                templateUrl: 'views/error.html',
                controller: 'ErrorCtrl',
                access: access.user
            })
            .when('/:account/dashboard', {
                templateUrl: 'views/dashboard.html',
                controller: 'DashboardCtrl',
                access: access.user
            })
            .when('/profile', {
                templateUrl: 'views/profile.html',
                controller: 'ProfileCtrl',
                access: access.user
            })
            .when('/settings', {
                templateUrl: 'views/settings.html',
                controller: 'SettingsCtrl',
                access: access.admin
            })
            .when('/login:r?', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl',
                access: access.anon
            })
            .when('/logout', {
                controller: 'LogoutCtrl',
                access: access.anon
            })
            .when('/signup', {
                controller: 'SignupCtrl',
                templateUrl: 'views/signup.html',
                access: access.anon
            })
            .otherwise({
                redirectTo: '/login'
            });

            $locationProvider.html5Mode(true);
    };

    var runner = function($rootScope, $location, $routeParams, toaster, Auth, AUTH_EVENTS, ROUTING_CONFIG) {
        
        var accessLevels = ROUTING_CONFIG.accessLevels;
        
        $rootScope.$on(AUTH_EVENTS.loginSuccess, function() {
            var path = angular.isDefined($routeParams.r) && $routeParams.r !== '/' ? $routeParams.r : $rootScope.user.accountName + '/dashboard';
            $location.path(path);
        });
        
        $rootScope.$on(AUTH_EVENTS.notAuthenticated, function(){
            Auth.sessionDestroyer();
            if ( $location.path() === "/login" ) return;
            $location.path('/login' + encodeURIComponent($location.path()));
        });
        
        $rootScope.$on(AUTH_EVENTS.notAuthorized, function(){
            toaster.pop('error', '', 'Você não tem acesso suficiente');
        });
        
        $rootScope.$on("$routeChangeStart", function(event, next){
        
            var accessLevel = angular.isDefined(next.$$route) ? next.$$route.access : accessLevels.anon;
            if (accessLevels.anon !== accessLevel && ! Auth.authorize(accessLevel) )
                $rootScope.$evalAsync(function () { 
                    $location.path('/' + $rootScope.user.accountName + '/dashboard');
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                });
        });
    };
    
    angular
        .module('marinetApp')
        .config(['$routeProvider', '$httpProvider', '$locationProvider', 'ROUTING_CONFIG', appConfig])
        .run(['$rootScope', '$location', '$routeParams', 'toaster', 'Auth', 'AUTH_EVENTS', 'ROUTING_CONFIG', runner]);

})();