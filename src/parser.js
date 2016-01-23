const htmlparser = require("htmlparser2");
const State = require("./state");
const attrParser = require("./attributes");
const expr = require("./expression");
const generate = require("./generator");
const R = require("ramda");

module.exports = function(elmx) {
  const state = new State();

  let parser = new htmlparser.Parser({
    onopentag: function(name, attrs) {
      state.enter(name, attrParser(attrs));
    },
    ontext: function(text) {
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

  return generate(state.get());
}
