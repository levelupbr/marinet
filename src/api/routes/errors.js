'use strict';

function errors(app, queries, commands, publisher, moment) {

    app.get('/:appName/errors', function (req, res) {
        queries.searchErrors
            .execute({
                query: req.query.q,
                appName: req.params.appName,
                solved: req.query.solved ? true : false,
                sort: req.query.sort === 'asc' ? 1 : -1,
            }, req.query.page)
            .then(function (errors) {
                res.json(errors);
            }).catch(function (err) {
                require('../lib/marinet-handler')(err, req, res, function (err) {
                    res.status(500).json(err);
                });
            })
            .done();
    });
    
    app.delete('/:appName/errors', function (req, res) {
        commands.purgeErrors.execute(req.params.appName)
            .then(function () {
                res.sendStatus(204);
            }).catch(function (err) {
                require('../lib/marinet-handler')(err, req, res, function (err) {
                    res.status(500).json(err);
                });
            })
            .done();
    });
    
    app.get('/:appName/errors/by-hardware-id', function (req, res) {
        queries.getErrorsByHardwareId.execute(req.params.appName)
            .then(function (errors) {
                res.json(errors);
            }).catch(function (err) {
                require('../lib/marinet-handler')(err, req, res, function (err) {
                    res.status(500).json(err);
                });
            })
            .done();
    });
    
    
    app.get('/:appName/errors/count', function (req, res) {
        queries.getErrorsByApp.execute(req.params.appName)
            .then(function (errors) {
                res.json(errors);
            }).catch(function (err) {
                require('../lib/marinet-handler')(err, req, res, function (err) {
                    res.status(500).json(err);
                });
            })
            .done();
    });
    
    app.post('/error', function (req, res) {
        let error = req.body;
        
        publisher.send(JSON.stringify({
            type: 'newerror',
            error: error,
            app: {
                id: req.headers["marinet-appid"],
                key: req.headers["marinet-appkey"]
            },
            date: Date.now()
        }));

        res.status(201).json({
            'message': 'queued'
        });

    });

    
    app.get('/:appName/error/:hash', function (req, res) {

        queries.getErrorsByHash
            .execute(req.params.appName, req.params.hash)
            .then(function (error) {
                let fields = [],
                    restrictions = ['_id', '_rev', 'appName', 'count', 'exception', 'keys', 'message', 'solved', 'type', 'selected'];

                Object.keys(error).forEach(function (key) {
                    if (restrictions.indexOf(key) === -1)
                        fields.push({
                            name: key,
                            val: error[key]
                        });
                });

                error.fields = fields;
                res.json(error);
            }).catch(function (err) {
                res.json(err);
            }).done();
    });

    app.get('/error/:hash/:id', function (req, res) {

        queries.getErrorsById
            .execute(req.params.id)
            .then(function (error) {
                res.json(error);
            }).catch(function (err) {
                res.json(err);
            }).done();
    });

    app.put('/error/:hash', function (req, res) {
        commands.solveErrors
            .execute(req.params.hash)
            .then(function (result) {
                commands.createComment.execute({message:"Solved on: " + moment().format('YYYY-MM-DD HH:mm:ss'), errorHash:req.params.hash}, req.user);
                res.status(200).json('Solved');
            })
            .catch(function (err) {
                res.json(err);
            }).done();
    });

    app.get('/error/throw', function (req, res) {
        throw new Error("Error test! Try to catch this!");
    });
}

module.exports = errors;
