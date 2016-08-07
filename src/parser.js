const htmlparser = require("htmlparser2");
const State = require("./state");
const attrParser = require("./attributes");
const expr = require("./expression");
const generate = require("./generator");
const R = require("ramda");

const PIPE_BACKWARDS = '##!!PIPE_BACKWARDS!!##';
const PIPE_REGEX = new RegExp(PIPE_BACKWARDS, 'g');

module.exports = function(elmx) {
  const state = new State();

  let parser = new htmlparser.Parser({
    onopentag: function(name) {
      const attrs = state.popAttrs();
      state.enter(name, attrParser(attrs));
    },
    onattribute: function(name, value) {
      state.attr(name, value);
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
  parser.write(elmx.replace(/<\|/g, PIPE_BACKWARDS));
  parser.end();

  return generate(state.get()).replace(PIPE_REGEX, '<|');
}
