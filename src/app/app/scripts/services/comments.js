'use strict';

/**
 * @ngdoc service
 * @name marinetApp.Comments
 * @description
 * # Comments
 * Factory in the marinetApp.
 */
angular.module('marinetApp')
    .factory('Comments', ['$resource', 'ROUTING_CONFIG',
        function ($resource, ROUTING_CONFIG) {
            var d = new Date();
            var comments = $resource(ROUTING_CONFIG.apiUrl + '/comments/:hash', {
                cacheSlayer: d.getTime()
            }, {
                'comment': {
                    method: 'POST',
                    url: ROUTING_CONFIG.apiUrl + '/comment'
                }
            });
            return {
                query: function (hash) {
                    return comments.query({
                        hash: hash
                    });
                },
                comment: function (data) {
                    return comments.comment(data).$promise;
                }
            };
    }]);