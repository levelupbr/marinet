'use strict';

const
    crypto = require('crypto'),
    shortId = require('shortid');

module.exports = function (promise, Q) {

    return {
        'execute': function (accountId, app) {
            let defered = Q.defer();

            promise.then(function (db) {
                db.get(accountId, function (err, body) {
                    let account = body;
                    console.log(account);
                    if (err) defered.reject(err);

                    app.id = shortId.generate();
                    app.key = crypto.createHash('sha256').update(app.id).digest("hex");

                    account.apps.push(app);

                    db.insert(account, accountId, function (err2, body2) {
                        if (err2) defered.reject(err2);

                        defered.resolve(app);
                    });
                });
            });

            return defered.promise;
        }
    }
}