"use strict";

var _path = require("path");

var _fs = require("fs");

var _config = _interopRequireDefault(require("../../../.hob/config.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var projectDir = path.resolve(__dirname, '../../../');

module.exports = function generateClientConfig() {
  if (!_config.default.serverConfigRequire) {
    throw new Error('Hob expects serverConfigRequire (in .hob/config.js) to be a require path for a full server config');
  }

  var fullConfig = require("".concat(_config.default.serverConfigRequire)); // each value in clientConfigKeys is expected to be dot-notated


  var clientConfig = _config.default.clientConfigKeys.reduce(function (config, dotNotation) {
    dotNotation = dotNotation.trim();

    if (!dotNotation) {
      return config;
    }

    var tokens = dotNotation.split('.');
    var ref = fullConfig;

    for (var i = 0; i < tokens.length; i++) {
      if (ref == undefined) {
        if (i === 0) {
          // should not be possible since full config is expected to be okay
          throw new Error('full config does not appear to be an object');
        }

        throw new Error("client config requires ".concat(tokens.slice(0, i + 1).join('.'), ", but ").concat(tokens.slice(0, i).join('.'), " is null or undefined"));
      }

      var token = tokens[i];
      ref = ref[token];
      config[token] = i === tokens.length - 1 ? ref : {};
      return config;
    }
  }, {});

  var configContent = "/* eslint-disable */\n// jscs:disable\n\nexport default ".concat(JSON.stringify(clientConfig), "\n");
  fs.writeFileSync(path.resolve(projectDir, 'client-config.js'), configContent, 'utf8');
  console.log('Generated client config');
};