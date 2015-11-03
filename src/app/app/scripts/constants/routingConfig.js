/* global angular */

(function () {
    'use strict';
    
    var module = angular
            .module('marinetApp');

    var userRoles = {
        public: 1, // 001
        user: 2, // 010
        admin: 4 // 100
    };

    var userRolesDisplayName = {
        '1': 'public', // 001
        '2': 'user', // 010
        '4': 'admin' // 100
    };
    
    module.constant('ROUTING_CONFIG', {
        userRoles: userRoles,
        accessLevels: {
            public: userRoles.public | // 111
                userRoles.user |
                userRoles.admin,
            anon: userRoles.public, // 001
            user: userRoles.user | // 110
                userRoles.admin,
            admin: userRoles.admin // 100
        },
        apiUrl: 'http://localhost:3000',
        roleDisplayName: function (id) {
            return userRolesDisplayName[id];
        }
    });
    
})();