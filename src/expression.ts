import { Expression } from './types';

const isWhitespace = /^\s*$/;
const isText = /^=/;
const isList = /^:/;

function createText(value:string):Expression {
  return (value.match(isWhitespace))
    ? { type: 'whitespace', value }
    : { type: 'text', value };
}

function createExpr(value:string):Expression {
  if (value.match(isList)) return { type: 'list', value: value.slice(1) };
  if (value.match(isText)) return { type: 'textExpr', value: value.slice(1) };
  return { type:'code', value };
}

export function get(text:string):string|undefined {
  const lastIndex = text.length - 1;
  if (text.indexOf('{') != 0 || text.lastIndexOf('}') != lastIndex) {
    return undefined;
  }
  text = text.substring(1, lastIndex);
  return '(' + text + ')';
};

export function parse(text:string):Expression[] {
  const re = /([^{]*)\{([^}]*)\}((.|[\r\n])*)/;
  const match = text.match(re);
  if (!match) return [ createText(text) ];

  const [prefix, ex, suffix] = match.slice(1);
  const expr = createExpr(ex);
  const ret = prefix
    ? [ createText(prefix), expr ]
    : [ expr ];

  return suffix
    ? ret.concat(parse(suffix))
    : ret;
}
