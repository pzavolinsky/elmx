import parseElmx from '../parser';
import { parse as parseExpr } from '../expression';
import { Register } from './types';

const escapes:[RegExp, string][] = [
  [/\\n/g, '\n'],
  [/\\r/g, '\r'],
  [/\\t/g, '\t']
];

export const register:Register = (reg, { set }) => {
  const processElmx = (elmx:string) => set('elm', parseElmx(elmx));
  reg(/^processing (.*)$/, processElmx);
  reg(/^processing$/, processElmx);

  const parse = (expr:string) =>
    set(
      'expr',
      parseExpr(
        escapes.reduce((e, [f, r]) => e.replace(f, r), expr)
      )
    );
  reg(/^parsing '(.*)'$/, parse);
};
