"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var R = require("ramda");

var State = function () {
  function State(parent) {
    _classCallCheck(this, State);

    this.state = {
      children: [],
      attributes: []
    };
  }

  _createClass(State, [{
    key: "isRoot",
    value: function isRoot() {
      return !this.state.parent;
    }
  }, {
    key: "addExpression",
    value: function addExpression(expr) {
      this.state.children.push({ parent: this.state, expr: expr });
    }
  }, {
    key: "addCode",
    value: function addCode(code) {
      this.addExpression({ code: code });
    }
  }, {
    key: "get",
    value: function get() {
      return this.state;
    }
  }, {
    key: "enter",
    value: function enter(name, attributes) {
      var node = { name: name, parent: this.state, children: [], attributes: attributes };
      this.state.children.push(node);
      this.state = node;
    }
  }, {
    key: "exit",
    value: function exit() {
      this.state = this.state.parent;
    }
  }, {
    key: "dump",
    value: function dump(node) {
      var _this = this;

      var padd = arguments.length <= 1 || arguments[1] === undefined ? "" : arguments[1];

      if (!node) node = this.state;
      if (node.expr) return padd + JSON.stringify(node.expr) + '\n';
      return "" + padd + node.name + " [" + node.attributes.join(', ') + "]\n" + node.children.map(function (c) {
        return _this.dump(c, padd + "  ");
      }).join('');
    }
  }]);

  return State;
}();

module.exports = State;