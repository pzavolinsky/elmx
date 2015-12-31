"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var State = (function () {
  function State() {
    _classCallCheck(this, State);
  }

  _createClass(State, [{
    key: "isRoot",
    value: function isRoot() {
      return !this.state;
    }
  }, {
    key: "setHasChildren",
    value: function setHasChildren(val) {
      if (!this.state) return;
      this.state.hasChildren = val;
    }
  }, {
    key: "isFirst",
    value: function isFirst() {
      return this.state && (!this.state.parent || !this.state.parent.hasChildren && this.state.parent.children.length == 1);
    }
  }, {
    key: "enter",
    value: function enter(name) {
      var node = { name: name, children: [], parent: this.state };
      if (this.state) this.state.children.push(node);
      this.state = node;
    }
  }, {
    key: "exit",
    value: function exit() {
      this.state = this.state.parent;
    }
  }]);

  return State;
})();

module.exports = State;