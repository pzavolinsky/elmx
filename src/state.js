const R = require("ramda")

class State {
  constructor(parent) {
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
    var node = { name: name, parent: this.state, children: [], attributes };
    this.state.children.push(node);
    this.state = node;
  }

  exit() {
    this.state = this.state.parent;
  }

  dump(node, padd = "") {
    if (!node) node = this.state;
    if (node.expr) return padd + JSON.stringify(node.expr) + '\n';
    return `${padd}${node.name} [${node.attributes.join(', ')}]\n`
      + node.children.map(c => this.dump(c, padd + "  ")).join('');
  }
}

module.exports = State;
