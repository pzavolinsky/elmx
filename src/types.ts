// === Expressions ========================================================== //

export interface CodeExpression {
  type: 'code'
  value: string
}
export interface TextExpression {
  type: 'text'
  value: string
}
export interface TextConstExpression {
  type: 'textExpr'
  value: string
}
export interface WhitespaceExpression {
  type: 'whitespace'
  value: string
}
export interface ListExpression {
  type: 'list'
  value: string
}

export type Expression
  = CodeExpression
  | TextExpression
  | TextConstExpression
  | WhitespaceExpression
  | ListExpression;

// === Attributes =========================================================== //
export interface ConstAttribute {
  type: 'const'      // <img id="i1" />
  name: string       // name="id"
  value: string      // value="i1"
}
export interface ExpressionAttribute {
  type: 'expr'       // <img id={attr} />
  name: string       // name="id"
  value: string      // value="attr"
}
interface SingletonAttribute {
  type: 'var'        // <img {attr} />
  value: string      // value="attr"
}
interface ListAttribute {
  type: 'list'       // <img {:attrs} />
  value: string      // value="attrs"
}
export interface EmptyAttribute {
  type: 'empty'      // <img name />
  value: string      // value="name"
}
export type Attribute
  = ConstAttribute
  | ExpressionAttribute
  | SingletonAttribute
  | ListAttribute
  | EmptyAttribute;

// === Nodes ================================================================ //
export interface RawAttribute {
  name: string
  value: string
}

export interface RootNode {
  type: 'root'
  children: StateNode[]
}
export interface ExpressionNode {
  type: 'expr'
  parent: ContainerNode
  expr: Expression
}
export interface ViewNode {
  type: 'view'
  parent: ContainerNode
  name: string
  children: StateNode[]
  attributes: Attribute[]
}

export type ContainerNode
  = RootNode
  | ViewNode;

export type StateNode
  = ContainerNode
  | ExpressionNode;
