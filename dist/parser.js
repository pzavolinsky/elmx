"use strict";

var htmlparser = require("htmlparser2");
var State = require("./state");
var attrParser = require("./attributes");
var expr = require("./expression");
var strip = require("./strip-elmx");
var generate = require("./generator");
var R = require("ramda");

function enableModules(content) {
  return content.replace(/--(import Html)/g, "$1");
}

function parse(elmx) {
  var state = new State();
  // let padding = "";

  var parser = new htmlparser.Parser({
    onopentag: function onopentag(name, attrs) {
      state.enter(name, attrParser(attrs));
    },
    ontext: function ontext(text) {
      // padding = R.last(text.match(/(?:^|[\r\n])([ \t]*)$/) || [""]);

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
  parser.write(elmx);
  parser.end();

  return generate(state.get());
}

module.exports = R.compose(parse, strip, enableModules);