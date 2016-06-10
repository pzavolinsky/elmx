"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var R = require('ramda');

var isWhitespace = /^\s*$/;
var isText = /^=/;
var isList = /^:/;

function createText(text) {
  return text.match(isWhitespace) ? { whitespace: text } : { text: text };
}

function createExpr(expr) {
  if (expr.match(isList)) return { list: expr.slice(1) };
  if (expr.match(isText)) return { textExpr: expr.slice(1) };
  return { code: expr };
}

function get(text) {
  var lastIndex = text.length - 1;
  if (text.indexOf("{") != 0 || text.lastIndexOf("}") != lastIndex) return null;
  text = text.substring(1, lastIndex);
  return text.indexOf(" ") != -1 ? "(" + text + ")" : text;
}

function parse(text) {
  var re = /([^{]*)\{([^}]*)\}((.|[\r\n])*)/;
  var match = text.match(re);
  if (!match) return [createText(text)];

  var _match$slice = match.slice(1);

  var _match$slice2 = _slicedToArray(_match$slice, 3);

  var prefix = _match$slice2[0];
  var ex = _match$slice2[1];
  var suffix = _match$slice2[2];

  var expr = createExpr(ex);
  var ret = prefix ? [createText(prefix), expr] : [expr];

  return suffix ? R.concat(ret, parse(suffix)) : ret;
}

module.exports = {
  get: get,
  parse: parse
};