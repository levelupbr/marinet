'use strict'

module.exports = function(Models, Q){
    return {
        'allowedUsers': function(accountId, data){
            let defered = Q.defer();
            
            if (!data.id) defered.reject({message: "id is required to find an app"});
            
            Models.App.findById(data.id).exec(function(err, app){
                
                if (err) defered.reject(err);
                if (!app) return defered.reject({message: "App not found", errorType: "NOT_FOUND"});
                if (accountId != app.accountId) return defered.reject({message: "User is not the owner of this application.", errorType: "FORBIDDEN"});
                
                app.allowed = data.allowed;
                app.save();
                
                defered.resolve(app);
            });
            
            return defered.promise;
        }
    };
};