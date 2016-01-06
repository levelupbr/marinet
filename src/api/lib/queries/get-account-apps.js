'use strict';

module.exports = function (Models, Q) {
    return {
        'execute': function (accountId, onlyOwned) {
            let defered = Q.defer();

            var criteria = onlyOwned ? {accountId: accountId} : {
                $or: [
                    {
                        accountId: accountId
                    },
                    {
                        allowed: {
                                $in: [accountId]
                        }
                    }
                ]
            };

            Models.App.find(criteria)			
                .exec(function (err, apps) {
                    if (err) defered.reject(err);
                    if (apps) {
                        let names = [];

                        for (let i = 0; i < apps.length; i++) {
                            names.push(apps[i].name);
                        }

                        Models.Error.aggregate([{
                            $match: {
                                appName: {
                                    $in: names
                                },
                                accountId: accountId
                            }
                            }, {
                            $project: {
                                accountId: '$accountId',
                                appName: '$appName',
                                hash: '$hash',
                                allowed: '$allowed',
                                open: {

                                    $cond: {
                                        if :{
                                            $eq: ["$solved", false]
                                        }, then: 1,
                                        else :0
                                    }
                                }
                            }
                            }, {
                            $group: {
                                _id: {
                                    accountId: '$accountId',
                                    appName: '$appName',
                                    hash: '$hash',
                                    allowed: '$allowed',
                                    open: '$open'
                                },
                                count: {
                                    $sum: 1
                                }                                
                            }
                            }]).exec(function (err, result) {
                            if (err) defered.reject(err);
                            else if (!result) defered.resolve([]);
                            else {
                                let values = [];

                                for (let i = 0; i < apps.length; i++) {
                                    values.push({
                                        name: apps[i].name,
                                        id: apps[i]._id,
                                        key: apps[i].key,
                                        errors: 0,
                                        openErrors: 0,
                                        allowed: apps[i].allowed,
                                        mute: apps[i].mute
                                    });
                                }

                                var hashes = [];

                                values.forEach(
                                        function(value){
                                                result.forEach(
                                                        function(element){
                                                                if (element._id.appName === value.name){
                                                                        if (hashes.indexOf(element._id.hash) === -1){
                                                                                hashes.push(element._id.hash);
                                                                                value.errors++;
                                                                                value.openErrors += element._id.open;
                                                                        }
                                                                }
                                                        }
                                                );
                                        }
                                );

                                defered.resolve(values);
                            }
                        });
                    } else defered.resolve([]);
                });
            return defered.promise;
        }
    }
}
