'use strict';

module.exports = function (Models, Q) {
    return {
        'execute': function (appName) {
            let defered = Q.defer();
            let match = {
                $match: {
                    appName: {
                        $eq: appName
                    },
                    solved: {
                        $eq: false
                    }
                }
            };
            
            //TODO: Use elastic search!
            let query = Models.Error.aggregate([
                match,
                {
                    $group: {
                        _id: {
                            appName: "$appName",
                            hash: "$hash"
                        }
                    }
                }
            ]);

            query.exec(function (err, errors) {
                if (err) return defered.reject(err);
                
                defered.resolve({
                    count: errors.length
                })
            });

            return defered.promise;
        }
    }
}
