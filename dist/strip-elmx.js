"use strict";

var R = require("ramda");

function stripElmxDefinition(content) {
  // elmx : Html
  // elmx = Html.text ""
  return content.replace(/([\r\n])elmx\s+[^\r\n]*/g, "$1");
}

function stripElmxComments(content) {
  // elmx {- ... -}

  var matchStart = content.match(/elmx\s+\{-\s*/);
  if (!matchStart) return content;

  var start = matchStart.index;

  var matchEndRe = /\s*-\}/;
  matchEndRe.lastIndex = start;

  var matchEnd = content.match(matchEndRe);
  if (!matchEnd) throw "Missing closing '-}' for 'elmx {-' tag";

  var end = matchEnd.index;

  return stripElmxComments(content.slice(0, start) + content.slice(start + matchStart[0].length, end) + content.slice(end + matchEnd[0].length));
}

module.exports = R.compose(stripElmxComments, stripElmxDefinition);