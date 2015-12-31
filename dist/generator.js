'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var R = require('ramda');

function parseChildrenList(list, append) {

  if (!append && list.length == 1) return '[' + list[0].list + ']';

  var _R$splitWhen = R.splitWhen(function (i) {
    return i.list;
  }, list);

  var _R$splitWhen2 = _slicedToArray(_R$splitWhen, 2);

  var before = _R$splitWhen2[0];

  var _R$splitWhen2$ = _slicedToArray(_R$splitWhen2[1], 2);

  var item = _R$splitWhen2$[0];
  var after = _R$splitWhen2$[1];

  if (!item) return '' + (append ? ' ++ [' : '') + before.join("");

  var tail = after ? parseChildrenList(after, " ++ ") : "";

  var ret = before.length ? '' + (append ? ' ++ [' : '') + before.join("") + '] ++ ' + item.list + tail : '' + (append ? ' ++ ' : '') + item.list + tail;

  return !append ? '([' + ret + '])' : ret;
}

function parseChildren(children) {
  var first = true;

  var ret = children.map(function (c) {
    var expr = c.expr;

    if (expr) {
      if (expr.whitespace !== undefined) return expr.whitespace;
      if (expr.list) {
        first = true;
        return expr;
      }
    }
    var prefix = "";
    if (first) {
      first = false;
    } else {
      prefix = ", ";
    }
    return prefix + generate(c);
  });

  return R.any(function (i) {
    return i.list;
  }, ret) ? parseChildrenList(ret) : '[' + ret.join("") + ']';
}

function generateExpression(expr) {
  if (expr.code) return expr.code;
  if (expr.text) return 'Html.text "' + expr.text + '"';
  if (expr.textExpr) return 'Html.text ' + expr.textExpr;
  if (expr.whitespace !== undefined) return expr.whitespace;
  throw 'Invalid expression: ' + JSON.stringify(expr);
}

function generate(state) {
  var expr = state.expr;

  if (expr) return generateExpression(expr);

  if (!state.parent) {
    return state.children.map(generate).join("");
  }

  var name = state.name;
  var attributes = state.attributes.join(", ");
  var children = parseChildren(state.children);

  return 'Html.' + name + ' [' + attributes + '] ' + children;
}

module.exports = generate;