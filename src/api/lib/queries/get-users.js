'use strict';

module.exports = function (Models, Q) {
    return {
        'execute': function () {
            let defered = Q.defer();
            Models.User.find()
                .exec(function (err, user) {
                    if (err) defered.reject(err);
                    defered.resolve(user);
                });

            return defered.promise;
        }
    }
}
