'use strict';

module.exports = function (Models, Q) {

    return {
        'execute': function (hash, ignore) {
            let defered = Q.defer();
            Models.Error.update({
                hash: hash
            }, {
                ignore: ignore,
            }, {
                multi: true
            }).exec(function (err, numberAffected, raw) {
                console.log("Updated %s docs", numberAffected);
                if (err)
                    defered.reject(err);
                defered.resolve(raw);
            });

            return defered.promise;
        }
    }
}
