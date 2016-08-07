const R = require("ramda")

class State {
  constructor(parent) {
    this.attrBuffer = [];
    this.state = {
      children: [],
      attributes: []
    }
  }

  isRoot() {
    return !this.state.parent;
  }

  addExpression(expr) {
    this.state.children.push({ parent: this.state, expr });
  }

  addCode(code) {
    this.addExpression({ code });
  }

  get() {
    return this.state;
  }

  enter(name, attributes) {
    const node = { name, parent: this.state, children: [], attributes };
    this.state.children.push(node);
    this.state = node;
  }

  exit() {
    this.state = this.state.parent;
  }

  attr(name, value) {
    this.attrBuffer.push({ name, value });
  }
  popAttrs() {
    const attrs = this.attrBuffer;
    this.attrBuffer = [];
    return attrs;
  }

  dump(node, padd = "") {
    if (!node) node = this.state;
    return node.expr
      ? padd + JSON.stringify(node.expr) + '\n'
      : `${padd}${node.name} [${node.attributes.join(', ')}]\n`
        + node.children.map(c => this.dump(c, padd + "  ")).join('');
  }
}

module.exports = State;
