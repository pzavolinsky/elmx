class State {
  isRoot() {
    return !this.state;
  }
  setHasChildren(val) {
    if (!this.state) return;
    this.state.hasChildren = val;
  }

  isFirst() {
    return this.state && (
      !this.state.parent
      || !this.state.parent.hasChildren
        && this.state.parent.children.length == 1
    );
  }

  enter(name) {
    var node = { name: name, children: [], parent: this.state }
    if (this.state) this.state.children.push(node);
    this.state = node;
  }

  exit() {
    this.state = this.state.parent;
  }
}

module.exports = State;
