import
  { StateNode
  , ViewNode
  , Attribute
  , ExpressionAttribute
  , ConstAttribute
  , Expression
  } from './types';
import generateList, { makeElm, makeCode, makeWhitespace, mergeList }
  from './generation/list';
import isEvent from './generation/events';

const parseChildren = (children:StateNode[]) =>
  mergeList(
    children.map(c =>
      (c.type == 'expr' && c.expr.type == 'list')
         ? makeElm(c.expr.value)
         : c.type == 'expr' && c.expr.type == 'whitespace'
            ? makeWhitespace(c.expr.value)
            : makeCode(generate(c))
    )
  );

const getAttrValue = (attr:ExpressionAttribute|ConstAttribute):string =>
  attr.type == 'expr'
  ? `(${attr.value})`
  : `"${attr.value.replace('"', '\\"')}"`;

const parseAttributes = (attrs:Attribute[]) =>
  mergeList(
    attrs.map(a =>
      a.type == 'list'
    ? makeElm(a.value)
    : makeCode(
        a.type == 'var'
        ? a.value
        : a.type == 'empty'
          ? ''
          : isEvent(a.name)
            ? `Html.Events.${a.name} ${getAttrValue(a)}`
            : `Html.Attributes.attribute "${a.name}" ${getAttrValue(a)}`
      )
    ).filter(a => !!a) // remove empty attributes
  );

function generateExpression(expr:Expression) {
  switch (expr.type) {
    case 'whitespace':
    case 'code': return expr.value;
    case 'text': return `Html.text "${expr.value.replace(/"/g, '\\"')}"`;
    case 'textExpr':
      const t = expr.value.trim();
      return t.charAt(0) !== '('
        && t.charAt(t.length - 1) !== ')'
        && /\s/.test(t)
        ? `Html.text (${t})`
        : `Html.text ${t}`;
  }
  throw `Invalid expression: ${JSON.stringify(expr)}`;
}

const getPrefix = (name:string, keyed:boolean):string =>
  !keyed
  ? name == 'text'
    ? `Html.${name}`
    : `Html.node "${name}"`
  : name == 'ul' || name == 'ol'
    ? `Html.Keyed.${name}`
    : `Html.Keyed.node "${name}"`;

const anyItem = <T>(fn:(item:T) => boolean, items:T[]):boolean =>
  items.filter(fn).length > 0;

const isKeyed = (node:ViewNode):boolean =>
  anyItem(a => a.type == 'empty' && a.value == 'keyed',  node.attributes)
  || anyItem( // node has a children with a key attribute
      c => c.type == 'view' && anyItem(isKeyAttr, c.attributes),
      node.children
    );
const isKeyAttr = (attr:Attribute):boolean =>
  (attr.type == 'const' || attr.type == 'expr')
  && attr.name == 'key';
const getKey = (attrs:Attribute[]):string => {
  const attr = attrs.filter(isKeyAttr)[0];
  return attr.type == 'const'
    ? `"${attr.value}"`
    : attr.value;
};

function generateView(node:ViewNode):string {

  const nonKeyAttrs = node.attributes.filter(a => !isKeyAttr(a));

  const attrs = generateList(parseAttributes(nonKeyAttrs));
  const childItems = generateList(parseChildren(node.children));

  const prefix = getPrefix(node.name, isKeyed(node));

  const elmNode = `${prefix} ${attrs} ${childItems}`;

  return nonKeyAttrs.length == node.attributes.length
    ? elmNode
    : `(${getKey(node.attributes)}, ${elmNode})`;
}

const generate = (node:StateNode):string =>
  node.type == 'expr'
  ? generateExpression(node.expr)
  : node.type == 'root'
    ? node.children.map(generate).join('')
    : generateView(node);

export default generate;
