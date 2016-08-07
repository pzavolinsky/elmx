"use strict";

var htmlparser = require("htmlparser2");
var State = require("./state");
var attrParser = require("./attributes");
var expr = require("./expression");
var generate = require("./generator");
var R = require("ramda");

var PIPE_BACKWARDS = '##!!PIPE_BACKWARDS!!##';
var PIPE_REGEX = new RegExp(PIPE_BACKWARDS, 'g');

module.exports = function (elmx) {
  var state = new State();

  var parser = new htmlparser.Parser({
    onopentag: function onopentag(name) {
      var attrs = state.popAttrs();
      state.enter(name, attrParser(attrs));
    },
    onattribute: function onattribute(name, value) {
      state.attr(name, value);
    },
    ontext: function ontext(text) {
      if (state.isRoot()) {
        state.addCode(text);
        return;
      }

      R.forEach(function (ex) {
        return state.addExpression(ex);
      }, expr.parse(text));
    },
    onclosetag: function onclosetag(tagname) {
      state.exit();
    }
  }, {
    decodeEntities: true,
    lowerCaseTags: false,
    lowerCaseAttributeNames: false
  });
  parser.write(elmx.replace(/<\|/g, PIPE_BACKWARDS));
  parser.end();

  return generate(state.get()).replace(PIPE_REGEX, '<|');
};