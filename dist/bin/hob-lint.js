#!/usr/bin/env node
"use strict";

var _minimist = _interopRequireDefault(require("minimist"));

var _fs = require("fs");

var _projectDir = _interopRequireDefault(require("../lib/project-dir"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var argv = (0, _minimist.default)(process.argv.slice(2), {
  alias: {
    h: 'help'
  },
  boolean: ['h']
});

if (argv.help) {
  console.log("\n    Description\n      Runs lints\n    Usage\n      $ hob lint\n\n    This will run default lints, with Hob settings\n    You can add a custom .eslintrc, .eslintignore, or .jscsrc\n    to the root of your project if you want specific config\n  ");
  process.exit(0);
}

var hobConf = (0, _fs.resolve)(__dirname, '../', 'conf');
var projectEslintrc = (0, _fs.resolve)(_projectDir.default, '.eslintrc');
var eslintrc = (0, _fs.existsSync)(projectEslintrc) ? projectEslintrc : (0, _fs.resolve)(hobConf, '.eslintrc');
var projectEslintignore = (0, _fs.resolve)(_projectDir.default, '.eslintignore');
var eslintignore = (0, _fs.existsSync)(projectEslintignore) ? projectEslintignore : (0, _fs.resolve)(hobConf, '.eslintignore');
startProcess({
  command: 'eslint',
  args: [_projectDir.default, '-c', eslintrc, '--ignore-path', eslintignore, '--quiet']
});
var projectJscsrc = (0, _fs.resolve)(_projectDir.default, '.jscsrc');
var jscsrc = (0, _fs.existsSync)(projectJscsrc) ? projectJscsrc : (0, _fs.resolve)(hobConf, '.jscsrc');
startProcess({
  command: 'jscs',
  args: [_projectDir.default, '-c', jscsrc]
});