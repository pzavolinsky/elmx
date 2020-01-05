"use strict";
exports.register = function (reg, _a) {
    var get = _a.get, equal = _a.equal;
    var verboseEqual = function (actual, expected) {
        return equal(actual, expected, "\nExpected: " + expected + "\nActual:   " + actual);
    };
    var checkElm = function (expected) { return verboseEqual(get('elm'), expected); };
    reg(/^the elm is (.+)$/, checkElm);
    reg(/^the elm is$/, checkElm);
    var checkExprType = function (pos, expected, value) {
        var index = pos
            ? parseInt(pos) - 1
            : 0;
        var expr = get('expr');
        if (!pos)
            equal(expr.length, 1);
        equal(expr.length > index, true);
        equal(expr[index].type, expected);
        if (value !== undefined)
            verboseEqual(expr[index].value, value);
    };
    reg(/^the(?: (\d+)..)? expression type is (\S+)(?: with value '(.*)')?$/, checkExprType);
};
