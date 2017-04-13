"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function count(what, where) {
    var m = where.match(new RegExp(what, 'g'));
    return m ? m.length : 0;
}
function reduceAttrs(data, attr) {
    var name = attr.name, value = attr.value;
    var buffer = data.buffer;
    var currentDepth = buffer
        ? buffer.depth
        : 0;
    var depth = currentDepth + count('{', value) - count('}', value);
    if (depth < 0) {
        throw "Extra '}' in '" + value + "' for attribute " + (name || buffer && buffer.name);
    }
    if (!buffer) {
        if (depth == 0)
            return { attrs: data.attrs.concat([attr]) };
        if (depth > 0)
            return {
                buffer: {
                    depth: depth,
                    name: name,
                    values: [value]
                },
                attrs: data.attrs
            };
        return data; // unreachable
    }
    if (name !== '')
        throw "Missing '}' in attribute value before '" + name + "'";
    // since name is '', this attr is a continuation of buffer
    var values = buffer.values.concat([value]);
    if (depth > 0)
        return {
            attrs: data.attrs,
            buffer: {
                depth: depth,
                name: buffer.name,
                values: values // append value to buffer
            }
        };
    var item = { name: buffer.name, value: values.join(' ') };
    return { attrs: data.attrs.concat([item]) };
}
var parse = function (_a) {
    var name = _a.name, value = _a.value;
    return name
        ? value.match(/^\{.*\}$/)
            ? { type: 'expr', name: name, value: value.slice(1, value.length - 1) }
            : { type: 'const', name: name, value: value }
        : value.match(/^\{:.*\}$/)
            ? { type: 'list', value: value.slice(2, value.length - 1) }
            : value.match(/^\{.*\}$/)
                ? { type: 'var', value: value.slice(1, value.length - 1) }
                : { type: 'empty', value: value };
};
function default_1(attrs) {
    var data = attrs
        .map(function (a) { return a.value === '' ? { name: '', value: a.name } : a; }) // flip empty
        .reduce(reduceAttrs, { attrs: [] });
    if (data.buffer)
        throw "Missing '}' in attribute value";
    return data.attrs.map(parse);
}
exports.default = default_1;
