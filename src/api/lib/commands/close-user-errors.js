'use strict';

module.exports = function (Models, Q) {

    return {
        'execute': function (data, app) {

            console.log('closing errors', data);

            let defered = Q.defer();

            Models.Error.update({
              appName: app.name, hardwareId: data.hardwareId
            }, {
                solved: true,
                autoClosed: true
            }, {
                multi: true
            }).exec(function (err, numberAffected, raw) {
              if (err) defered.reject(err);
              defered.resolve(numberAffected);
            });

            return defered.promise;
        }
    }
}
