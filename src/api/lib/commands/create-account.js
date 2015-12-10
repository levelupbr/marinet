'use strict';

module.exports = function (Models, Q) {

    return {
        'execute': function (data) {
        
            let defered = Q.defer();

            let account = new Models.Account(data);

            account.save(function (err, account) {
                if (err) defered.reject(err);
                else defered.resolve(account);
            });

            return defered.promise;
        }
    }
}
