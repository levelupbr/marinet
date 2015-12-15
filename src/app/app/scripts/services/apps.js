'use strict';

angular.module('marinetApp')
    .factory('Apps', ['$resource','ROUTING_CONFIG',
        function ($resource, ROUTING_CONFIG) {
            var d = new Date();
            var apps = $resource(ROUTING_CONFIG.apiUrl + '/account/apps', {
                cacheSlayer: d.getTime()
            }, {
                purge: {
                    method: 'DELETE',
                    url: ROUTING_CONFIG.apiUrl + '/account/:appName/Purge'
                },
                save: {
                    method: 'POST',
                    url: ROUTING_CONFIG.apiUrl + '/account/app'
                },
                update: {
                    method: 'PUT',
                    url: ROUTING_CONFIG.apiUrl + '/account/app'
                },
                owned: {
                    method: 'GET',
                    url: ROUTING_CONFIG.apiUrl + '/account/apps/owned',
                    isArray: true
                }
            });
            return {
                find: function () {
                    return apps.query();
                },
                getOwn: function () {
                    return apps.owned().$promise;
                },
                save: function (obj) {
                    return apps.save(obj).$promise;
                },
                update: function (obj) {
                    return apps.update(obj).$promise;
                },
                purge: function (appName) {
                    return apps.purge({
                        appName: appName
                    }).$promise;
                }
            };
    }]);