'use strict';

function account(app, config, queries, commands, authed, passport) {
    app.get('/account/apps', authed, function (req, res) {
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

    app.post('/account/app', authed, function (req, res) {
        let
            app = req.body,
            accountId = req.user.accountId;

        commands.createApp.execute(accountId, app)
            .then(function (errors) {
                res.json(errors)
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
                'username': req.user.id,
                'role': req.user.role
            });
        });

    app.delete('/logout', authed, function (req, res) {
        req.logout();
        res.status(200).json({
            message: 'OK'
        });
    });

    app.get('/user', function (req, res) {
        if (req.user)
            res.json({
                'username': req.user.id,
                'role': req.user.role
            });
        else
            res.status(403).json({
                error: "forbidden",
                reason: "not_authenticated"
            });
    });
}

module.exports = account;
