"use strict";
const
    FS = require('fs'),
    Path = require('path'),
    parent = module.parent,
    parentFile = parent.filename,
    parentDir = Path.dirname(parentFile);

let dir = '/models',
    files = FS.readdirSync(__dirname + dir),
    map = {};

module.exports = function (mongoose) {
    String.prototype.capitalize = function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }

    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        let ext = Path.extname(file);
        let base = Path.basename(file, ext).capitalize();
        let path = Path.resolve(__dirname + dir, file);
        map[base] = require(path)(mongoose);
    };

    return map;
};
