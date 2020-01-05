"use strict";
exports.makeElm = function (name) {
    return ({ type: 'elm', name: name });
};
var makeConst = function (items) {
    return ({ type: 'const', items: items });
};
exports.makeCode = function (value) {
    return makeConst([{ type: 'code', value: value }]);
};
exports.makeWhitespace = function (value) {
    return makeConst([{ type: 'whitespace', value: value }]);
};
// Merges consecutive Const items into a single Const item
exports.mergeList = function (items) {
    return items.reduce(function (list, item) {
        if (item.type == 'elm') {
            return list.concat([item]);
        }
        else {
            var lastIndex = list.length - 1;
            var last = list[lastIndex];
            if (!last || last.type == 'elm') {
                return list.concat([item]);
            }
            else {
                return list.slice(0, lastIndex)
                    .concat([makeConst(last.items.concat(item.items))]);
            }
        }
    }, []);
};
var generateConstList = function (items) {
    var first = true;
    var s = items.map(function (i) {
        if (i.type == 'whitespace')
            return i.value;
        if (first) {
            first = false;
            return i.value;
        }
        return ", " + i.value;
    }).join('');
    return first
        ? s // pure whitespace
        : "[" + s + "]"; // at least some code in there
};
var allWhitespace = function (items) {
    return items.filter(function (i) { return i.type == 'code'; }).length == 0;
};
var allConst = function (items) {
    return items.filter(function (i) { return i.type == 'elm'; }).length == 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = function (cs) {
    var nonWs = 0;
    var s = cs.map(function (c) {
        if (c.type == 'const' && allWhitespace(c.items)) {
            return c.items.map(function (i) { return i.value; }).join('');
        }
        var value = c.type == 'elm'
            ? c.name
            : generateConstList(c.items);
        ++nonWs;
        return nonWs == 1
            ? value
            : " ++ " + value;
    }).join('');
    return nonWs == 0
        ? "[" + s + "]" // pure whitespace
        : nonWs == 1 && allConst(cs)
            ? s // exactly one non-whitespace element
            : "(" + s + ")"; // at least one Elm list in there
};
