"use strict";

var _crossSpawn = require("cross-spawn");

module.exports = function startProcess(_ref, onClose) {
  var _ref$command = _ref.command,
      command = _ref$command === void 0 ? 'node' : _ref$command,
      _ref$args = _ref.args,
      args = _ref$args === void 0 ? [] : _ref$args,
      _ref$cwd = _ref.cwd,
      cwd = _ref$cwd === void 0 ? __dirname : _ref$cwd;

  onClose = onClose || function () {};

  var proc = (0, _crossSpawn.spawn)(command, args, {
    stdio: 'inherit',
    cwd: cwd
  });
  proc.on('close', function (code, signal) {
    if (code !== null) {
      process.exit(code);
    }

    if (signal) {
      if (signal === 'SIGKILL') {
        onClose(137);
        process.exit(137);
      }

      console.log("got signal ".concat(signal, ", exiting"));
      onClose(1);
      process.exit(1);
    }

    onClose(0);
    process.exit(0);
  });
  proc.on('error', function (err) {
    console.error(err);
    onClose(1);
    process.exit(1);
  });
  return proc;
};