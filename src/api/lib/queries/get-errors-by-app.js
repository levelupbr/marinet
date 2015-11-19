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
                        },
                        count: {
                            $sum: 1
                        }
                    }
                }
            ]);

            query.exec(function (err, errors) {
                if (err) return defered.reject(err);
                
                let count = errors.reduce(function(previousValue, error) {
                    return previousValue + error.count;
                }, 0);
                
                defered.resolve({
                    count: count
                })
            });

            return defered.promise;
        }
    }
}
