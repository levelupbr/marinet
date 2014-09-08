'use strict';

module.exports = function (Models, Q) {
    return {
        'execute': function (filter, page) {
            let defered = Q.defer();
            let match = {
                $match: {
                    appName: {
                        $eq: filter.appName
                    },
                    solved: {
                        $eq: filter.solved
                    }
                }
            };
            if (filter.query) {
                match.$match.$text = {
                    $search: filter.query,
                    $language: "en"
                }
            }
            //TODO: Use elastic search!
            let query = Models.Error.aggregate([
                match,
                {
                    $group: {
                        _id: {
                            hash: "$hash",
                            appName: "$appName"
                        },
                        hash: {
                            $last: "$hash"
                        },
                        message: {
                            $last: "$message"
                        },
                        exception: {
                            $last: "$exception"
                        },
                        createdAt: {
                            $last: "$createdAt"
                        },
                        solved: {
                            $last: "$solved"
                        },
                        count: {
                            $sum: 1
                        }
                    }
                },
                {
                    $sort: {
                        createdAt: filter.sort
                    }
                },
            ]);


            Models.Error.aggregate([match, {
                $group: {
                    _id: {
                        hash: "$hash",
                        appName: "$appName"
                    }
                }
                }]).exec(function (err, res) {

                if (err) defered.reject(err);
                let total = res.length;
                query.skip(((page || 1) - 1) * 25).limit(25).exec(function (err, errors) {
                    if (err) defered.reject(err);
                    if (errors) defered.resolve({
                        currentPage: page++,
                        sugestions: [],
                        totalPages: Math.ceil(total / 25),
                        totalSize: total,
                        data: errors,
                        sort: filter.sort
                    });
                });
            });

            return defered.promise;
        }
    }
}
