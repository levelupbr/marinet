'use strict';

function application(app, queries) {
    app.get('/account/users', function (req, res) {
        queries.getUsers.execute()
            .then(function (body) {
                res.status(200)
                    .json(body);
            }).catch(function (err) {
                res.json(502, {
                    error: "bad_gateway",
                    reason: err.message
                });
            });
    });
}

module.exports = application;
