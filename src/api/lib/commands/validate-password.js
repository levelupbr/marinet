'use strict';

const
    crypto = require('crypto');

module.exports = function () {

    return {
        'execute': function (password, user) {
            console.log('Validating password');
            let hash = crypto.createHash('sha512').update(password).digest("hex");

            return user.password == hash;
        }
    }
}
