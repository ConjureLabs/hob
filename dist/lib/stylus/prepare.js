"use strict";

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _stylus = _interopRequireDefault(require("stylus"));

var _crypto = _interopRequireDefault(require("crypto"));

var _rimraf = _interopRequireDefault(require("rimraf"));

var _util = require("util");

var _projectDir = _interopRequireDefault(require("../project-dir"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

var rmSync = (0, _util.promisify)(_rimraf.default);
var subDirsToCrawl = ['components', 'pages'];

var trackDir = _path.default.resolve(_projectDir.default, '.hob', '.stylus');

var trackJson = _path.default.resolve(trackDir, 'track.json');

var classNameCount = 0;

function crawlDir(dirCrawling, options) {
  var list = _fs.default.readdirSync(dirCrawling);

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = list[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var resource = _step.value;

      var pathResolved = _path.default.resolve(dirCrawling, resource);

      var fileStat = _fs.default.statSync(pathResolved);

      if (fileStat.isDirectory()) {
        crawlDir(pathResolved);
        continue;
      }

      if (fileStat.isFile() && resource.length > 5 && resource.substr(-5) === '.styl') {
        prepareStylus(pathResolved, options);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}

function prepareStylus(filePath, options) {
  // first check if it has already been generated
  var hashes = JSON.parse(_fs.default.readFileSync(trackJson, 'utf8'));

  var content = _fs.default.readFileSync(filePath, 'utf8');

  var currentHash = _crypto.default.createHash('sha256').update(content).digest('hex');

  if (hashes[filePath] && hashes[filePath] === currentHash) {
    return;
  }

  (0, _stylus.default)(content).set('filename', filePath).render(function (err, css) {
    if (err) {
      throw err;
    }

    var classLookup = {};

    var pathParsed = _path.default.parse(filePath);

    var pathTokens = pathParsed.dir.substr(_projectDir.default.length + 1).split('/'); // if a file is not the typical styles.styl (say, component.styles.styl), then we need to track that to avoid name collision

    if (pathParsed.base !== 'styles.styl') {
      pathTokens.push(pathParsed.name.replace(/\.+/g, '-'));
    } // see https://stackoverflow.com/questions/448981/which-characters-are-valid-in-css-class-names-selectors


    css = css.replace(/\.(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)(?=\s|\{|\.|:|,|\)|$])/g, function classnameReplacements(_, className) {
      if (!classLookup[className]) {
        if (options.shortNames) {
          classLookup[className] = "c".concat(++classNameCount);
        } else {
          classLookup[className] = "".concat(pathTokens.join('_'), "__").concat(className);
        }
      }

      return ".".concat(classLookup[className]);
    });
    css = css.replace(/[\n\r]\s*/g, ' ').trim();
    var isNative = filePath.substr(-12) === '.native.styl'; // native <style> tag, not jsx

    var jsxDefault = "const css = `".concat(css, "`\nexport default (<style ").concat(isNative ? '' : 'jsx ', "dangerouslySetInnerHTML={{ __html: css }} />)");
    var jsxLookup = "const classes = ".concat(JSON.stringify(classLookup), "\nexport { classes }");
    var jsxContent = "/* eslint-disable */\n// jscs:disable\n\nimport React from 'react'\n\n".concat(jsxDefault, "\n\n").concat(jsxLookup, "\n");
    var jsxFilePath = filePath.replace(/\.styl$/, '.js');

    _fs.default.writeFileSync(jsxFilePath, jsxContent, 'utf8');

    console.log("Generated ".concat(jsxFilePath));
    hashes = JSON.parse(_fs.default.readFileSync(trackJson, 'utf8')); // re-read it just to make sure it's up to date

    hashes[filePath] = currentHash;

    _fs.default.writeFileSync(trackJson, JSON.stringify(hashes), 'utf8');
  });
}

module.exports =
/*#__PURE__*/
function () {
  var _process = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(_ref) {
    var _ref$fresh, fresh, _ref$shortNames, shortNames, _i, subdir;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _ref$fresh = _ref.fresh, fresh = _ref$fresh === void 0 ? false : _ref$fresh, _ref$shortNames = _ref.shortNames, shortNames = _ref$shortNames === void 0 ? false : _ref$shortNames;

            if (!fresh) {
              _context.next = 4;
              break;
            }

            _context.next = 4;
            return rmSync(trackDir);

          case 4:
            if (!existsSync(trackJson)) {
              try {
                _fs.default.mkdirSync(trackDir);
              } catch (err) {}

              _fs.default.writeFileSync(trackJson, '{}', 'utf8');
            }

            for (_i = 0; _i < subDirsToCrawl.length; _i++) {
              subdir = subDirsToCrawl[_i];
              crawlDir(_path.default.resolve(_projectDir.default, subdir), {
                shortNames: shortNames
              });
            }

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function process(_x) {
    return _process.apply(this, arguments);
  };
}();