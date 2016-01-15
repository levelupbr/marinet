'use strict';

module.exports = function (Models, Q) {

    return {
        'execute': function (id) {
            let defered = Q.defer();
            Models.Error.findById(id)
                .exec(function (err, data) {
                    if (err) defered.reject(err);

                        if(data.hasOwnProperty('solvedAt') && data.hasOwnProperty('reopensAt')){
                            if(data.solvedAt < data.reopensAt)
                                data.set('reopen',true);
                            else
                                data.set('reopen',false);                                                        
                        }else{
                            if(!data.autoClosed && !data.solved)
                                data.set('reopen',true);
                            else
                                data.set('reopen',false);
                        }

                    defered.resolve(data);
                });

            return defered.promise;
        }
    }
}
