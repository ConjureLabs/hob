"use strict";

var _path = require("path");

// assuming ./lib/project-dir.js is copied to ./dist/lib/project-dir.js
// and hob is then installed in an app's node_modules
// ./node_modules/hob/dist/lib/project-dir.js
// project dir is 4 dirs up
module.exports = (0, _path.resolve)(__dirname, '../../../../');