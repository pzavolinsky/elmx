const htmlparser = require("htmlparser2");
const state = require("./state");
const attrParser = require("./attributes");
const expr = require("./expression");
const strip = require("./strip-elmx");
const R = require("ramda");

const textRegex = /^(\()?=/;
const whitespace = /^\s*$/;

function parseExpression(text) {
  var first = true;

  return expr.parse(text).map(ex => {

    if (ex.text && ex.text.match(whitespace)) return ex.text;

    var prefix = "";
    if (first) {
      first = false;
    } else {
      prefix = ", ";
    }

    state.setHasChildren();

    if (ex.text) return prefix + 'Html.text "' + ex.text + '"';

    return prefix + (ex.expr.match(textRegex)
      ? "Html.text " + ex.expr.replace(textRegex, "$1")
      : ex.expr);
  }).join('');
}

function enableModules(content) {
  return content.replace(/--(import Html)/g, "$1");
}

function parse(elmx) {
  var elm = [];

  var parser = new htmlparser.Parser({
    onopentag: function(name, attrs) {
      state.enter(name);
      const a = attrParser(attrs);
      if (!state.isFirst()) elm.push(", ");
      elm.push("Html."+name+" [" + a + "] [");
    },
    ontext: function(text) {
      elm.push(state.isRoot() ? text : parseExpression(text));
    },
    onclosetag: function(tagname) {
      elm.push("]");
      state.exit();
    }
  }, {
    decodeEntities: true,
    lowerCaseTags: false,
    lowerCaseAttributeNames: false
  });
  parser.write(elmx);
  parser.end();

  return elm.join("");
}

module.exports = R.compose(
  parse,
  strip,
  enableModules
);
