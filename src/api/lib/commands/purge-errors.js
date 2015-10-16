'use strict';

module.exports = function (Models, Q) {

    return {
        'execute': function (appName) {
            console.log('Purging errors to app ', appName);
            
            let defered = Q.defer();
            Models.Error.remove({
                appName: appName
            }, function (err) {
                if (err) defered.reject(err);
                defered.resolve(true);
            });
            return defered.promise;
        }
    }
}