"use strict";

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var R = require("ramda");
var expr = require("./expression");

function count(what, where) {
  var m = where.match(new RegExp(what, "g"));
  return m ? m.length : 0;
}

function missingCloseBracket(data) {
  throw "Missing '}' in value for attribute '" + data.name + "'";
}

function reduceAttrs(data, attr) {
  var _attr = _slicedToArray(attr, 2);

  var name = _attr[0];
  var value = _attr[1];

  var depth = data.depth + count("{", value) - count("}", value);
  if (depth < 0) {
    throw "Extra '}' in '" + value + "' for attribute " + (name || data.name);
  }

  if (!data.depth) {
    if (depth > 0) return { depth: depth, name: name, values: [value], items: data.items };
    if (depth == 0) return { depth: depth, items: R.append(attr, data.items) };
  }

  if (name !== '') return missingCloseBracket(data);

  var values = R.append(value, data.values);

  if (depth > 0) return R.merge(data, { depth: depth, values: values });

  var item = [data.name, values.join(' ')];
  return { depth: depth, items: R.append(item, data.items) };
}

function mapAttribute(attr) {
  var _attr2 = _slicedToArray(attr, 2);

  var name = _attr2[0];
  var value = _attr2[1];

  if (name === '') return expr.get(value);

  var attrValue = expr.get(value) || '"' + value + '"';
  return 'Html.Attributes.attribute "' + name + '" ' + attrValue;
}

function parse(attrs) {
  var depth = 0;
  var name;
  var value;
  var a = R.compose(R.join(", "), R.map(mapAttribute), function (data) {
    return data.depth ? missingCloseBracket(data) : data.items;
  }, R.reduce(reduceAttrs, { depth: 0, items: [] }), R.map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2);

    var n = _ref2[0];
    var v = _ref2[1];
    return v === '' ? ['', n] : [n, v];
  }), R.toPairs)(attrs);

  return a;
}

module.exports = parse;