'use strict';

const
    crypto = require('crypto');

module.exports = function (Models, Q) {

    return {
        'execute': function (data) {
            let defered = Q.defer();

            let user = new Models.User(data);
            
            let hash = crypto.createHash('sha512').update(data.password).digest("hex");
            user.password = hash;

            user.save(function (err, user) {
                if (err) defered.reject(err);
                else defered.resolve(user);
            });

            return defered.promise;
        }
    }
}
