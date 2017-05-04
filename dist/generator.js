"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var list_1 = require("./generation/list");
var events_1 = require("./generation/events");
var parseChildren = function (children) {
    return list_1.mergeList(children.map(function (c) {
        return (c.type == 'expr' && c.expr.type == 'list')
            ? list_1.makeElm(c.expr.value)
            : c.type == 'expr' && c.expr.type == 'whitespace'
                ? list_1.makeWhitespace(c.expr.value)
                : list_1.makeCode(generate(c));
    }));
};
var getAttrValue = function (attr) {
    return attr.type == 'expr'
        ? "(" + attr.value + ")"
        : "\"" + attr.value.replace('"', '\\"') + "\"";
};
var parseAttributes = function (attrs) {
    return list_1.mergeList(attrs.map(function (a) {
        return a.type == 'list'
            ? list_1.makeElm(a.value)
            : list_1.makeCode(a.type == 'var'
                ? a.value
                : a.type == 'empty'
                    ? ''
                    : events_1.default(a.name)
                        ? "Html.Events." + a.name + " " + getAttrValue(a)
                        : "Html.Attributes.attribute \"" + a.name + "\" " + getAttrValue(a));
    }).filter(function (a) { return !!a; }) // remove empty attributes
    );
};
function generateExpression(expr) {
    switch (expr.type) {
        case 'whitespace':
        case 'code': return expr.value;
        case 'text': return "Html.text \"" + expr.value.replace(/"/g, '\\"') + "\"";
        case 'textExpr':
            var t = expr.value.trim();
            return t.charAt(0) != '(' && t.charAt(t.length - 1) != ')' && /\s/.test(t)
                ? "Html.text ( " + t + " )"
                : "Html.text " + t;
    }
    throw "Invalid expression: " + JSON.stringify(expr);
}
var getPrefix = function (name, keyed) {
    return !keyed
        ? name == 'text'
            ? "Html." + name
            : "Html.node \"" + name + "\""
        : name == 'ul' || name == 'ol'
            ? "Html.Keyed." + name
            : "Html.Keyed.node \"" + name + "\"";
};
var anyItem = function (fn, items) {
    return items.filter(fn).length > 0;
};
var isKeyed = function (node) {
    return anyItem(function (a) { return a.type == 'empty' && a.value == 'keyed'; }, node.attributes)
        || anyItem(// node has a children with a key attribute
        function (// node has a children with a key attribute
            c) { return c.type == 'view' && anyItem(isKeyAttr, c.attributes); }, node.children);
};
var isKeyAttr = function (attr) {
    return (attr.type == 'const' || attr.type == 'expr')
        && attr.name == 'key';
};
var getKey = function (attrs) {
    var attr = attrs.filter(isKeyAttr)[0];
    return attr.type == 'const'
        ? "\"" + attr.value + "\""
        : attr.value;
};
function generateView(node) {
    var nonKeyAttrs = node.attributes.filter(function (a) { return !isKeyAttr(a); });
    var attrs = list_1.default(parseAttributes(nonKeyAttrs));
    var childItems = list_1.default(parseChildren(node.children));
    var prefix = getPrefix(node.name, isKeyed(node));
    var elmNode = prefix + " " + attrs + " " + childItems;
    return nonKeyAttrs.length == node.attributes.length
        ? elmNode
        : "(" + getKey(node.attributes) + ", " + elmNode + ")";
}
var generate = function (node) {
    return node.type == 'expr'
        ? generateExpression(node.expr)
        : node.type == 'root'
            ? node.children.map(generate).join('')
            : generateView(node);
};
exports.default = generate;
