"use strict";

module.exports = function (mongoose) {
    let schema = mongoose.Schema({
        key: String,
        name: String,
        accountId: String,
        allowed: Array,
        mute: {
            type: Boolean,
            default: false,
            index: true
        } 
    });

    return mongoose.model('App', schema);
}
