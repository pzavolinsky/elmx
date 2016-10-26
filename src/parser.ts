import * as htmlparser from 'htmlparser2';
import State from './state';
import attrParser from './attributes';
import { parse as parseExpr } from './expression';
import generateNode from './generator';

const PIPE_BACKWARDS = '##!!PIPE_BACKWARDS!!##';
const PIPE_REGEX = new RegExp(PIPE_BACKWARDS, 'g');

export function parse(elmx:string):State {
  const state = new State();
  const addExpression = state.addExpression.bind(state);

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

      parseExpr(text).forEach(addExpression);
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

  return state;
};

export function generate(state:State):string {
    return generateNode(state.get()).replace(PIPE_REGEX, '<|');
};

export default function(elmx:string):string {
  const state = parse(elmx);
  // console.log(state.dump());
  return generate(state);
};
