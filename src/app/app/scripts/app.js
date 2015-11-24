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

    var runner = function($rootScope, $location, toaster, Auth, Apps, AUTH_EVENTS, ROUTING_CONFIG) {
        
        $rootScope.apps = Apps.find();
        
        var goToRequestedRoute = function()
        {
            if ( $location.path().indexOf('/login') === 0 ) return;
            var r = encodeURIComponent($location.path());
            return $location.path('/login').search({r: r});
        };
        
        var getDefaultRoute = function()
        {
            return $rootScope.user.accountName + '/dashboard';
        };
        
        var accessLevels = ROUTING_CONFIG.accessLevels;
        
        $rootScope.$on(AUTH_EVENTS.loginSuccess, function() {
            var r = $location.search().r;
            var path = angular.isDefined(r) && r !== '%2F' ? decodeURIComponent(r) : getDefaultRoute();
            $location.path(path).search({});
        });
        
        $rootScope.$on(AUTH_EVENTS.notAuthenticated, function(){
            Auth.sessionDestroyer();
            if ( $location.path() === "/login" ) return;
            goToRequestedRoute();
        });
        
        $rootScope.$on(AUTH_EVENTS.notAuthorized, function(){
            toaster.pop('error', '', 'Você não tem acesso suficiente');
        });
        
        $rootScope.$on("$routeChangeStart", function(event, next) {
            
            var accessLevel = angular.isDefined(next.$$route) ? next.$$route.access : accessLevels.anon;
           
            if ( ! $rootScope.loggedIn && accessLevels.anon !== accessLevel )
                goToRequestedRoute();
            
            if ( $rootScope.loggedIn && ! Auth.authorize(accessLevel) )
                return $rootScope.$evalAsync(function () { 
                    $location.path(getDefaultRoute());
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                });
        });
    };
    
    angular
        .module('marinetApp')
        .config(['$routeProvider', '$httpProvider', '$locationProvider', 'ROUTING_CONFIG', appConfig])
        .run(['$rootScope', '$location', 'toaster', 'Auth', 'Apps', 'AUTH_EVENTS', 'ROUTING_CONFIG', runner]);

})();