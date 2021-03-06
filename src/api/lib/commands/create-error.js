'use strict';

const
    crypto = require('crypto');

module.exports = function (Models, Q) {

    return {
        'execute': function (data, app) {
            console.log('creating error', data);

            let create = function() {
                let error = new Models.Error(data);
                error.appName = app.name;
                error.accountId = app.accountId;
                error.solved = false;
                error.hash = hash;
                return error;
            }

            let defered = Q.defer();
            if(app.mute){
                 defered.reject('Create/Update Errors is not allowed for this app.');
                 return defered.promise;
            }

            let hash = crypto.createHash('md5').update(JSON.stringify(data.message + data.exception + app.name)).digest("hex");

            Models.Error.findOne({hash: hash, ignore: true}).exec(function(err, ignored) {

                if (err || ignored) 
                    return defered.reject(err||"Ingored error");

                if ( ! data.hardwareId )
                    data.hardwareId = 'not_sent';

                
                // Create/Update error by user (aka: hardwareid)
                let occurrence = new Date();
                Models.Error.findOne({hash: hash, hardwareId: data.hardwareId}).exec(function(err, error){
                    if (err) 
                        return defered.reject(err);
                    
                    if ( ! error )
                        error = create();
                    error.occurrences.push(occurrence);
                    error.autoClosed = false;

                    error.save(function (err, error) {
                        if (err) defered.reject(err);
                        defered.resolve(error);
                    });
                });

                // Update all errors
                Models.Error.update({
                    hash: hash,
                    autoClosed: false
                }, {
                    solved: false,
                    reopensAt: occurrence,
                    $push: { reopenHist: occurrence } 
                }, {
                    multi: true
                }).exec(function (err, numberAffected, raw) {
                    console.log("Error with hash %s unsolved", hash);
                });
            });

            return defered.promise;
        }
    }
}
