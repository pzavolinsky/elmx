"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isWhitespace = /^\s*$/;
var isText = /^=/;
var isList = /^:/;
function createText(value) {
    return (value.match(isWhitespace))
        ? { type: 'whitespace', value: value }
        : { type: 'text', value: value };
}
function createExpr(value) {
    if (value.match(isList))
        return { type: 'list', value: value.slice(1) };
    if (value.match(isText))
        return { type: 'textExpr', value: value.slice(1) };
    return { type: 'code', value: value };
}
function get(text) {
    var lastIndex = text.length - 1;
    if (text.indexOf('{') != 0 || text.lastIndexOf('}') != lastIndex) {
        return undefined;
    }
    text = text.substring(1, lastIndex);
    return '(' + text + ')';
}
exports.get = get;
;
function parse(text) {
    var re = /([^{]*)\{([^}]*)\}((.|[\r\n])*)/;
    var match = text.match(re);
    if (!match)
        return [createText(text)];
    var _a = match.slice(1), prefix = _a[0], ex = _a[1], suffix = _a[2];
    var expr = createExpr(ex);
    var ret = prefix
        ? [createText(prefix), expr]
        : [expr];
    return suffix
        ? ret.concat(parse(suffix))
        : ret;
}
exports.parse = parse;
