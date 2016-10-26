import
  { RawAttribute
  , Attribute
  , StateNode
  , ContainerNode
  , ViewNode
  , Expression
  } from './types';

class State {
  attrBuffer: RawAttribute[];
  state: ContainerNode;
  constructor() {
    this.attrBuffer = [];
    this.state = { type: 'root', children: [] };
  }

  isRoot() {
    return this.state.type == 'root';
  }

  addExpression(expr:Expression) {
    this.state.children.push({
      type: 'expr',
      parent: this.state,
      expr,
      children: []
    });
  }

  addCode(value:string) {
    this.addExpression({ type: 'code', value });
  }

  get() {
    return this.state;
  }

  enter(name:string, attributes:Attribute[]) {
    const node:ViewNode = {
      type: 'view',
      name,
      parent: this.state,
      children: [],
      attributes
    };
    this.state.children.push(node);
    this.state = node;
  }

  exit() {
    if (this.state.type == 'view') {
      this.state = this.state.parent;
    }
  }

  attr(name:string, value:string) {
    this.attrBuffer.push({ name, value });
  }
  popAttrs() {
    const attrs = this.attrBuffer;
    this.attrBuffer = [];
    return attrs;
  }

  dump(node?:StateNode, padd = ''):string {
    if (!node) node = this.state;
    switch (node.type) {
      case 'expr':
        return padd + JSON.stringify(node.expr) + '\n';
      case 'view':
        return `${padd}${node.name} ${JSON.stringify(node.attributes)}\n`
          + node.children.map(c => this.dump(c, padd + '  ')).join('');
      default:
        return node.children.map(c => this.dump(c, padd + '  ')).join('');
    }
  }
}

export default State;
