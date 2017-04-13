"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parser_1 = require("../parser");
var expression_1 = require("../expression");
var escapes = [
    [/\\n/g, '\n'],
    [/\\r/g, '\r'],
    [/\\t/g, '\t']
];
exports.register = function (reg, _a) {
    var set = _a.set;
    var processElmx = function (elmx) { return set('elm', parser_1.default(elmx)); };
    reg(/^processing (.*)$/, processElmx);
    reg(/^processing$/, processElmx);
    var parse = function (expr) {
        return set('expr', expression_1.parse(escapes.reduce(function (e, _a) {
            var f = _a[0], r = _a[1];
            return e.replace(f, r);
        }, expr)));
    };
    reg(/^parsing '(.*)'$/, parse);
};
