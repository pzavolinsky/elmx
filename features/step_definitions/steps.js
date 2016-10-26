'use strict';

var equal = require('assert').equal;
var when = require('../../dist/steps/when');
var then = require('../../dist/steps/then');

module.exports = function() {
  var ctx;
  this.registerHandler('BeforeScenario', function(s) { ctx = {}; });
  var args = {
    get: function(name) { return ctx[name]; },
    set: function(name, value) { ctx[name] = value; },
    equal: equal
  };

  when.register(this.When.bind(this), args);
  then.register(this.Then.bind(this), args);
};
