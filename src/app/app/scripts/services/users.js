'use strict';

angular.module('marinetApp')
    .factory('Users', ['$resource','ROUTING_CONFIG',
        function ($resource, ROUTING_CONFIG) {
            var d = new Date();
            var users = $resource(ROUTING_CONFIG.apiUrl + '/account/users', {
                cacheSlayer: d.getTime()
            });
            return {
                find: function () {
                    return users.query();
                }
            };
    }]);