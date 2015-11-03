/* global angular */

'use strict';

angular.module('marinetApp')
    .service('Auth', ['$http', '$rootScope',  '$q', 'AUTH_EVENTS', 'ROUTING_CONFIG',
        function ($http, $rootScope, $q, AUTH_EVENTS, ROUTING_CONFIG) {

            var accessLevels = ROUTING_CONFIG.accessLevels,
                userRoles = ROUTING_CONFIG.userRoles;

            var deferred = $q.defer();
            
            var onLoginSuccess = function(user) {
                $rootScope.user = user;
                $rootScope.loggedIn = true;
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            };

            $http.get(ROUTING_CONFIG.apiUrl + '/user/me')
                .success(function (data) {
                    onLoginSuccess(data);
                    deferred.resolve(data);
                })
                .error(function (err) {
                    $rootScope.user = {};
                    deferred.resolve({
                        username: '',
                        role: userRoles.public,
                        error: err 
                    });
                });

            $rootScope.loggedIn = false;
            $rootScope.user = deferred.promise;

            $rootScope.accessLevels = accessLevels;
            $rootScope.userRoles = userRoles;

            return {
                authorize: function (accessLevel, role) {
                    if (role === undefined)
                        role = userRoles[$rootScope.user.role];
                    return !!(accessLevel & role);
                },

                isLoggedIn: function () {
                    var isLoggedIn = userRoles[$rootScope.user.role] === userRoles.user || userRoles[$rootScope.user.role] === userRoles.admin;
                    
                    if ( isLoggedIn )
                        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                    
                    return isLoggedIn;
                },

                register: function (user, success, error) {
                    $http.post(ROUTING_CONFIG.apiUrl + '/user', user).success(success).error(error);
                },

                login: function (user, success, error) {
                    $http.post(ROUTING_CONFIG.apiUrl + '/login', user).then(function (response) {
                        onLoginSuccess(response.data);
                        
                        if ( angular.isFunction(success))
                            success(response.data);
                    }, error);
                },

                logout: function (success, error) {
                    
                    var self = this;
                    
                    $http.delete(ROUTING_CONFIG.apiUrl + '/logout').success(function () {
                        self.sessionDestroyer();
                        success();
                    }).error(error);
                },
                
                sessionDestroyer: function() {
                    $rootScope.user = {
                        username: '',
                        role: userRoles.public
                    };
                    $rootScope.loggedIn = false;
                },

                accessLevels: accessLevels,
                userRoles: userRoles,
                user: $rootScope.user
            };
}]);
