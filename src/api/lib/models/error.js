"use strict";
const textSearch = require("mongoose-text-search");

module.exports = function (mongoose) {
    let schema = mongoose.Schema({
        hash: {
            type: String,
            index: true
        },
        message: String,
        exception: String,
        currentUser: String,
        createdAt: { type: Date, default: Date.now },
        reopensAt: { type: Date },
        solvedAt: { type: Date },
        solved: {
            type: Boolean,
            index: true
        },
        ignore: {
            type: Boolean,
            index: true,
            default: false
        },
        autoClosed: {
            type: Boolean,
            default: false,
            index: true
        },
        appName: {
            type: String,
            index: true
        },
        accountId: {
            type: String,
            index: true
        },
        hardwareId: {
            type: String,
            index: true
        },
		solveAttempts: {
			type: Number,
			default: 0,
			index: true
		},
        selected: String,
        diagnostic: String,
        others: [{}],
        occurrences: [{}],
        solvedHist: [{}],
        reopenHist: [{}],
    }, {
        strict: false
    });


    schema.plugin(textSearch);
    schema.index({
        message: "text",
        exception: "text",
        hardwareId: "text"
    });

    return mongoose.model('Error', schema);
}
