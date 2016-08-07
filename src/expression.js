const R = require('ramda');

const isWhitespace = /^\s*$/;
const isText = /^=/;
const isList = /^:/;

function createText(text) {
  return (text.match(isWhitespace))
    ? { whitespace: text }
    : { text };
}

function createExpr(expr) {
  if (expr.match(isList)) return { list: expr.slice(1) };
  if (expr.match(isText)) return { textExpr: expr.slice(1) };
  return { code: expr };
}

function get(text) {
  const lastIndex = text.length - 1;
  if (text.indexOf("{") != 0 || text.lastIndexOf("}") != lastIndex) return null;
  text = text.substring(1, lastIndex);
  return "(" + text + ")";
}

function parse(text) {
  const re = /([^{]*)\{([^}]*)\}((.|[\r\n])*)/
  var match = text.match(re);
  if (!match) return [ createText(text) ];

  const [prefix, ex, suffix] = match.slice(1);
  const expr = createExpr(ex);
  const ret = prefix
    ? [ createText(prefix), expr ]
    : [ expr ];

  return suffix
    ? R.concat(ret, parse(suffix))
    : ret;
}

module.exports = {
  get,
  parse
};
