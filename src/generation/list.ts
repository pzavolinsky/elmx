import { ConstItem, WhitespaceItem, ListItem, ConstList, ElmList }
  from './types';

export const makeElm = (name:string):ElmList =>
  ({ type: 'elm', name });
const makeConst = (items:ConstItem[]):ConstList =>
  ({ type: 'const', items });
export const makeCode = (value:string):ConstList =>
  makeConst([{ type: 'code', value }]);
export const makeWhitespace = (value:string):ConstList =>
  makeConst([{ type: 'whitespace', value }]);

// Merges consecutive Const items into a single Const item
export const mergeList = (items:ListItem[]):ListItem[] =>
  items.reduce((list, item) => {
    if (item.type == 'elm') {
      return list.concat([item]);
    } else {
      const lastIndex = list.length - 1;
      const last = list[lastIndex];
      if (!last || last.type == 'elm') {
        return list.concat([item]);
      } else {
        return list.slice(0, lastIndex)
          .concat([makeConst([...last.items, ...item.items])]);
      }
    }
  },
  [] as ListItem[]);

const generateConstList = (items:ConstItem[]):string => {
  let first = true;
  const s = items.map(i => {
    if (i.type == 'whitespace') return i.value;
    if (first) { first = false; return i.value; }
    return `, ${i.value}`;
  }).join('');
  return first
    ? s         // pure whitespace
    : `[${s}]`; // at least some code in there
};

const allWhitespace = (items:ConstItem[]):items is WhitespaceItem[] =>
  items.filter(i => i.type == 'code').length == 0;
const allConst = (items:ListItem[]):items is ConstList[] =>
  items.filter(i => i.type == 'elm').length == 0;

export default (cs:ListItem[]):string => {
  let nonWs = 0;
  const s = cs.map(c => {
    if (c.type == 'const' && allWhitespace(c.items)) {
      return c.items.map(i => i.value).join('');
    }
    const value = c.type == 'elm'
      ? c.name
      : generateConstList(c.items);
    ++nonWs;
    return nonWs == 1
      ? value
      : ` ++ ${value}`;
  }).join('');
  return nonWs == 0
    ? `[${s}]`  // pure whitespace
    : nonWs == 1 && allConst(cs)
      ? s         // exactly one non-whitespace element
      : `(${s})`; // at least one Elm list in there
};
