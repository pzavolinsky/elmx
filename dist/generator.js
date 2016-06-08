'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

var R = require('ramda');

function groupChildren(list) {
  var _R$splitWhen = R.splitWhen(function (i) {
    return i.list;
  }, list);

  var _R$splitWhen2 = _slicedToArray(_R$splitWhen, 2);

  var before = _R$splitWhen2[0];

  var _R$splitWhen2$ = _toArray(_R$splitWhen2[1]);

  var item = _R$splitWhen2$[0];

  var after = _R$splitWhen2$.slice(1);

  if (!item) return [before];
  if (!after) return [before, item];
  return [before, item].concat(groupChildren(after));
}

function parseChildrenList(list) {
  var items = groupChildren(list).filter(function (group) {
    return group.length !== 0;
  }).map(function (group) {
    return group.list || '[' + group.join('') + ']';
  });

  return items.length == 1 ? items[0] : '(' + items.join(' ++ ') + ')';
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
  if (expr.text) return 'Html.text "' + expr.text.replace(/"/g, '\\"') + '"';
  if (expr.textExpr) return 'Html.text ' + expr.textExpr;
  if (expr.whitespace !== undefined) return expr.whitespace;
  throw 'Invalid expression: ' + JSON.stringify(expr);
}

function generateAttributeList(simple, compound) {
  var all = ['[' + simple.join(", ") + ']'].concat(_toConsumableArray(compound));
  if (!simple.length && compound.length) all = all.slice(1);
  return all.length == 1 ? all[0] : '(' + all.join(" ++ ") + ')';
}

function generate(state) {
  var expr = state.expr;

  if (expr) return generateExpression(expr);

  if (!state.parent) {
    return state.children.map(generate).join("");
  }

  var name = state.name;

  var _R$partition = R.partition(function (x) {
    return x ? x.match(/^:.*/) : false;
  }, state.attributes);

  var _R$partition2 = _slicedToArray(_R$partition, 2);

  var compound = _R$partition2[0];
  var simple = _R$partition2[1];

  var attributes = generateAttributeList(simple, compound.map(function (x) {
    return x.substr(1);
  }));
  var children = parseChildren(state.children);
  return 'Html.' + name + ' ' + attributes + ' ' + children;
}

generate.parseChildrenList = parseChildrenList;

module.exports = generate;