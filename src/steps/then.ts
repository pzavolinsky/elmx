import { Expression } from '../types';
import { Register } from './types';

export const register:Register = (reg, { get, equal }) => {
  const verboseEqual = <T>(actual:T, expected:T):void =>
    equal(
      actual,
      expected,
      `\nExpected: ${expected}\nActual:   ${actual}`
    );

  const checkElm = (expected:string) => verboseEqual(get('elm'), expected);
  reg(/^the elm is (.+)$/, checkElm);
  reg(/^the elm is$/, checkElm);

  const checkExprType = (pos:string, expected:string, value?:string) => {
    const index = pos
      ? parseInt(pos) - 1
      : 0;

    const expr = get<Expression[]>('expr');
    if (!pos) equal(expr.length, 1);
    equal(expr.length > index, true);
    equal(expr[index].type, expected);
    if (value !== undefined) verboseEqual(expr[index].value, value);
  };
  reg(/^the(?: (\d+)..)? expression type is (\S+)(?: with value '(.*)')?$/,
    checkExprType);
};
