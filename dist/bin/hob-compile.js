#!/usr/bin/env node
"use strict";

var _minimist = _interopRequireDefault(require("minimist"));

var _path = require("path");

var _startProcess = _interopRequireDefault(require("../lib/start-process"));

var _generateClientConfig = _interopRequireDefault(require("../lib/config/generate-client-config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var argv = (0, _minimist.default)(process.argv.slice(2), {
  alias: {
    h: 'help'
  },
  boolean: ['h']
});

if (argv.help) {
  console.log("\n    Description\n      Compiles the application\n    Usage\n      $ hob build\n\n    Options\n      --fresh, -f   Removes cache before compile\n      --min, -m     Use short CSS class names\n  ");
  process.exit(0);
}

var stylusArgs = ['../procs/stylus/prepare'];

if (argv.fresh) {
  stylusArgs.push('--fresh');
}

if (argv.min) {
  stylusArgs.push('--short-names');
}

(0, _startProcess.default)({
  args: stylusArgs
});
(0, _generateClientConfig.default)();