'use strict';

module.exports = function (Models, Q) {

    return {
        'execute': function (name, value) {

            let defered = Q.defer();
            Models.App.update({
              name: name
            }, {
                 mute: value
            }).exec(function (err) {
                if (err) defered.reject(err);
                    defered.resolve(true);
            });

            return defered.promise;
        }
    }
}
