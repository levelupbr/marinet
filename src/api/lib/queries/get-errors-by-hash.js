'use strict';

module.exports = function (Models, Q) {
    return {
        'execute': function (appName, hash) {
            console.log(appName);
            console.log(hash);
            let defered = Q.defer();
            Models.Error.find()
                .where('hash').equals(hash)
                .where('appName').equals(appName)
                .exec(function (err, errors) {
                    if (err) defered.reject(err);
                    if (!errors) defered.reject({
                        message: 'Not found'
                    });
                    else {
                        errors.sort(function(error) {
                            return error.solved ? -1 : 1;
                        });
                        let error = errors[errors.length - 1];
                        error.others = [];
                        for (let i = 0; i < errors.length; i++) {
                            let item = errors[i];
                            error.others.push({ key: item._id, createdAt: item.createdAt, solved: item.solved });
                        }
                        error.selected = error._id;

                        if(error.hasOwnProperty('solvedAt') && error.hasOwnProperty('reopensAt')){
                            if(error.solvedAt < error.reopensAt)
                                error.set('reopen',true);
                            else
                                error.set('reopen',false);                                                        
                        }else{
                            if(!error.autoClosed && !error.solved)
                                error.set('reopen',true);
                            else
                                error.set('reopen',false);
                        }

                        defered.resolve(error);
                    }
                });

            return defered.promise;
        }
    }
}
