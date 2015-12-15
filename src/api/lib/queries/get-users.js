'use strict';

module.exports = function (Models, Q) {
    return {
        'execute': function () {
            let defered = Q.defer();
            
            let criteria = {
                find: {}, //means all
                filter: {password:0,roles:0,providers:0} //not insterested in these
            };
            
            Models.User.find(criteria.find, criteria.filter)
                .exec(function (err, user) {
                    if (err) defered.reject(err);
                    defered.resolve(user);
                });

            return defered.promise;
        }
    }
}