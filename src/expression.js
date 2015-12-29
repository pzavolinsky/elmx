const R = require('ramda');

function get(text) {
  const lastIndex = text.length - 1;
  if (text.indexOf("{") != 0 || text.lastIndexOf("}") != lastIndex) return null;
  text = text.substring(1, lastIndex);
  return (text.indexOf(" ") != -1)
    ? "(" + text + ")"
    : text;
}

function parse(text) {
  const re = /([^{]*)\{([^}]*)\}((.|[\r\n])*)/
  var match = text.match(re);
  if (!match) return [ { text } ];

  const [prefix, expr, suffix] = match.slice(1);
  const ret = prefix
    ? [ { text: prefix }, { expr } ]
    : [ { expr } ];

  return suffix
    ? R.concat(ret, parse(suffix))
    : ret;
}

module.exports = {
  get,
  parse
};
