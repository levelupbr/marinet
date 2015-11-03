'use strict';

function account(app, config, queries, commands, passport) {
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
        }

        commands.createUser.execute(user)
            .then(function (user) {
                res.status(201).json(user);
            }).catch(function (err) {
                res.status(503).json({
                    error: "error",
                    reason: message(err.message)
                });
            });
    });
}

module.exports = account;
