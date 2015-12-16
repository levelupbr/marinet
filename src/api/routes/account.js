'use strict';

function account(app, config, queries, commands, passport, errorStatus) {
    app.get('/account/apps', function (req, res) {
        queries.getAccountApps.execute(req.user.accountId)
            .then(function (apps) {
                res.json(apps);
            }).catch(function (err) {
                res.status(503).json({
                    error: "bad_gateway",
                    reason: err.message
                });
            });
    });
    
    app.get('/account/apps/owned', function (req, res) {
        queries.getAccountApps.execute(req.user.accountId, true)
            .then(function (apps) {
                res.json(apps);
            }).catch(function (err) {
                let status = errorStatus[err.errorType] || errorStatus["DEFAULT"];
                res.status(status.code).json({
                    error: status.error,
                    reason: err.message || status.reason
                });
            });
    });

    app.post('/account/app', function (req, res) {
        let
            app = req.body,
            accountId = req.user.accountId;

        commands.createApp.execute(accountId, app)
            .then(function (app) {
                res.status(201).json(app);
            }).catch(function (err) {
                res.status(503).json({
                    error: "bad_gateway",
                    reason: err.message
                });
            });
    });
    
    app.put('/account/app', function (req, res) {
        let
            app = req.body,
            accountId = req.user.accountId;

        commands.updateApp.allowedUsers(accountId, app)
            .then(function (app) {
                res.status(201).json(app);
            }).catch(function (err) {console.log(errorStatus);
                let status = errorStatus[err.errorType] || errorStatus["DEFAULT"];
                res.status(status.code).json({
                    error: status.error,
                    reason: err.message || status.reason
                });
            });
    });

    app.post('/login',
        passport.authenticate('local'),
        function (req, res) {
            res.json({
                'username': req.user.name,
                'role': req.user.roles[0],
                'accountName': req.user.accountName,
                'email': req.user.email,
            });
        });

    app.delete('/logout', function (req, res) {
        req.logout();
        res.status(204).json({
            message: 'OK'
        });
    });

    app.get('/user/me', function (req, res) {
        res.json({
            'username': req.user.name,
            'role': req.user.roles[0],
            'accountName': req.user.accountName,
            'email': req.user.email,
        });
    });
    
    app.post('/user', function (req, res) {

        let user = req.body;
        
        let message = function(msg) {
        
            if ( msg.indexOf('$name') !== -1 )
                return 'duplicated username';
                
            if ( msg.indexOf('$email') !== -1 )
                return 'duplicated email';
                
            return msg;
        };
        
        let error = function (err) {
                res.status(503).json(
                    {
                        error: "error",
                        reason: message(err.message)
                    }
                );
            };
        
        let namesAux = {
            account: user.accountName,
            user: user.name
        };
        
        user.name = namesAux.account;
        
        commands.createAccount.execute(user)
                .then(function(account){
                    user.accountId = account._id;
                    user.name = namesAux.user;
                    commands.createUser.execute(user)
                    .then(
                        function (user) {
                            res.status(201).json(user);
                        }
                    ).catch(
                        function(err){
                            commands.createAccount.remove(account).then(error).catch(error);
                        }
                    );
                }).catch(error);
       });
       
}
    
module.exports = account;
