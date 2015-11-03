'use strict';

angular.module('marinetApp')
    .factory('Errors', ['$resource', 'ROUTING_CONFIG',
        function ($resource, ROUTING_CONFIG) {
            var d = new Date();
            var errors = $resource(ROUTING_CONFIG.apiUrl + '/:appName/error/:hash', {
                cacheSlayer: d.getTime()
            }, {
                'find': {
                    url: ROUTING_CONFIG.apiUrl + '/:appName/errors'
                },
                'findOne': {
                    url: ROUTING_CONFIG.apiUrl + '/error/:hash/:id'
                },
                'solve': {
                    method: 'PUT',
                    params: {
                        hash: '@hash'
                    }
                },
                purge: {
                    method: 'DELETE',
                    url: ROUTING_CONFIG.apiUrl + '/:appName/errors'
                }
            });
            return {
                query: function (filter, success, error) {
                    return errors.find({
                            appName: filter.appName,
                            page: filter.page,
                            q: filter.query,
                            solved: filter.solved,
                            sort: filter.sort,
                            cacheSlayer: d.getTime()
                        },
                        success,
                        error);
                },
                get: function (hash, appName, success) {
                    return errors.get({
                        hash: hash,
                        appName: appName
                    }, success);
                },
                getById: function (hash, id, success, error) {
                    return errors.findOne({
                            hash: hash,
                            id: id
                        },
                        success,
                        error);
                },
                solve: function (hash, appName) {
                    return errors.solve({
                        hash: hash,
                        appName: appName
                    }).$promise;
                },
                purge: function(appName) {
                    return errors.purge({
                        appName: appName
                    }).$promise;
                }
            };
    }]);
