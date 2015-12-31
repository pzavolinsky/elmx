"use strict";

var htmlparser = require("htmlparser2");
var State = require("./state");
var attrParser = require("./attributes");
var expr = require("./expression");
var strip = require("./strip-elmx");
var R = require("ramda");

var textRegex = /^(\()?=/;
var whitespace = /^\s*$/;

function parseExpression(state, text) {
  var first = true;

  return expr.parse(text).map(function (ex) {

    if (ex.text && ex.text.match(whitespace)) return ex.text;

    var prefix = "";
    if (first) {
      first = false;
    } else {
      prefix = ", ";
    }

    state.setHasChildren(true);

    if (ex.text) return prefix + 'Html.text "' + ex.text + '"';

    return prefix + (ex.expr.match(textRegex) ? "Html.text " + ex.expr.replace(textRegex, "$1") : ex.expr);
  }).join('');
}

function enableModules(content) {
  return content.replace(/--(import Html)/g, "$1");
}

function parse(elmx) {
  var state = new State();

  var elm = [];

  var parser = new htmlparser.Parser({
    onopentag: function onopentag(name, attrs) {
      state.enter(name);
      var a = attrParser(attrs);
      if (!state.isFirst()) elm.push(", ");
      elm.push("Html." + name + " [" + a + "] [");
    },
    ontext: function ontext(text) {
      elm.push(state.isRoot() ? text : parseExpression(state, text));
    },
    onclosetag: function onclosetag(tagname) {
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

module.exports = R.compose(parse, strip, enableModules);