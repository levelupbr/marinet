"use strict";

module.exports = function (mongoose) {
    let provider = mongoose.Schema({
        name: String,
        token: String,
    });



    let schema = mongoose.Schema({
        name: { type: String, unique: true },
        password: String,
        email: { type: String, unique: true },
        accountId: String,
        accountName: String,
        roles: [String],
        providers: [provider],
    });

    schema.methods.addRole = function (role) {
        this.roles.push(role);
    };

    return mongoose.model('User', schema);
}
