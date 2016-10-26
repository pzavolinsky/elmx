"use strict";
var State = (function () {
    function State() {
        this.attrBuffer = [];
        this.state = { type: 'root', children: [] };
    }
    State.prototype.isRoot = function () {
        return this.state.type == 'root';
    };
    State.prototype.addExpression = function (expr) {
        this.state.children.push({
            type: 'expr',
            parent: this.state,
            expr: expr,
            children: []
        });
    };
    State.prototype.addCode = function (value) {
        this.addExpression({ type: 'code', value: value });
    };
    State.prototype.get = function () {
        return this.state;
    };
    State.prototype.enter = function (name, attributes) {
        var node = {
            type: 'view',
            name: name,
            parent: this.state,
            children: [],
            attributes: attributes
        };
        this.state.children.push(node);
        this.state = node;
    };
    State.prototype.exit = function () {
        if (this.state.type == 'view') {
            this.state = this.state.parent;
        }
    };
    State.prototype.attr = function (name, value) {
        this.attrBuffer.push({ name: name, value: value });
    };
    State.prototype.popAttrs = function () {
        var attrs = this.attrBuffer;
        this.attrBuffer = [];
        return attrs;
    };
    State.prototype.dump = function (node, padd) {
        var _this = this;
        if (padd === void 0) { padd = ''; }
        if (!node)
            node = this.state;
        switch (node.type) {
            case 'expr':
                return padd + JSON.stringify(node.expr) + '\n';
            case 'view':
                return ("" + padd + node.name + " " + JSON.stringify(node.attributes) + "\n")
                    + node.children.map(function (c) { return _this.dump(c, padd + '  '); }).join('');
            default:
                return node.children.map(function (c) { return _this.dump(c, padd + '  '); }).join('');
        }
    };
    return State;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = State;
