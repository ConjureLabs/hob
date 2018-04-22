"use strict";

var _require = require('cross-spawn'),
    spawn = _require.spawn;

module.exports = function startProcess(_ref) {
  var _ref$command = _ref.command,
      command = _ref$command === void 0 ? 'node' : _ref$command,
      _ref$args = _ref.args,
      args = _ref$args === void 0 ? [] : _ref$args;
  var proc = spawn(command, args, {
    stdio: 'inherit'
  });
  proc.on('close', function (code, signal) {
    if (code !== null) {
      process.exit(code);
    }

    if (signal) {
      if (signal === 'SIGKILL') {
        process.exit(137);
      }

      console.log("got signal ".concat(signal, ", exiting"));
      process.exit(1);
    }

    process.exit(0);
  });
  proc.on('error', function (err) {
    console.error(err);
    process.exit(1);
  });
  return proc;
};