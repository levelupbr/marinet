'use strict';
const async = require('async');

module.exports = function (Models, Q) {

    return {
        'execute': function (id) {
            let defered = Q.defer();
            async.waterfall([

                function (next) {
                    let account = new Models.Account({
                        name: 'System',
                        status: 1
                    });

                    account.save(next);
            },
                function (account, rows, next) {

                    let admin = new Models.User({
                        name: 'admin',
                        email: 'admin@marinet.me',
                        password: '06b2e4ac9354ffed62f0fdbbc18d9799d447141877750cd8551721ec8632784e5f2a15ca37c4f1bc1b3647daddbea12cdf6a5eab73aa3e14c9164b3e9a9cedc9',
                    });
                    account.addUser(admin);
                    admin.addRole("admin");
                    admin.save(function (err) {
                        if (err) next(err);
                        next(null, account);
                    });

            },
                function (account, next) {
                    let app = new Models.App({
                        _id: '540a26f033026ce20a07ec33',
                        key: 'ac0c0afe317621c1dfae6645bcf7d855b9ecf40f1162952ee3676edbba79f80b',
                        name: 'marinet'
                    });
                    account.addApp(app);
                    app.save(function (err) {
                        if (err) next(err);
                        defered.resolve(account);
                        next;
                    });
            }], function (err) {
                defered.reject(err);
            });
            return defered.promise;
        }
    }
}
