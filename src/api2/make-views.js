'use strict';
const
    async = require('async'),
    request = require('request'),
    views = require('./setup/views.js');
async.waterfall([
 // get the existing design doc (if present)
function (next) {
        request.get('http://162.243.118.8:5984/marinetdb/_design/marinet', next);
},
 // create a new design doc or use existing
function (res, body, next) {
        if (res.statusCode === 200) {
            next(null, JSON.parse(body));
        } else if (res.statusCode === 404) {
            next(null, {
                language: 'javascript',
                views: {}
            });
        }
},
 // add views to document and submit
function (doc, next) {
        Object.keys(views).forEach(function (name) {
            doc.views[name] = views[name];
        });
        request({
            method: 'PUT',
            url: 'http://162.243.118.8:5984/marinetdb/_design/marinet',
            json: doc
        }, next);
}
], function (err, res, body) {
    if (err) {
        throw err;
    }
    console.log(res.statusCode, body);
});