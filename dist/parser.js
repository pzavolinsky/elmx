"use strict";
var htmlparser = require('htmlparser2');
var state_1 = require('./state');
var attributes_1 = require('./attributes');
var expression_1 = require('./expression');
var generator_1 = require('./generator');
var PIPE_BACKWARDS = '##!!PIPE_BACKWARDS!!##';
var PIPE_REGEX = new RegExp(PIPE_BACKWARDS, 'g');
function parse(elmx) {
    var state = new state_1.default();
    var addExpression = state.addExpression.bind(state);
    var parser = new htmlparser.Parser({
        onopentag: function (name) {
            var attrs = state.popAttrs();
            state.enter(name, attributes_1.default(attrs));
        },
        onattribute: function (name, value) {
            state.attr(name, value);
        },
        ontext: function (text) {
            if (state.isRoot()) {
                state.addCode(text);
                return;
            }
            expression_1.parse(text).forEach(addExpression);
        },
        onclosetag: function (tagname) {
            state.exit();
        }
    }, {
        decodeEntities: true,
        lowerCaseTags: false,
        lowerCaseAttributeNames: false
    });
    parser.write(elmx.replace(/<\|/g, PIPE_BACKWARDS));
    parser.end();
    return state;
}
exports.parse = parse;
;
function generate(state) {
    return generator_1.default(state.get()).replace(PIPE_REGEX, '<|');
}
exports.generate = generate;
;
function default_1(elmx) {
    var state = parse(elmx);
    // console.log(state.dump());
    return generate(state);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
;
