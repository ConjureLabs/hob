"use strict";

var _crossSpawn = require("cross-spawn");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

module.exports = function startProcess(_ref) {
  var _ref$command = _ref.command,
      command = _ref$command === void 0 ? 'node' : _ref$command,
      _ref$shell = _ref.shell,
      shell = _ref$shell === void 0 ? false : _ref$shell,
      _ref$args = _ref.args,
      args = _ref$args === void 0 ? [] : _ref$args,
      _ref$env = _ref.env,
      env = _ref$env === void 0 ? {} : _ref$env;
  var proc = (0, _crossSpawn.spawn)(command, args, {
    stdio: 'inherit',
    cwd: __dirname,
    env: _objectSpread({}, process.env, {
      env: env
    }),
    shell: shell
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