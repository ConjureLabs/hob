"use strict";

var _crossSpawn = require("cross-spawn");

/*
  Starts a process spawn
  If no onClose handler set, this will process.exit()
  If an onClose is set, it will return code, and not exit
 */
module.exports = function startProcess(_ref, onClose) {
  var _ref$command = _ref.command,
      command = _ref$command === void 0 ? 'node' : _ref$command,
      _ref$args = _ref.args,
      args = _ref$args === void 0 ? [] : _ref$args,
      _ref$cwd = _ref.cwd,
      cwd = _ref$cwd === void 0 ? __dirname : _ref$cwd;
  onClose = typeof onClose === 'function' ? onClose : function (code) {
    process.exit(code);
  };
  var proc = (0, _crossSpawn.spawn)(command, args, {
    stdio: 'inherit',
    cwd: cwd
  });
  proc.on('close', function (code, signal) {
    if (code !== null) {
      return onClose(code);
    }

    if (signal) {
      if (signal === 'SIGKILL') {
        return onClose(137);
      }

      console.log("got signal ".concat(signal, ", exiting"));
      return onClose(1);
    }

    return onClose(0);
  });
  proc.on('error', function (err) {
    console.error(err);
    return onClose(1);
  });
  return proc;
};