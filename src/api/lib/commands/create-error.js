'use strict';

const
    crypto = require('crypto');

module.exports = function (Models, Q) {

    return {
        'execute': function (data, app) {
            console.log('creating error', data);
            
            let create = function()
            {
                let error = new Models.Error(data);
                error.appName = app.name;
                error.accountId = app.accountId;
                error.solved = false;
                error.hash = hash;
                return error;
            }
               
            let defered = Q.defer();
            let hash = crypto.createHash('md5').update(JSON.stringify(data.message + data.exception + app.name)).digest("hex");

            Models.Error.findOne({hash: hash, hardwareId: data.hardwareId}).exec(function(err, error){
                
                if (err) return defered.reject(err);
                if ( ! error ) error = create();
                
                error.occurrences.push(new Date());

                error.save(function (err, error) {
                    if (err) defered.reject(err);
                    defered.resolve(error);
                });
            });

            Models.Error.update({
                hash: hash
            }, {
                solved: false
            }, {
                multi: true
            }).exec(function (err, numberAffected, raw) {
                console.log("Error with hash %s unsolved", hash);
            });

            return defered.promise;
        }
    }
}
