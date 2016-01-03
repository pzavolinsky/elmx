const htmlparser = require("htmlparser2");
const State = require("./state");
const attrParser = require("./attributes");
const expr = require("./expression");
const strip = require("./strip-elmx");
const generate = require("./generator");
const R = require("ramda");

function enableModules(content) {
  return content.replace(/--(import Html)/g, "$1");
}

function parse(elmx) {
  const state = new State();
  // let padding = "";

  let parser = new htmlparser.Parser({
    onopentag: function(name, attrs) {
      state.enter(name, attrParser(attrs));
    },
    ontext: function(text) {
      // padding = R.last(text.match(/(?:^|[\r\n])([ \t]*)$/) || [""]);

      if (state.isRoot()) {
        state.addCode(text);
        return;
      }

      R.forEach(ex => state.addExpression(ex), expr.parse(text));
    },
    onclosetag: function(tagname) {
      state.exit();
    }
  },
  {
    decodeEntities: true,
    lowerCaseTags: false,
    lowerCaseAttributeNames: false
  });
  parser.write(elmx);
  parser.end();

  // console.log('ast', state.dump());

  return generate(state.get());
}

module.exports = R.compose(
  parse,
  strip,
  enableModules
);
