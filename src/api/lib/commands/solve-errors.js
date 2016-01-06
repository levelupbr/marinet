'use strict';

module.exports = function (Models, Q) {

    return {
        'execute': function (hash) {
            let defered = Q.defer();
            Models.Error.update({
                hash: hash
            }, {
                solved: true,
                reopen: true,
                solvedAt: new Date(),
                updatedAt: new Date(),
                //solvedDates.push(new Date()),
				$inc: {
					solveAttempts: 1
				}
            }, {
                multi: true
            }).exec(function (err, numberAffected, raw) {
                console.log("Updated %s docs", numberAffected);
                if (err) defered.reject(err);
                defered.resolve(raw);
            });

            return defered.promise;
        }
    }
}
